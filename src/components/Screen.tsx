import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { twMerge } from 'tailwind-merge';
import { TAB_BAR_HEIGHT } from './TabBar';

interface ScreenProps {
  children: ReactNode;
  header?: ReactNode;
  /** Sticky bottom area, usually the primary action. */
  footer?: ReactNode;
  withTabBar?: boolean;
  scroll?: boolean;
  contentClassName?: string;
}

/** Page shell. The status-bar inset is handled once at the app root. */
export function Screen({ children, header, footer, withTabBar, scroll = true, contentClassName }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const bottomInset = withTabBar ? TAB_BAR_HEIGHT + insets.bottom : footer ? 0 : insets.bottom;

  return (
    <KeyboardAvoidingView className="flex-1 bg-paper-100" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {header}
      {scroll ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName={twMerge('px-5 pt-2', contentClassName)}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: bottomInset + 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View className={twMerge('flex-1 px-5', contentClassName)} style={{ paddingBottom: bottomInset }}>
          {children}
        </View>
      )}
      {footer && (
        <View className="px-5 pt-3 bg-paper-100 border-t border-paper-200" style={{ paddingBottom: Math.max(insets.bottom, 12) + 4 }}>
          {footer}
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
