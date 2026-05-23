export type ProductCard = {
  title: string;
  description: string;
  href: string;
  badge: string;
};

export type FeatureCard = {
  title: string;
  description: string;
};

export type StepCard = {
  title: string;
  description: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type HighlightMetric = {
  value: string;
  label: string;
};

export type ExamplePrompt = {
  title: string;
  text: string;
};

export type ModelDescriptor = {
  id: string;
  label: string | null;
  loaded: boolean;
  artifacts_present: boolean;
};

export type ModelsListResponse = {
  models: ModelDescriptor[];
  default_model_id: string | null;
};

export type TransliterateRequest = {
  text: string;
  model_id?: string;
  top_k?: number;
};

export type TransliterationCandidate = {
  text: string;
  score: number;
  rank: number;
};

export type TransliterateResponse = {
  best_text: string;
  candidates: TransliterationCandidate[];
  model_id: string;
  model_version: string;
  latency_ms: number;
  personalized?: boolean;
};

export type ApiError = {
  status: number;
  code: string;
  message: string;
};
