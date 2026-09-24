import { spawnSync } from 'node:child_process';
import { llamaServerBin } from './llama-server';
import { describeVllmRuntime, vllmAvailable } from './vllm';

export type HostOs = 'darwin' | 'linux' | 'win32';
export type OsSupport = 'full' | 'partial' | 'none';
export type RuntimeModality = 'text' | 'image' | 'video' | 'tts' | 'stt' | 'tool';

export type RuntimeSpec = {
  id: string;
  name: string;
  modalities: RuntimeModality[];
  recommended: boolean;
  docs: string;
  support: Record<HostOs, OsSupport>;
  install: Record<HostOs, string>;
  notes: Record<HostOs, string>;
};

export type RuntimeProbe = {
  installed: boolean;
  configured: boolean;
  version: string | null;
  path: string | null;
  detail: string;
};

export type RuntimeReportItem = RuntimeSpec &
  RuntimeProbe & {
    applicable: boolean;
    status: 'installed' | 'configured' | 'missing' | 'unsupported';
    /** Host OS has a package-manager argv the gateway can spawn. */
    installable: boolean;
  };

export type RuntimesReport = {
  host: {
    os: HostOs;
    osLabel: string;
    arch: string;
    platform: string;
  };
  items: RuntimeReportItem[];
};

/** Homebrew / local bins even when the gateway was started with a thin PATH. */
export function packageManagerPath(): string {
  const sep = process.platform === 'win32' ? ';' : ':';
  const extra =
    process.platform === 'win32'
      ? []
      : [
          '/opt/homebrew/bin',
          '/usr/local/bin',
          '/home/linuxbrew/.linuxbrew/bin',
        ];
  return [...extra, process.env.PATH || ''].filter(Boolean).join(sep);
}

export function whichBin(name: string): string | null {
  const cmd = process.platform === 'win32' ? 'where' : 'which';
  const r = spawnSync(cmd, [name], {
    encoding: 'utf8',
    env: { ...process.env, PATH: packageManagerPath() },
  });
  const p = (r.stdout || '').trim().split(/\r?\n/)[0] || '';
  return r.status === 0 && p ? p : null;
}

function versionLine(bin: string, args: string[]): string | null {
  const r = spawnSync(bin, args, { encoding: 'utf8', timeout: 8_000 });
  const out = `${r.stdout || ''}\n${r.stderr || ''}`.trim();
  if (r.status !== 0 && !out) return null;
  const line = out.split(/\r?\n/)[0] || '';
  const m = line.match(/v?(\d+\.\d+\.\d+(?:[-+][\w.]+)?)/i);
  return m ? m[1] : line.slice(0, 80) || null;
}

export function hostOs(): HostOs {
  const p = process.platform;
  if (p === 'darwin' || p === 'linux' || p === 'win32') return p;
  return 'linux';
}

export function osLabel(os: HostOs): string {
  if (os === 'darwin') return 'macOS';
  if (os === 'win32') return 'Windows';
  return 'Linux';
}

