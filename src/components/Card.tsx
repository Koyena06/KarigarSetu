import { twMerge } from 'tailwind-merge';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

interface CardProps {
  children: ReactNode;
  className?: string;
  onPress?: () => void;
  /** Adds a thin left accent bar in the given color class, e.g. 'border-l-forest-500'. */
  accent?: string;
}

export function Card({ children, className, onPress, accent }: CardProps) {
  const base = twMerge(
    'bg-cream-50 rounded-md border border-cream-200',
    accent && twMerge('border-l-[3px]', accent),
    className
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} className={twMerge(base, 'active:bg-cream-100')}>
        {children}
      </Pressable>
    );
  }

  return <View className={base}>{children}</View>;
}
