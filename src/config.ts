/**
 * All API keys live in .env as EXPO_PUBLIC_* variables (see .env.example).
 *
 * EXPO_PUBLIC_ values are bundled into the app, so anyone with the APK can
 * extract them. That is fine for development and demos. Before a public
 * release, move these calls behind a backend (e.g. Firebase Cloud Functions)
 * so the keys never ship in the app.
 */
const env = (value: string | undefined, fallback = '') => (value ?? '').trim() || fallback;

export const config = {
  // Google Gemini — photo studio (paid image model) plus free-tier listing writer and transcription.
  geminiApiKey: env(process.env.EXPO_PUBLIC_GEMINI_API_KEY),
  geminiImageModel: env(process.env.EXPO_PUBLIC_GEMINI_IMAGE_MODEL, 'gemini-2.5-flash-image'),
  geminiTextModel: env(process.env.EXPO_PUBLIC_GEMINI_TEXT_MODEL, 'gemini-3.8-flash'),
  /** Tried when the main text model is overloaded. */
  geminiTextFallbackModels: ['gemini-3.5-flash', 'gemini-3.5-flash-lite'],

  // Optional premium providers; used instead of Gemini for their feature when set.
  anthropicApiKey: env(process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY),
  anthropicBaseUrl: env(process.env.EXPO_PUBLIC_ANTHROPIC_BASE_URL) || undefined,
  sarvamApiKey: env(process.env.EXPO_PUBLIC_SARVAM_API_KEY),
  sarvamSttModel: env(process.env.EXPO_PUBLIC_SARVAM_STT_MODEL, 'saarika:v2.5'),
  removeBgApiKey: env(process.env.EXPO_PUBLIC_REMOVE_BG_API_KEY),

  // Firebase — placeholders for the upcoming backend; not wired up yet.
  firebase: {
    apiKey: env(process.env.EXPO_PUBLIC_FIREBASE_API_KEY),
    authDomain: env(process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN),
    projectId: env(process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID),
    storageBucket: env(process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET),
    messagingSenderId: env(process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
    appId: env(process.env.EXPO_PUBLIC_FIREBASE_APP_ID),
  },
};

const gemini = Boolean(config.geminiApiKey);

export const providers = {
  listing: config.anthropicApiKey ? 'claude' : gemini ? 'gemini' : null,
  speechToText: config.sarvamApiKey ? 'sarvam' : gemini ? 'gemini' : null,
  studio: gemini ? 'gemini' : config.removeBgApiKey ? 'remove.bg' : null,
} as const;

export const services = {
  ai: providers.listing !== null,
  speechToText: providers.speechToText !== null,
  studio: providers.studio !== null,
};
