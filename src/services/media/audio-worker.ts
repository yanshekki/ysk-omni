import { ExceptionFactory } from '../../exceptions/exception.factory';
import { apiFeaturesService } from '../api-features.service';

export async function assertAudioApi(): Promise<void> {
  const features = await apiFeaturesService.get();
  if (!features.audioApi) {
    throw ExceptionFactory.featureDisabled(
      'audioApi',
      'Audio API is disabled (Admin → API features → audioApi)',
    );
  }
}

export async function synthesizeSpeech(dto: {
  input: string;
  model?: string;
  voice?: string;
  response_format?: string;
  speed?: number;
}): Promise<{ bytes: Buffer; mime: string }> {
  await assertAudioApi();
  const ttsUrl = (process.env.OMNI_TTS_URL || '').trim();
  if (ttsUrl) {
    const upstream = await fetch(ttsUrl.replace(/\/$/, '') + '/v1/audio/speech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: dto.model || 'tts-1',
        input: dto.input,
        voice: dto.voice || 'alloy',
        response_format: dto.response_format || 'wav',
        ...(dto.speed != null ? { speed: dto.speed } : {}),
      }),
    });
    const buf = Buffer.from(await upstream.arrayBuffer());
    if (!upstream.ok) {
      throw ExceptionFactory.engineUnconfigured(
        `TTS worker HTTP ${upstream.status}`,
      );
    }
    const mime = upstream.headers.get('content-type') || 'audio/wav';
    return { bytes: buf, mime: mime.split(';')[0].trim() };
  }
  const provider = (
    process.env.AUDIO_TTS_PROVIDER ||
    process.env.MEDIA_PROVIDER ||
    ''
  ).toLowerCase();
  if (provider === 'mock') {
    const silent = Buffer.from([
      0xff, 0xfb, 0x90, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
    ]);
    return { bytes: silent, mime: 'audio/mpeg' };
  }
  throw ExceptionFactory.engineUnconfigured('speech runtime not attached');
}

export async function transcribeAudio(input: {
  bytes: Buffer;
  filename?: string;
  mime?: string;
}): Promise<{ text: string }> {
  await assertAudioApi();
  const sttUrl = (process.env.OMNI_STT_URL || '').trim();
  if (sttUrl) {
    const form = new FormData();
    const blob = new Blob([new Uint8Array(input.bytes)], {
      type: input.mime || 'application/octet-stream',
    });
    form.append('file', blob, input.filename || 'audio.wav');
    form.append('model', 'whisper-1');
    const upstream = await fetch(
      sttUrl.replace(/\/$/, '') + '/v1/audio/transcriptions',
      { method: 'POST', body: form },
    );
    const json = (await upstream.json().catch(() => ({}))) as { text?: string };
    if (!upstream.ok) {
      throw ExceptionFactory.engineUnconfigured(
        `STT worker HTTP ${upstream.status}`,
      );
    }
    return { text: String(json.text || '').trim() };
  }
  const provider = (
    process.env.AUDIO_STT_PROVIDER ||
    process.env.MEDIA_PROVIDER ||
    ''
  ).toLowerCase();
  if (provider === 'mock') {
    return { text: '[mock transcription]' };
  }
  throw ExceptionFactory.engineUnconfigured('transcription runtime not attached');
}
