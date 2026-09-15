import type { Language } from '@/types';

/**
 * KarigarSetu ships copy in scripts that don't share glyphs (Latin,
 * Devanagari, Odia). We pick a matching Noto family per script at render
 * time. Family names must match the ones passed to useFonts() in App.tsx.
 *
 * Bengali, Tamil, Telugu and Gujarati fall back to the OS font, which ships
 * the right script coverage on Android and iOS.
 */

export type Weight = 'regular' | 'medium' | 'semibold' | 'bold';

const BODY_FAMILIES = {
  latin: {
    regular: 'NotoSans_400Regular',
    medium: 'NotoSans_500Medium',
    semibold: 'NotoSans_600SemiBold',
    bold: 'NotoSans_700Bold',
  },
  devanagari: {
    regular: 'NotoSansDevanagari_400Regular',
    medium: 'NotoSansDevanagari_500Medium',
    semibold: 'NotoSansDevanagari_600SemiBold',
    bold: 'NotoSansDevanagari_700Bold',
  },
  oriya: {
    regular: 'NotoSansOriya_400Regular',
    medium: 'NotoSansOriya_500Medium',
    semibold: 'NotoSansOriya_600SemiBold',
    bold: 'NotoSansOriya_700Bold',
  },
} as const;

const SCRIPT_BY_LANGUAGE: Partial<Record<Language, keyof typeof BODY_FAMILIES>> = {
  english: 'latin',
  hindi: 'devanagari',
  marathi: 'devanagari',
  odia: 'oriya',
};

export const DISPLAY_FONT = 'Fraunces_600SemiBold';

/** Body font family for a language + weight; undefined lets the OS font render the script. */
export function getBodyFont(language: Language, weight: Weight = 'regular'): string | undefined {
  const script = SCRIPT_BY_LANGUAGE[language];
  return script ? BODY_FAMILIES[script][weight] : undefined;
}

/** Display (serif) font only reads correctly for Latin text; other scripts use their bold body face. */
export function getDisplayFont(language: Language): string | undefined {
  if (language === 'english') return DISPLAY_FONT;
  return getBodyFont(language, 'bold');
}
