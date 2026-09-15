import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useApp } from '@/store/AppContext';
import { colors } from '@/theme/colors';
import { HeroBand } from './HeroBand';
import { Txt } from './Txt';

interface HeaderProps {
  title?: string;
  /** Large page title for top-level tabs. */
  large?: boolean;
  subtitle?: string;
  onBack?: () => void;
  showBack?: boolean;
  right?: ReactNode;
}

export function Header({ title, large, subtitle, onBack, showBack = !large, right }: HeaderProps) {
  const { goBack, t } = useApp();

  if (large) {
    return (
      <HeroBand style={{ marginBottom: 16 }}>
        <View className="px-5 pt-4 pb-6 flex-row items-end justify-between gap-3">
          <View className="flex-1">
            <View className="w-8 h-[3px] rounded-full bg-gold-400 mb-3" />
            <Txt variant="display" className="text-white">
              {title}
            </Txt>
            {subtitle ? (
              <Txt variant="bodySm" className="mt-1 text-leaf-100">
                {subtitle}
              </Txt>
            ) : null}
          </View>
          {right}
        </View>
      </HeroBand>
    );
  }

  return (
    <View className="h-14 px-3 flex-row items-center gap-1">
      {showBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t.back}
          hitSlop={8}
          onPress={onBack ?? goBack}
          className="w-11 h-11 rounded-full items-center justify-center active:bg-paper-200"
        >
          <ArrowLeft size={22} color={colors.ink900} strokeWidth={2} />
        </Pressable>
      ) : (
        <View className="w-2" />
      )}
      <Txt variant="heading" className="flex-1" numberOfLines={1}>
        {title}
      </Txt>
      {right}
    </View>
  );
}
