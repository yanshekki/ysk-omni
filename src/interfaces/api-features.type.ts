/**
 * Admin-controlled API / Grok capability gates.
 * When a capability is false, related request fields return 400/403.
 */
export type ApiFeatures = {
  /** Protocol surfaces */
  openaiChat: boolean;
  openaiResponses: boolean;
  anthropicMessages: boolean;

  /** Grok-backed capabilities */
  tools: boolean;
  structuredOutput: boolean;
  vision: boolean;
  reasoningEffort: boolean;
  webSearch: boolean;
  subagents: boolean;
  planMode: boolean;
  memory: boolean;
  sessionResume: boolean;
  bestOfN: boolean;
  checkLoop: boolean;
  systemOverride: boolean;
  rules: boolean;
  permissionMode: boolean;
  sandbox: boolean;

  /** Emulation */
  usageEstimate: boolean;
  assistantsEmulation: boolean;
  strictSampling: boolean;

  /** Safety */
  forceDisableToolsInSafe: boolean;

  /**
   * Media REST surfaces (OpenAI-compatible).
   * Off → 501 on /v1/images, /v1/audio, /v1/videos (when registered).
   */
  imagesApi: boolean;
  audioApi: boolean;
  videoApi: boolean;
  /** Map /v1/files to documents + media store (Phase M2) */
  filesOpenAiAlias: boolean;
};

export type ApiFeatureKey = keyof ApiFeatures;

export const DEFAULT_API_FEATURES: ApiFeatures = {
  openaiChat: true,
  openaiResponses: true,
  anthropicMessages: true,

  tools: true,
  structuredOutput: true,
  vision: true,
  reasoningEffort: true,
  webSearch: true,
  subagents: true,
  planMode: true,
  memory: true,
  sessionResume: true,
  bestOfN: false,
  checkLoop: false,
  systemOverride: false,
  rules: true,
  permissionMode: false,
  sandbox: false,

  usageEstimate: true,
  assistantsEmulation: true,
  strictSampling: false,

  forceDisableToolsInSafe: true,

  // Media: images on by default (provider may still 503 if Grok tools fail)
  imagesApi: true,
  audioApi: false,
  videoApi: false,
  filesOpenAiAlias: false,
};

export const API_FEATURE_PRESETS: Record<
  'open' | 'locked' | 'dev',
  Partial<ApiFeatures>
> = {
  open: { ...DEFAULT_API_FEATURES },
  locked: {
    ...DEFAULT_API_FEATURES,
    tools: false,
    vision: false,
    bestOfN: false,
    checkLoop: false,
    subagents: false,
    assistantsEmulation: false,
    systemOverride: false,
    permissionMode: false,
    sandbox: false,
    strictSampling: true,
    forceDisableToolsInSafe: true,
    imagesApi: false,
    audioApi: false,
    videoApi: false,
    filesOpenAiAlias: false,
  },
  dev: {
    ...DEFAULT_API_FEATURES,
    bestOfN: true,
    checkLoop: true,
    assistantsEmulation: true,
    usageEstimate: true,
  },
};
