export const SUPPORTED_LANGUAGES = ['kg', 'ru', 'en'] as const;

export type Locale = (typeof SUPPORTED_LANGUAGES)[number];

export interface LanguageOption {
  name: string;
  locale: Locale;
  icon: string;
}

export interface LanguageChangeResponse {
  success: boolean;
  message: string;
  language?: Locale;
}

export interface LanguageChangeRequest {
  language: Locale;
}
