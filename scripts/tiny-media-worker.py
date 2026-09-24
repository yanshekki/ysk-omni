#!/usr/bin/env python3
"""OpenAI-shaped tiny media worker for YSK Omni.

Fake mode (TINY_MEDIA_FAKE=1): stdlib only — synthetic wav/png/mp4, no weights.
Live mode: Piper TTS, faster-whisper tiny, optional tiny-sd + ffmpeg video.
Cache: $OMNI_HOME/models/tiny (default ~/.ysk-omni/models/tiny).
"""
from __future__ import annotations

import io
import json
import os
import re
import struct
import subprocess
import sys
import tempfile
import threading
import wave
import zlib
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

FAKE = os.environ.get("TINY_MEDIA_FAKE", "").strip() in ("1", "true", "yes")
PORT = int(os.environ.get("TINY_WORKER_PORT", "3870") or "3870")
HOME = Path(os.environ.get("OMNI_HOME") or Path.home() / ".ysk-omni")
CACHE = Path(os.environ.get("TINY_MEDIA_CACHE") or HOME / "models" / "tiny")
CACHE.mkdir(parents=True, exist_ok=True)

PIPER_ONNX = CACHE / "en_US-lessac-low.onnx"
PIPER_JSON = CACHE / "en_US-lessac-low.onnx.json"
PIPER_ONNX_URL = (
    "https://huggingface.co/rhasspy/piper-voices/resolve/main/"
    "en/en_US/lessac/low/en_US-lessac-low.onnx"
)
PIPER_JSON_URL = (
    "https://huggingface.co/rhasspy/piper-voices/resolve/main/"
    "en/en_US/lessac/low/en_US-lessac-low.onnx.json"
)

_lock = threading.Lock()
_whisper = None
_whisper_src = None
_piper = None
_sd = None
_sd_src = None


def _models_root() -> Path:
    return HOME / "models"


def local_whisper_src() -> str:
    env = (os.environ.get("WHISPER_MODEL") or "").strip()
    if env:
        return env
    root = _models_root()
    if root.is_dir():
        for p in sorted(root.iterdir()):
            if p.is_dir() and (p / "model.bin").exists():
                return str(p)
    return "tiny"


def local_sd_src() -> str:
    env = (os.environ.get("SD_MODEL") or "").strip()
    if env:
        return env
    root = _models_root()
    if root.is_dir():
        for p in sorted(root.iterdir()):
            if p.is_dir() and (p / "model_index.json").exists():
                return str(p)
    return "segmind/tiny-sd"


def _png(w: int, h: int, rgb: tuple[int, int, int] = (200, 40, 40)) -> bytes:
    def chunk(tag: bytes, data: bytes) -> bytes:
        return (
            struct.pack(">I", len(data))
            + tag
            + data
            + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
        )

    raw = b"".join(b"\x00" + bytes(rgb) * w for _ in range(h))
    return b"".join(
        [
            b"\x89PNG\r\n\x1a\n",
            chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0)),
            chunk(b"IDAT", zlib.compress(raw, 9)),
            chunk(b"IEND", b""),
        ]
    )


def _wav_sine(seconds: float = 0.4, hz: int = 440, rate: int = 16000) -> bytes:
    n = max(1, int(seconds * rate))
    buf = io.BytesIO()
    with wave.open(buf, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(rate)
        frames = bytearray()
        for i in range(n):
            v = int(8000 * __import__("math").sin(2 * 3.14159265 * hz * i / rate))
            frames += struct.pack("<h", v)
        w.writeframes(bytes(frames))
    return buf.getvalue()


def _ffmpeg_mp4_from_pngs(pngs: list[bytes]) -> bytes:
    ff = "ffmpeg"
    with tempfile.TemporaryDirectory() as td:
        paths = []
        for i, p in enumerate(pngs):
            fp = os.path.join(td, f"f{i:02d}.png")
            Path(fp).write_bytes(p)
            paths.append(fp)
        out = os.path.join(td, "out.mp4")
        cmd = [
            ff,
            "-y",
            "-framerate",
            "2",
            "-i",
            os.path.join(td, "f%02d.png"),
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
            "-t",
            "1",
            "-movflags",
            "+faststart",
            out,
        ]
        r = subprocess.run(cmd, capture_output=True, text=True)
        if r.returncode != 0 or not os.path.exists(out):
            raise RuntimeError(r.stderr[-400:] if r.stderr else "ffmpeg failed")
        return Path(out).read_bytes()


def _download(url: str, dest: Path) -> None:
    if dest.exists() and dest.stat().st_size > 1000:
        return
    dest.parent.mkdir(parents=True, exist_ok=True)
    tmp = dest.with_suffix(dest.suffix + ".part")
    import urllib.request

    req = urllib.request.Request(url, headers={"User-Agent": "ysk-omni-tiny-worker"})
    with urllib.request.urlopen(req, timeout=120) as res, open(tmp, "wb") as f:
        while True:
            chunk = res.read(1024 * 256)
            if not chunk:
                break
            f.write(chunk)
    tmp.replace(dest)


def piper_voice():
    global _piper
    if _piper is not None:
        return _piper
    with _lock:
        if _piper is not None:
            return _piper
        _download(PIPER_ONNX_URL, PIPER_ONNX)
        _download(PIPER_JSON_URL, PIPER_JSON)
        from piper import PiperVoice

        _piper = PiperVoice.load(str(PIPER_ONNX), config_path=str(PIPER_JSON))
        return _piper


def whisper_model():
    global _whisper, _whisper_src
    src = local_whisper_src()
    if _whisper is not None and _whisper_src == src:
        return _whisper
    with _lock:
        src = local_whisper_src()
        if _whisper is not None and _whisper_src == src:
            return _whisper
        from faster_whisper import WhisperModel

        kwargs = {"device": "cpu", "compute_type": "int8"}
        if src == "tiny" or not Path(src).exists():
            kwargs["download_root"] = str(CACHE / "whisper")
            _whisper = WhisperModel("tiny", **kwargs)
        else:
            _whisper = WhisperModel(src, **kwargs)
        _whisper_src = src
        return _whisper


def sd_pipe():
    global _sd, _sd_src
    src = local_sd_src()
    if _sd is not None and _sd_src == src:
        return _sd
    with _lock:
        src = local_sd_src()
        if _sd is not None and _sd_src == src:
            return _sd
        import torch
        from diffusers import StableDiffusionPipeline

        dtype = torch.float16 if torch.backends.mps.is_available() else torch.float32
        device = "mps" if torch.backends.mps.is_available() else "cpu"
        local = Path(src).is_dir()
        _sd = StableDiffusionPipeline.from_pretrained(
            src,
            torch_dtype=dtype,
            cache_dir=None if local else str(CACHE / "hf"),
            safety_checker=None,
            local_files_only=local,
        )
        _sd = _sd.to(device)
        _sd.set_progress_bar_config(disable=True)
        _sd_src = src
        return _sd


def tts_bytes(text: str) -> bytes:
    if FAKE:
        return _wav_sine(0.35, 523)
    voice = piper_voice()
    buf = io.BytesIO()
    with wave.open(buf, "wb") as w:
        voice.synthesize_wav(text or "hello", w)
    return buf.getvalue()


def stt_text(wav_bytes: bytes) -> str:
    if FAKE:
        return "ysk-omni tiny hello"
    model = whisper_model()
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=True) as f:
        f.write(wav_bytes)
        f.flush()
        segs, _info = model.transcribe(f.name, beam_size=1)
        return " ".join(s.text.strip() for s in segs).strip() or " "


