export interface OpenAiModel {
  id: string;
  object: 'model';
  created: number;
  owned_by: string;
  /** text | image | video | tts | stt — which v1 route family to call */
  modality?: 'text' | 'image' | 'video' | 'tts' | 'stt';
  runtime?: 'llamacpp' | 'vllm' | 'echo' | 'diffusion' | 'whisper' | 'tts';
}
