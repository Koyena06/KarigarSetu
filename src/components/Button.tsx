import type { ReactNode } from 'react';
import { Pressable, Text, type PressableProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'md' | 'lg' | 'xl';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-forest-500 active:bg-forest-700 shadow-md shadow-forest-500/20',
  secondary: 'bg-terracotta-500 active:bg-terracotta-600 shadow-md shadow-terracotta-500/20',
  outline: 'border-2 border-forest-500 bg-cream-50 active:bg-forest-100',
  ghost: 'bg-transparent active:bg-forest-100',
  danger: 'bg-red-500 active:bg-red-700',
};

const variantTextClasses: Record<Variant, string> = {
  primary: 'text-cream-50',
  secondary: 'text-cream-50',
  outline: 'text-forest-600',
  ghost: 'text-forest-600',
  danger: 'text-white',
};

const sizeClasses: Record<Size, string> = {
  md: 'min-h-12 px-5 py-3 rounded-2xl gap-2',
  lg: 'min-h-14 px-6 py-4 rounded-2xl gap-2.5',
  xl: 'min-h-16 px-8 py-5 rounded-[22px] gap-3',
};

const sizeTextClasses: Record<Size, string> = {
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

export function Button({
  variant = 'primary',
  size = 'lg',
  fullWidth = true,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      className={twMerge(
        'flex-row items-center justify-center active:scale-[0.97]',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        disabled && 'opacity-50',
        className
      )}
      {...props}
    >
      {typeof children === 'string' || Array.isArray(children) ? (
        <Text className={twMerge('font-bold text-center', variantTextClasses[variant], sizeTextClasses[size])}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

/** Explicit semantic aliases for new screens; existing callers can retain Button. */
export function PrimaryButton(props: Omit<ButtonProps, 'variant'>) {
  return <Button {...props} variant="primary" />;
}

export function SecondaryButton(props: Omit<ButtonProps, 'variant'>) {
  return <Button {...props} variant="secondary" />;
}
