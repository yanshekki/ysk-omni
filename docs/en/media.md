# Media

Image, video, speech, and transcription go through dedicated `/v1` routes (and Admin **Media** studio). They are not llama-server chat.

## Workers

Set all four URLs at the same host if you run one worker process:

```bash
export OMNI_IMAGE_URL=http://127.0.0.1:3870
export OMNI_TTS_URL=http://127.0.0.1:3870
export OMNI_STT_URL=http://127.0.0.1:3870
export OMNI_VIDEO_URL=http://127.0.0.1:3870
```

Tiny real-weights worker (Piper, faster-whisper, optional diffusion / T2V):

```bash
python3.12 -m venv ~/.ysk-omni/venvs/tiny-media
# pip: faster-whisper piper-tts pillow torch diffusers …
TINY_WORKER_PORT=3870 python scripts/tiny-media-worker.py
```

`TINY_MEDIA_FAKE=1` serves synthetic wav/png (CI). Unset image/TTS/STT URLs → **501** `engine_unconfigured`.

## Formats

Studio and API accept output extensions (`png`, `jpeg`, `wav`, `mp3`, `mp4`, …). The gateway converts with **ffmpeg** when the worker emits another container.

Video is a real T2V pipeline (for example Zeroscope UNet3D), not a slideshow of stills.

## Studio

Admin → Media: modes image, video, speech, transcribe. Speech needs a prompt; transcribe needs an audio attach. Chat playground routes the same way when a media model is selected.

## Auth

Public `/v1` media needs an **agent** or **admin** key. Safe client keys get `media_forbidden`.