export const RUNTIME_SPECS: RuntimeSpec[] = [
  {
    id: 'llamacpp',
    name: 'llama.cpp',
    modalities: ['text'],
    recommended: true,
    docs: 'https://github.com/ggml-org/llama.cpp',
    support: { darwin: 'full', linux: 'full', win32: 'full' },
    install: {
      darwin: 'brew install llama.cpp',
      linux: 'Follow llama.cpp build docs, then put llama-server on PATH',
      win32: 'winget install ggml.llamacpp   # or use WSL2 + the Linux build',
    },
    notes: {
      darwin: 'Provides llama-server. Override with OMNI_LLAMA_SERVER.',
      linux: 'Build with CUDA/Vulkan as needed. Override with OMNI_LLAMA_SERVER.',
      win32: 'Official Windows builds or WSL2. Override with OMNI_LLAMA_SERVER.',
    },
  },
  {
    id: 'vllm',
    name: 'vLLM',
    modalities: ['text'],
    recommended: false,
    docs: 'https://docs.vllm.ai/',
    support: { darwin: 'none', linux: 'full', win32: 'none' },
    install: {
      darwin: 'Not supported on macOS. Use llama.cpp or MLX instead.',
      linux:
        'pip install vllm\n# or: python3 -m vllm.entrypoints.openai.api_server --model <hf-id>',
      win32: 'Not supported natively. Use WSL2 + CUDA Linux.',
    },
    notes: {
      darwin: 'Needs NVIDIA CUDA. This host cannot run vLLM.',
      linux: 'Requires NVIDIA GPU + CUDA. OMNI_VLLM or OMNI_VLLM_MODULE=1.',
      win32: 'Use WSL2 with a CUDA-capable GPU.',
    },
  },
  {
    id: 'mlx',
    name: 'MLX',
    modalities: ['text'],
    recommended: false,
    docs: 'https://github.com/ml-explore/mlx-lm',
    support: { darwin: 'full', linux: 'none', win32: 'none' },
    install: {
      darwin: 'brew install mlx-lm\n# then: mlx_lm.server --model mlx-community/<id>',
      linux: 'Apple Silicon only. Not available on Linux.',
      win32: 'Apple Silicon only. Not available on Windows.',
    },
    notes: {
      darwin: 'Native Metal. Serves mlx-community Hub weights via mlx_lm.server.',
      linux: 'Requires Apple Silicon macOS.',
      win32: 'Requires Apple Silicon macOS.',
    },
  },
  {
    id: 'ollama',
    name: 'Ollama',
    modalities: ['text'],
    recommended: false,
    docs: 'https://ollama.com/',
    support: { darwin: 'full', linux: 'full', win32: 'full' },
    install: {
      darwin: 'brew install ollama\nollama serve',
      linux: 'curl -fsSL https://ollama.com/install.sh | sh',
      win32: 'winget install Ollama.Ollama',
    },
    notes: {
      darwin: 'Convenience layer over GGUF. OpenAI /v1 on port 11434.',
      linux: 'Convenience layer over GGUF. OpenAI /v1 on port 11434.',
      win32: 'Convenience layer over GGUF. OpenAI /v1 on port 11434.',
    },
  },
  {
    id: 'ffmpeg',
    name: 'FFmpeg',
    modalities: ['video', 'tool'],
    recommended: true,
    docs: 'https://ffmpeg.org/',
    support: { darwin: 'full', linux: 'full', win32: 'full' },
    install: {
      darwin: 'brew install ffmpeg',
      linux: 'sudo apt install ffmpeg   # or: dnf install ffmpeg',
      win32: 'winget install Gyan.FFmpeg',
    },
    notes: {
      darwin: 'Used for playable video fixtures and transcode helpers.',
      linux: 'Used for playable video fixtures and transcode helpers.',
      win32: 'Used for playable video fixtures and transcode helpers.',
    },
  },
  {
    id: 'whisper',
    name: 'faster-whisper',
    modalities: ['stt'],
    recommended: true,
    docs: 'https://github.com/SYSTRAN/faster-whisper',
    support: { darwin: 'full', linux: 'full', win32: 'partial' },
    install: {
      darwin:
        'pip install faster-whisper-server\n# or point OMNI_STT_URL at a whisper.cpp HTTP server',
      linux:
        'pip install faster-whisper-server\n# GPU: install CTranslate2 CUDA wheels',
      win32:
        'pip install faster-whisper-server\n# or WSL2. Then set OMNI_STT_URL.',
    },
    notes: {
      darwin: 'Gateway forwards POST /v1/audio/transcriptions to OMNI_STT_URL.',
      linux: 'Gateway forwards POST /v1/audio/transcriptions to OMNI_STT_URL.',
      win32: 'Gateway forwards POST /v1/audio/transcriptions to OMNI_STT_URL.',
    },
  },
  {
    id: 'kokoro',
    name: 'Kokoro-FastAPI',
    modalities: ['tts'],
    recommended: true,
    docs: 'https://github.com/remsky/Kokoro-FastAPI',
    support: { darwin: 'full', linux: 'full', win32: 'partial' },
    install: {
      darwin:
        'docker run -p 8880:8880 ghcr.io/remsky/kokoro-fastapi-cpu:latest\nexport OMNI_TTS_URL=http://127.0.0.1:8880',
      linux:
        'docker run -p 8880:8880 ghcr.io/remsky/kokoro-fastapi-cpu:latest\nexport OMNI_TTS_URL=http://127.0.0.1:8880',
      win32:
        'docker run -p 8880:8880 ghcr.io/remsky/kokoro-fastapi-cpu:latest\nset OMNI_TTS_URL=http://127.0.0.1:8880',
    },
    notes: {
      darwin: 'OpenAI POST /v1/audio/speech. Gateway uses OMNI_TTS_URL.',
      linux: 'CUDA image available. Gateway uses OMNI_TTS_URL.',
      win32: 'Docker Desktop or WSL2. Gateway uses OMNI_TTS_URL.',
    },
  },
  {
    id: 'comfy',
    name: 'ComfyUI (OpenAI adapter)',
    modalities: ['image', 'video'],
    recommended: false,
    docs: 'https://github.com/comfyanonymous/ComfyUI',
    support: { darwin: 'partial', linux: 'full', win32: 'partial' },
    install: {
      darwin:
        'Install ComfyUI, then put an OpenAI-compat adapter in front.\nexport OMNI_IMAGE_URL=http://127.0.0.1:7860\nexport OMNI_VIDEO_URL=http://127.0.0.1:7860',
      linux:
        'Install ComfyUI (CUDA recommended), then an OpenAI-compat adapter.\nexport OMNI_IMAGE_URL=http://127.0.0.1:7860\nexport OMNI_VIDEO_URL=http://127.0.0.1:7860',
      win32:
        'Install ComfyUI, then an OpenAI-compat adapter.\nset OMNI_IMAGE_URL=http://127.0.0.1:7860',
    },
    notes: {
      darwin: 'Native Comfy /prompt is not OpenAI-shaped. Adapter required.',
      linux: 'Native Comfy /prompt is not OpenAI-shaped. Adapter required.',
      win32: 'Native Comfy /prompt is not OpenAI-shaped. Adapter required.',
    },
  },
];

