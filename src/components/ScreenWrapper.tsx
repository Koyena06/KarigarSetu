import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenWrapperProps {
  children: ReactNode;
  className?: string;
  hasTabBar?: boolean;
  noPadding?: boolean;
}

export function ScreenWrapper({ children, className, hasTabBar = false, noPadding = false }: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className={twMerge('flex-1 bg-cream-100', !noPadding && 'px-4', className)}
      contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top, paddingBottom: hasTabBar ? 80 : Math.max(insets.bottom, 16) }}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}
