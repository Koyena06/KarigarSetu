import type { Language } from '@/types';

/**
 * KarigarSetu ships translated copy in scripts that don't share glyphs
 * (Latin, Devanagari, Odia/Oriya). A single font file can't render all of
 * them, so we pick the closest-matching Google Font family per script at
 * render time. Family names must match the ones passed to useFonts() in
 * App.tsx exactly.
 *
 * Languages without a dedicated family loaded yet (Bengali, Tamil, Telugu,
 * Gujarati) fall back to the OS system font, which already ships the right
 * script coverage on both Android and iOS — better than showing tofu boxes.
 */

type Weight = 'regular' | 'medium' | 'semibold' | 'bold';

const BODY_FAMILIES: Record<string, Record<Weight, string>> = {
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
};

const HEADING_FAMILIES: Record<'latin', Record<'semibold' | 'bold', string>> = {
  latin: {
    semibold: 'Poppins_600SemiBold',
    bold: 'Poppins_700Bold',
  },
};

const SCRIPT_BY_LANGUAGE: Partial<Record<Language, keyof typeof BODY_FAMILIES>> = {
  english: 'latin',
  hindi: 'devanagari',
  marathi: 'devanagari',
  odia: 'oriya',
};

/** Body font family for the given language + weight. Falls back to system font for unmapped scripts. */
export function getBodyFont(language: Language, weight: Weight = 'regular'): string | undefined {
  const script = SCRIPT_BY_LANGUAGE[language];
  if (!script) return undefined; // let RN use the OS default, which covers Bengali/Tamil/Telugu/Gujarati
  return BODY_FAMILIES[script][weight];
}

/**
 * Heading font family. Only Latin/Devanagari read well in Poppins-style
 * geometric sans at display sizes; Odia headings use the Noto Sans Oriya
 * bold weight instead so glyphs stay legible.
 */
export function getHeadingFont(language: Language, weight: 'semibold' | 'bold' = 'bold'): string | undefined {
  const script = SCRIPT_BY_LANGUAGE[language];
  if (script === 'oriya') return BODY_FAMILIES.oriya.bold;
  if (script === 'devanagari') return BODY_FAMILIES.devanagari.bold;
  if (script === 'latin') return HEADING_FAMILIES.latin[weight];
  return undefined;
}