/** argv lists the gateway may spawn (never a shell, never user input). */
export const INSTALL_STEPS: Record<
  string,
  Partial<Record<HostOs, readonly (readonly string[])[]>>
> = {
  llamacpp: {
    darwin: [['brew', 'install', 'llama.cpp']],
    linux: [['brew', 'install', 'llama.cpp']],
    win32: [
      [
        'winget',
        'install',
        '-e',
        '--id',
        'ggml.llamacpp',
        '--accept-package-agreements',
        '--accept-source-agreements',
        '--disable-interactivity',
      ],
    ],
  },
  vllm: {
    linux: [['python3', '-m', 'pip', 'install', '--user', 'vllm']],
  },
  mlx: {
    darwin: [['brew', 'install', 'mlx-lm']],
  },
  ollama: {
    darwin: [['brew', 'install', 'ollama']],
    linux: [['brew', 'install', 'ollama']],
    win32: [
      [
        'winget',
        'install',
        '-e',
        '--id',
        'Ollama.Ollama',
        '--accept-package-agreements',
        '--accept-source-agreements',
        '--disable-interactivity',
      ],
    ],
  },
  ffmpeg: {
    darwin: [['brew', 'install', 'ffmpeg']],
    linux: [['brew', 'install', 'ffmpeg']],
    win32: [
      [
        'winget',
        'install',
        '-e',
        '--id',
        'Gyan.FFmpeg',
        '--accept-package-agreements',
        '--accept-source-agreements',
        '--disable-interactivity',
      ],
    ],
  },
  whisper: {
    darwin: [['python3', '-m', 'pip', 'install', '--user', 'faster-whisper-server']],
    linux: [['python3', '-m', 'pip', 'install', '--user', 'faster-whisper-server']],
    win32: [['python3', '-m', 'pip', 'install', '--user', 'faster-whisper-server']],
  },
  kokoro: {
    darwin: [
      [
        'docker',
        'run',
        '-d',
        '--name',
        'ysk-omni-kokoro',
        '-p',
        '8880:8880',
        'ghcr.io/remsky/kokoro-fastapi-cpu:latest',
      ],
    ],
    linux: [
      [
        'docker',
        'run',
        '-d',
        '--name',
        'ysk-omni-kokoro',
        '-p',
        '8880:8880',
        'ghcr.io/remsky/kokoro-fastapi-cpu:latest',
      ],
    ],
    win32: [
      [
        'docker',
        'run',
        '-d',
        '--name',
        'ysk-omni-kokoro',
        '-p',
        '8880:8880',
        'ghcr.io/remsky/kokoro-fastapi-cpu:latest',
      ],
    ],
  },
};

export function installArgv(id: string, os: HostOs = hostOs()): string[][] {
  const rows = INSTALL_STEPS[id]?.[os] || [];
  return rows.map((argv) => {
    const head = argv[0];
    if (head === 'python3' && !whichBin('python3') && whichBin('python')) {
      return ['python', ...argv.slice(1)];
    }
    return [...argv];
  });
}

