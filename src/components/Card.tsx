import { twMerge } from 'tailwind-merge';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

interface CardProps {
  children: ReactNode;
  className?: string;
  onPress?: () => void;
}

export function Card({ children, className, onPress }: CardProps) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={twMerge(
          'bg-cream-50 rounded-3xl shadow-sm shadow-forest-900/5 border border-cream-200 active:scale-[0.98]',
          className
        )}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View
      className={twMerge(
        'bg-cream-50 rounded-3xl shadow-sm shadow-forest-900/5 border border-cream-200',
        className
      )}
    >
      {children}
    </View>
  );
}
