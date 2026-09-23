import type { Request, Response } from 'express';
import type { CreateSpeechDto } from '../dto/audio.dto';
import { ExceptionFactory } from '../exceptions/exception.factory';
import { apiFeaturesService } from '../services/api-features.service';
import { asyncHandler } from '../utils/async-handler';

/**
 * OpenAI Audio API surface.
 * Without AUDIO_TTS_PROVIDER / mock, returns 501 (professional: explicit).
 */
export class AudioController {
  speech = asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const features = await apiFeaturesService.get();
    if (!features.audioApi) {
      throw ExceptionFactory.featureDisabled(
        'audioApi',
        'Audio API is disabled (Admin → API features → audioApi)',
      );
    }

    const dto = req.body as CreateSpeechDto;
    const provider = (process.env.AUDIO_TTS_PROVIDER || process.env.MEDIA_PROVIDER || '')
      .toLowerCase();

    if (provider === 'mock') {
      // Minimal valid-ish silent-ish MP3 frame placeholder (not real audio)
      const silent = Buffer.from([
        0xff, 0xfb, 0x90, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
      ]);
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Length', String(silent.length));
      res.setHeader('X-Grok-Gateway-Audio', 'mock');
      res.setHeader('X-Grok-Gateway-Input-Chars', String(dto.input.length));
      res.status(200).send(silent);
      return;
    }

    throw ExceptionFactory.mediaProviderUnavailable(
      'No TTS provider configured. Set AUDIO_TTS_PROVIDER=mock for tests, or wire an external TTS HTTP backend.',
    );
  });

  transcriptions = asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const features = await apiFeaturesService.get();
    if (!features.audioApi) {
      throw ExceptionFactory.featureDisabled(
        'audioApi',
        'Audio API is disabled (Admin → API features → audioApi)',
      );
    }
    if (!req.file) {
      throw ExceptionFactory.validation('Multipart field "file" is required');
    }

    const provider = (process.env.AUDIO_STT_PROVIDER || process.env.MEDIA_PROVIDER || '')
      .toLowerCase();
    if (provider === 'mock') {
      res.status(200).json({
        text: '[mock transcription]',
        grok: { provider: 'mock', bytes: req.file.size },
      });
      return;
    }

    throw ExceptionFactory.mediaProviderUnavailable(
      'No STT provider configured. Set AUDIO_STT_PROVIDER=mock for tests, or wire Whisper-compatible backend.',
    );
  });
}

export const audioController = new AudioController();
