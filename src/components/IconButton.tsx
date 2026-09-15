import type { ReactNode } from 'react';
import { Pressable, type PressableProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface IconButtonProps extends Omit<PressableProps, 'children'> {
  children: ReactNode;
  label: string;
  className?: string;
}

export function IconButton({ children, label, className, ...props }: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      className={twMerge(
        'w-12 h-12 rounded-md bg-cream-50 border border-cream-200 items-center justify-center active:bg-cream-100',
        className
      )}
      {...props}
    >
      {children}
    </Pressable>
  );
}
