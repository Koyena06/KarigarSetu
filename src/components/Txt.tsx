import { Text, type TextProps, type TextStyle } from 'react-native';
import { twMerge } from 'tailwind-merge';
import { useApp } from '@/store/AppContext';
import { DISPLAY_FONT, getBodyFont, getDisplayFont, type Weight } from '@/theme/fonts';

type Variant = 'display' | 'title' | 'heading' | 'body' | 'bodySm' | 'caption' | 'overline';

const VARIANT_CLASS: Record<Variant, string> = {
  display: 'text-[32px] leading-[40px] text-ink-900',
  title: 'text-[24px] leading-[32px] text-ink-900',
  heading: 'text-[17px] leading-[24px] text-ink-900',
  body: 'text-[15px] leading-[23px] text-ink-700',
  bodySm: 'text-[13px] leading-[20px] text-ink-600',
  caption: 'text-[12px] leading-[17px] text-ink-500',
  overline: 'text-[11px] leading-[14px] tracking-[1.2px] uppercase text-ink-500',
};

const DEFAULT_WEIGHT: Record<Variant, Weight> = {
  display: 'bold',
  title: 'bold',
  heading: 'semibold',
  body: 'regular',
  bodySm: 'regular',
  caption: 'medium',
  overline: 'semibold',
};

const NUMERIC_WEIGHT: Record<Weight, TextStyle['fontWeight']> = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

interface TxtProps extends TextProps {
  variant?: Variant;
  weight?: Weight;
  /** Text is always Latin (brand name, numbers, prices) — use the serif even in other languages. */
  latin?: boolean;
  className?: string;
}

export function Txt({ variant = 'body', weight, latin, className, style, ...props }: TxtProps) {
  const { language } = useApp();
  const resolvedWeight = weight ?? DEFAULT_WEIGHT[variant];
  const serif = variant === 'display' || variant === 'title';

  const fontFamily = serif
    ? latin
      ? DISPLAY_FONT
      : getDisplayFont(language)
    : getBodyFont(latin ? 'english' : language, resolvedWeight);

  return (
    <Text
      {...props}
      className={twMerge(VARIANT_CLASS[variant], className)}
      style={[fontFamily ? { fontFamily } : { fontWeight: NUMERIC_WEIGHT[resolvedWeight] }, style]}
    />
  );
}
