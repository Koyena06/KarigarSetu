import * as Speech from 'expo-speech';
import type { Language } from '@/types';
import { getLanguageInfo } from '@/i18n/languages';

let voiceCache: Speech.Voice[] | null = null;

async function loadVoices(): Promise<Speech.Voice[]> {
  if (voiceCache && voiceCache.length > 0) return voiceCache;
  try {
    voiceCache = await Speech.getAvailableVoicesAsync();
  } catch {
    voiceCache = [];
  }
  return voiceCache;
}

const normalise = (tag: string) => tag.toLowerCase().replace('_', '-');

/**
 * Returns the best installed voice for a language, `null` when the device
 * reports voices but none match, or `undefined` when the device doesn't
 * report voices at all (let the engine try the language code).
 */
async function pickVoice(language: Language): Promise<Speech.Voice | null | undefined> {
  const voices = await loadVoices();
  if (voices.length === 0) return undefined;
  const code = getLanguageInfo(language).speechCode;
  const base = code.split('-')[0];
  const exact = voices.filter((v) => normalise(v.language) === normalise(code));
  const loose = voices.filter((v) => normalise(v.language).split('-')[0] === base);
  const candidates = exact.length ? exact : loose;
  if (!candidates.length) return null;
  return candidates.find((v) => v.quality === Speech.VoiceQuality.Enhanced) ?? candidates[0];
}

export interface SpeakOptions {
  /** English copy to speak when the phone has no voice for the chosen language. */
  fallbackText?: string;
  onDone?: () => void;
}

export async function speak(text: string, language: Language, options: SpeakOptions = {}): Promise<void> {
  Speech.stop();
  const voice = await pickVoice(language);

  let utterance = text;
  let languageCode = getLanguageInfo(language).speechCode;
  let voiceId = voice?.identifier;

  if (voice === null && options.fallbackText) {
    const englishVoice = await pickVoice('english');
    utterance = options.fallbackText;
    languageCode = 'en-IN';
    voiceId = englishVoice?.identifier;
  }

  Speech.speak(utterance, {
    language: languageCode,
    voice: voiceId,
    rate: 0.92,
    onDone: options.onDone,
    onStopped: options.onDone,
    onError: options.onDone,
  });
}

export function stopSpeaking() {
  Speech.stop();
}
