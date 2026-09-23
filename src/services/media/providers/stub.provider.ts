import { ExceptionFactory } from '../../../exceptions/exception.factory';
import type {
  ImageGenRequest,
  MediaArtifact,
  MediaProvider,
} from './media-provider.interface';

/** Feature off / no backend — always 501/503 via factory. */
export class StubMediaProvider implements MediaProvider {
  readonly id = 'none';

  async generateImage(_req: ImageGenRequest): Promise<MediaArtifact[]> {
    throw ExceptionFactory.mediaProviderUnavailable(
      'No media provider configured. Enable imagesApi and use an agent key, or set a media provider.',
    );
  }
}

export const stubMediaProvider = new StubMediaProvider();
