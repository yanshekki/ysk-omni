import { describe, expect, it } from 'vitest';
import {
  RUNTIME_SPECS,
  buildRuntimesReport,
  hostOs,
} from '../../src/services/runtimes/runtime-catalog';

describe('runtime catalog', () => {
  it('covers macOS, Linux, and Windows install commands', () => {
    expect(RUNTIME_SPECS.length).toBeGreaterThanOrEqual(8);
    for (const spec of RUNTIME_SPECS) {
      expect(spec.install.darwin).toBeTruthy();
      expect(spec.install.linux).toBeTruthy();
      expect(spec.install.win32).toBeTruthy();
    }
  });

  it('reports host OS and llama.cpp entry', () => {
    const report = buildRuntimesReport();
    expect(['darwin', 'linux', 'win32']).toContain(report.host.os);
    expect(report.host.os).toBe(hostOs());
    const llama = report.items.find((i) => i.id === 'llamacpp');
    expect(llama).toBeTruthy();
    expect(llama?.support.darwin).toBe('full');
    expect(typeof llama?.installable).toBe('boolean');
    const comfy = report.items.find((i) => i.id === 'comfy');
    expect(comfy?.installable).toBe(false);
    expect(comfy?.uninstallable).toBe(false);
  });

  it('marks MLX unsupported off Apple Silicon', () => {
    const mlx = RUNTIME_SPECS.find((s) => s.id === 'mlx');
    expect(mlx?.support.linux).toBe('none');
    expect(mlx?.support.win32).toBe('none');
    expect(mlx?.support.darwin).toBe('full');
  });
});
