import multer from 'multer';
import { env } from '../config/env';
import { ExceptionFactory } from '../exceptions/exception.factory';

const storage = multer.memoryStorage();

/** OpenAI images/edits: fields `image` (+ optional `mask`). */
export const uploadImageEdit = multer({
  storage,
  limits: {
    fileSize: env.UPLOAD_MAX_BYTES,
    files: 2,
  },
  fileFilter: (_req, file, cb) => {
    if (!file.originalname || file.originalname.length > 500) {
      cb(ExceptionFactory.validation('Invalid filename'));
      return;
    }
    cb(null, true);
  },
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'mask', maxCount: 1 },
]);
