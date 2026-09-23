/** Mirrors src/interfaces/api-features.type.ts */

export type ApiFeatures = {
  openaiChat: boolean;
  openaiResponses: boolean;
  anthropicMessages: boolean;
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
  usageEstimate: boolean;
  assistantsEmulation: boolean;
  strictSampling: boolean;
  forceDisableToolsInSafe: boolean;
  imagesApi: boolean;
  audioApi: boolean;
  videoApi: boolean;
  filesOpenAiAlias: boolean;
};

export type ApiFeatureKey = keyof ApiFeatures;

export type ApiFeaturesResponse = {
  object: 'admin.api_features';
  data: ApiFeatures;
  defaults?: ApiFeatures;
  flags?: string[];
  preset?: string;
};

export type FeaturePresetName = 'open' | 'locked' | 'dev';
