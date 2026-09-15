import type { ComponentType } from 'react';
import { ChevronRight } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { twMerge } from 'tailwind-merge';
import { Card } from './Card';
import { useApp } from '@/AppContext';
import { getBodyFont, getHeadingFont } from '@/theme/fonts';

export function FeatureCard({ icon: Icon, title, subtitle, iconClassName, onPress }: {
  icon: ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  title: string;
  subtitle: string;
  iconClassName: string;
  onPress: () => void;
}) {
  const { language } = useApp();
  const titleFont = getHeadingFont(language, 'bold');
  const subtitleFont = getBodyFont(language, 'regular');

  return (
    <Card onPress={onPress} className="p-4 flex-row items-center gap-4 min-h-24">
      <View className={twMerge('w-16 h-16 rounded-md items-center justify-center shrink-0', iconClassName)}>
        <Icon size={28} color="#FFFDF8" strokeWidth={2.4} />
      </View>
      <View className="flex-1 min-w-0">
        <Text
          style={titleFont ? { fontFamily: titleFont } : undefined}
          className="text-base font-body-bold text-forest-700"
          numberOfLines={1}
        >
          {title}
        </Text>
        <Text
          style={subtitleFont ? { fontFamily: subtitleFont } : undefined}
          className="text-sm font-body text-forest-400 mt-0.5"
          numberOfLines={1}
        >
          {subtitle}
        </Text>
      </View>
      <ChevronRight size={24} color="#1B5938" strokeWidth={3} />
    </Card>
  );
}
