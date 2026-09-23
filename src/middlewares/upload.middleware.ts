import multer from 'multer';
import { env } from '../config/env';
import { ExceptionFactory } from '../exceptions/exception.factory';

const storage = multer.memoryStorage();

export const uploadSingle = multer({
  storage,
  limits: {
    fileSize: env.UPLOAD_MAX_BYTES,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    // Extension/MIME hard checks happen in DocumentService
    if (!file.originalname || file.originalname.length > 500) {
      cb(ExceptionFactory.validation('Invalid filename'));
      return;
    }
    cb(null, true);
  },
}).single('file');
