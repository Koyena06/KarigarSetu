import type { ComponentType } from 'react';
import { ActivityIndicator, Pressable, View, type PressableProps } from 'react-native';
import * as Haptics from 'expo-haptics';
import { twMerge } from 'tailwind-merge';
import { colors } from '@/theme/colors';
import { Txt } from './Txt';

type Variant = 'primary' | 'gold' | 'secondary' | 'ghost' | 'danger';
type Size = 'lg' | 'md' | 'sm';

type Icon = ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: Variant;
  size?: Size;
  icon?: Icon;
  loading?: boolean;
  className?: string;
}

const CONTAINER: Record<Variant, string> = {
  primary: 'bg-leaf-500 active:bg-leaf-700',
  gold: 'bg-gold-400 active:bg-gold-500',
  secondary: 'bg-white border border-paper-300 active:bg-paper-100',
  ghost: 'bg-transparent active:bg-paper-200',
  danger: 'bg-transparent border border-clay-100 active:bg-clay-50',
};

const TEXT: Record<Variant, string> = {
  primary: 'text-white',
  gold: 'text-leaf-900',
  secondary: 'text-ink-900',
  ghost: 'text-leaf-600',
  danger: 'text-clay-600',
};

const ICON_COLOR: Record<Variant, string> = {
  primary: colors.white,
  gold: colors.leaf900,
  secondary: colors.ink900,
  ghost: colors.leaf600,
  danger: colors.clay500,
};

const SIZE: Record<Size, string> = {
  lg: 'h-14 px-6 rounded-[14px]',
  md: 'h-12 px-5 rounded-[12px]',
  sm: 'h-10 px-4 rounded-[10px]',
};

export function Button({ label, variant = 'primary', size = 'lg', icon: Icon, loading, disabled, className, onPress, ...props }: ButtonProps) {
  const inactive = disabled || loading;
  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={inactive}
      onPress={(event) => {
        if (variant === 'primary' || variant === 'gold') void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.(event);
      }}
      className={twMerge('flex-row items-center justify-center', SIZE[size], CONTAINER[variant], inactive && 'opacity-50', className)}
    >
      {loading ? (
        <ActivityIndicator color={ICON_COLOR[variant]} />
      ) : (
        <View className="flex-row items-center gap-2">
          {Icon && <Icon size={size === 'sm' ? 16 : 19} color={ICON_COLOR[variant]} strokeWidth={2.2} />}
          <Txt variant={size === 'sm' ? 'bodySm' : 'body'} weight="semibold" className={TEXT[variant]} numberOfLines={1}>
            {label}
          </Txt>
        </View>
      )}
    </Pressable>
  );
}