def image_png(prompt: str) -> bytes:
    if FAKE:
        return _png(64, 64, (30, 140, 220))
    pipe = sd_pipe()
    out = pipe(
        prompt or "a red apple",
        num_inference_steps=8,
        height=128,
        width=128,
        guidance_scale=1.0,
    )
    img = out.images[0]
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def video_mp4(prompt: str) -> bytes:
    a = image_png(prompt or "a red square")
    b = image_png((prompt or "a red square") + " brighter")
    return _ffmpeg_mp4_from_pngs([a, b])


def _read(handler: BaseHTTPRequestHandler) -> bytes:
    n = int(handler.headers.get("Content-Length") or "0")
    return handler.rfile.read(n) if n else b""


def _multipart_file(headers: dict[str, str], body: bytes) -> bytes:
    ctype = headers.get("Content-Type") or headers.get("content-type") or ""
    m = re.search(r"boundary=([^;]+)", ctype)
    if not m:
        return body
    boundary = m.group(1).strip().strip('"').encode()
    parts = body.split(b"--" + boundary)
    for part in parts:
        if b"filename=" not in part:
            continue
        idx = part.find(b"\r\n\r\n")
        if idx < 0:
            continue
        data = part[idx + 4 :]
        if data.endswith(b"\r\n"):
            data = data[:-2]
        return data
    return body


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def log_message(self, fmt: str, *args) -> None:  # noqa: A003
        sys.stderr.write("tiny-media: " + (fmt % args) + "\n")

    def _send(self, code: int, body: bytes, content_type: str) -> None:
        self.send_response(code)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _send_json(self, code: int, obj: object) -> None:
        raw = json.dumps(obj).encode()
        self._send(code, raw, "application/json")

    def do_GET(self) -> None:  # noqa: N802
        path = urlparse(self.path).path
        if path in ("/health", "/v1/health"):
            self._send_json(
                200,
                {
                    "status": "ok",
                    "service": "ysk-omni-tiny-media",
                    "fake": FAKE,
                    "whisper": local_whisper_src(),
                    "diffusion": local_sd_src(),
                },
            )
            return
        self._send_json(404, {"error": "not found"})

    def do_POST(self) -> None:  # noqa: N802
        path = urlparse(self.path).path.rstrip("/")
        try:
            if path == "/v1/audio/speech":
                body = json.loads(_read(self) or b"{}")
                text = str(body.get("input") or body.get("text") or "hello")
                wav = tts_bytes(text)
                self._send(200, wav, "audio/wav")
                return
            if path == "/v1/audio/transcriptions":
                raw = _read(self)
                headers = {k: v for k, v in self.headers.items()}
                file_bytes = _multipart_file(headers, raw)
                text = stt_text(file_bytes)
                self._send_json(200, {"text": text})
                return
            if path == "/v1/images/generations":
                body = json.loads(_read(self) or b"{}")
                prompt = str(body.get("prompt") or "a red square")
                png = image_png(prompt)
                import base64

                self._send_json(
                    200,
                    {
                        "created": 1,
                        "data": [
                            {
                                "b64_json": base64.b64encode(png).decode(),
                            }
                        ],
                    },
                )
                return
            if path == "/v1/videos":
                body = json.loads(_read(self) or b"{}")
                prompt = str(body.get("prompt") or "a red square")
                mp4 = video_mp4(prompt)
                self._send(200, mp4, "video/mp4")
                return
            self._send_json(404, {"error": "not found"})
        except Exception as e:  # noqa: BLE001
            self._send_json(500, {"error": {"message": str(e)[:500]}})


def main() -> None:
    httpd = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    print(f"http://127.0.0.1:{PORT}", flush=True)
    httpd.serve_forever()


if __name__ == "__main__":
    main()