function envSet(name: string): boolean {
  return Boolean(process.env[name]?.trim());
}

function probeSpec(spec: RuntimeSpec): RuntimeProbe {
  if (spec.id === 'llamacpp') {
    const bin = llamaServerBin();
    return {
      installed: Boolean(bin),
      configured: Boolean(bin),
      version: null,
      path: bin,
      detail: bin ? 'llama-server on PATH' : 'Install llama.cpp so llama-server is on PATH',
    };
  }
  if (spec.id === 'vllm') {
    const ok = vllmAvailable();
    const desc = describeVllmRuntime();
    return {
      installed: ok,
      configured: ok,
      version: ok ? desc : null,
      path: ok && desc !== 'not on PATH' ? desc : null,
      detail: ok ? desc : 'vLLM CLI or python -m vllm.entrypoints.openai.api_server',
    };
  }
  if (spec.id === 'mlx') {
    const bin = whichBin('mlx_lm.server');
    return {
      installed: Boolean(bin),
      configured: Boolean(bin),
      version: null,
      path: bin,
      detail: bin ? 'mlx_lm.server on PATH' : 'brew install mlx-lm (Apple Silicon)',
    };
  }
  if (spec.id === 'ollama') {
    const bin = whichBin('ollama');
    return {
      installed: Boolean(bin),
      configured: Boolean(bin),
      version: bin ? versionLine(bin, ['--version']) : null,
      path: bin,
      detail: bin ? 'ollama on PATH' : 'Install Ollama, then ollama serve',
    };
  }
  if (spec.id === 'ffmpeg') {
    const bin = whichBin('ffmpeg');
    return {
      installed: Boolean(bin),
      configured: Boolean(bin),
      version: bin ? versionLine(bin, ['-version']) : null,
      path: bin,
      detail: bin ? 'ffmpeg on PATH' : 'Install FFmpeg for video fixtures',
    };
  }
  if (spec.id === 'whisper') {
    const bin = whichBin('faster-whisper-server');
    const url = envSet('OMNI_STT_URL');
    return {
      installed: Boolean(bin) || url,
      configured: url,
      version: bin ? 'faster-whisper-server' : null,
      path: bin || process.env.OMNI_STT_URL || null,
      detail: url
        ? `OMNI_STT_URL=${process.env.OMNI_STT_URL}`
        : 'Set OMNI_STT_URL to an OpenAI-shaped STT worker',
    };
  }
  if (spec.id === 'kokoro') {
    const url = envSet('OMNI_TTS_URL');
    return {
      installed: url,
      configured: url,
      version: null,
      path: process.env.OMNI_TTS_URL || null,
      detail: url
        ? `OMNI_TTS_URL=${process.env.OMNI_TTS_URL}`
        : 'Set OMNI_TTS_URL (Kokoro-FastAPI default http://127.0.0.1:8880)',
    };
  }
  const img = envSet('OMNI_IMAGE_URL');
  const vid = envSet('OMNI_VIDEO_URL');
  return {
    installed: img || vid,
    configured: img || vid,
    version: null,
    path: process.env.OMNI_IMAGE_URL || process.env.OMNI_VIDEO_URL || null,
    detail:
      img || vid
        ? `OMNI_IMAGE_URL / OMNI_VIDEO_URL set`
        : 'Set OMNI_IMAGE_URL and/or OMNI_VIDEO_URL to an OpenAI-shaped worker',
  };
}

export function buildRuntimesReport(): RuntimesReport {
  const os = hostOs();
  const items: RuntimeReportItem[] = RUNTIME_SPECS.map((spec) => {
    const support = spec.support[os];
    const applicable = support !== 'none';
    const probe = probeSpec(spec);
    let status: RuntimeReportItem['status'] = 'missing';
    if (!applicable) status = 'unsupported';
    else if (probe.installed) status = 'installed';
    else if (probe.configured) status = 'configured';
    const installable = (INSTALL_STEPS[spec.id]?.[os] || []).length > 0;
    return { ...spec, ...probe, applicable, status, installable };
  });
  return {
    host: {
      os,
      osLabel: osLabel(os),
      arch: process.arch,
      platform: `${osLabel(os)} · ${process.arch}`,
    },
    items,
  };
}
