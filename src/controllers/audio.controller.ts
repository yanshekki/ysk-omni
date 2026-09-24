import type { Request, Response } from 'express';
import type { CreateSpeechDto } from '../dto/audio.dto';
import { ExceptionFactory } from '../exceptions/exception.factory';
import { asyncHandler } from '../utils/async-handler';
import {
  synthesizeSpeech,
  transcribeAudio,
} from '../services/media/audio-worker';

/**
 * OpenAI Audio API surface.
 * Without AUDIO_TTS_PROVIDER / mock / OMNI_TTS_URL, returns 501.
 */
export class AudioController {
  speech = asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const dto = req.body as CreateSpeechDto;
    const { bytes, mime } = await synthesizeSpeech({
      ...dto,
      apiKey: req.apiKey,
    });
    res.setHeader('Content-Type', mime);
    res.setHeader('Content-Length', String(bytes.length));
    res.status(200).send(bytes);
  });

  transcriptions = asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    if (!req.file) {
      throw ExceptionFactory.validation('Multipart field "file" is required');
    }
    const body = (req.body || {}) as { model?: string };
    const { text } = await transcribeAudio({
      bytes: req.file.buffer,
      filename: req.file.originalname,
      mime: req.file.mimetype,
      model: typeof body.model === 'string' ? body.model : undefined,
      apiKey: req.apiKey,
    });
    res.status(200).json({ text });
  });
}

export const audioController = new AudioController();
