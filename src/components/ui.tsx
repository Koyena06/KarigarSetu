import type { ComponentType, ReactNode } from 'react';
import { Image, TextInput, View, type ImageSourcePropType, type TextInputProps } from 'react-native';
import { twMerge } from 'tailwind-merge';
import { useApp } from '@/store/AppContext';
import { colors } from '@/theme/colors';
import { getBodyFont } from '@/theme/fonts';
import { ILLUSTRATION_BG } from '@/theme/images';
import type { Channel, OrderStatus } from '@/types';
import { Txt } from './Txt';

type Icon = ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <View className={twMerge('bg-white rounded-2xl border border-paper-200', className)}>{children}</View>;
}

export function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Txt variant="overline" className={twMerge('mb-2 px-1 text-gold-600', className)}>
      {children}
    </Txt>
  );
}

export function Divider({ inset = 0 }: { inset?: number }) {
  return <View className="h-px bg-paper-200" style={{ marginLeft: inset }} />;
}

type Tone = 'leaf' | 'gold' | 'clay' | 'saffron' | 'neutral';
const TONES: Record<Tone, string> = {
  leaf: 'bg-leaf-50 text-leaf-700',
  gold: 'bg-gold-100 text-gold-700',
  clay: 'bg-clay-50 text-clay-600',
  saffron: 'bg-saffron-50 text-saffron-500',
  neutral: 'bg-paper-200 text-ink-600',
};

export function Badge({ label, tone = 'neutral', latin, className }: { label: string; tone?: Tone; latin?: boolean; className?: string }) {
  return (
    <View className={twMerge('self-start rounded-full px-2.5 py-1', TONES[tone].split(' ')[0], className)}>
      <Txt variant="caption" weight="semibold" latin={latin} className={twMerge('text-[11px] leading-[14px]', TONES[tone].split(' ')[1])}>
        {label}
      </Txt>
    </View>
  );
}

export const CHANNEL_TONE: Record<Channel, Tone> = { ONDC: 'leaf', GeM: 'gold', B2B: 'clay' };

export const ORDER_TONE: Record<OrderStatus, Tone> = {
  new: 'clay',
  accepted: 'gold',
  packed: 'gold',
  shipped: 'leaf',
  delivered: 'neutral',
};

export function EmptyState({ icon: Icon, image, title, body, action }: { icon: Icon; image?: ImageSourcePropType; title: string; body?: string; action?: ReactNode }) {
  return (
    <View className={twMerge('items-center px-6', image ? 'py-8' : 'py-14')}>
      {image ? (
        <View className="w-44 h-44 rounded-full overflow-hidden mb-5" style={{ backgroundColor: ILLUSTRATION_BG }}>
          <Image source={image} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        </View>
      ) : (
        <View className="w-20 h-20 rounded-full bg-gold-50 border border-gold-200 items-center justify-center mb-5">
          <Icon size={30} color={colors.gold600} strokeWidth={1.5} />
        </View>
      )}
      <Txt variant="heading" className="text-center">
        {title}
      </Txt>
      {body ? (
        <Txt variant="bodySm" className="text-center mt-1.5 max-w-[280px]">
          {body}
        </Txt>
      ) : null}
      {action ? <View className="mt-6 self-stretch">{action}</View> : null}
    </View>
  );
}

interface FieldProps extends TextInputProps {
  label?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
  inputClassName?: string;
  latin?: boolean;
}

export function Field({ label, prefix, suffix, className, inputClassName, latin, style, multiline, ...props }: FieldProps) {
  const { language } = useApp();
  const fontFamily = getBodyFont(latin ? 'english' : language, 'medium');
  return (
    <View className={className}>
      {label ? (
        <Txt variant="caption" weight="semibold" className="mb-1.5 px-1 text-ink-600">
          {label}
        </Txt>
      ) : null}
      <View
        className={twMerge(
          'flex-row bg-white border border-paper-300 rounded-[14px] px-4',
          multiline ? 'items-start py-3 min-h-[120px]' : 'items-center h-14'
        )}
      >
        {prefix ? (
          <Txt variant="body" latin weight="semibold" className="text-ink-500 mr-1.5">
            {prefix}
          </Txt>
        ) : null}
        <TextInput
          {...props}
          multiline={multiline}
          placeholderTextColor={colors.ink400}
          selectionColor={colors.leaf500}
          className={twMerge('flex-1 text-[15px] text-ink-900', multiline && 'leading-[22px]', inputClassName)}
          style={[{ fontFamily, textAlignVertical: multiline ? 'top' : 'center', paddingVertical: 0 }, style]}
        />
        {suffix ? (
          <Txt variant="bodySm" className="ml-2 text-ink-500">
            {suffix}
          </Txt>
        ) : null}
      </View>
    </View>
  );
}

export const formatINR = (value: number) => `₹${Math.round(value).toLocaleString('en-IN')}`;

/** Short form for tight spaces: ₹950, ₹8.9k, ₹1.2L. */
export const formatINRCompact = (value: number) => {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1).replace(/\.0$/, '')}L`;
  if (value >= 10000) return `₹${Math.round(value / 1000)}k`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return `₹${Math.round(value)}`;
};
