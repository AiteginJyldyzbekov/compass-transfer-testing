import { SUPPORTED_LANGUAGES, type Locale } from '../types';

export const isValidLanguage = (lang: string): lang is Locale =>
  SUPPORTED_LANGUAGES.includes(lang as Locale);
