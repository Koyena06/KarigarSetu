import type { Language } from '@/types';

export interface LanguageInfo {
  key: Language;
  label: string;
  nativeLabel: string;
  /** BCP-47 tag for on-device text-to-speech. */
  speechCode: string;
  /** Language code expected by the Sarvam speech-to-text API. */
  sttCode: string;
}

export const LANGUAGES: LanguageInfo[] = [
  { key: 'english', label: 'English', nativeLabel: 'English', speechCode: 'en-IN', sttCode: 'en-IN' },
  { key: 'hindi', label: 'Hindi', nativeLabel: 'हिन्दी', speechCode: 'hi-IN', sttCode: 'hi-IN' },
  { key: 'odia', label: 'Odia', nativeLabel: 'ଓଡ଼ିଆ', speechCode: 'or-IN', sttCode: 'od-IN' },
  { key: 'bengali', label: 'Bengali', nativeLabel: 'বাংলা', speechCode: 'bn-IN', sttCode: 'bn-IN' },
  { key: 'tamil', label: 'Tamil', nativeLabel: 'தமிழ்', speechCode: 'ta-IN', sttCode: 'ta-IN' },
  { key: 'telugu', label: 'Telugu', nativeLabel: 'తెలుగు', speechCode: 'te-IN', sttCode: 'te-IN' },
  { key: 'marathi', label: 'Marathi', nativeLabel: 'मराठी', speechCode: 'mr-IN', sttCode: 'mr-IN' },
  { key: 'gujarati', label: 'Gujarati', nativeLabel: 'ગુજરાતી', speechCode: 'gu-IN', sttCode: 'gu-IN' },
];

export const getLanguageInfo = (language: Language) => LANGUAGES.find((l) => l.key === language) ?? LANGUAGES[0];
