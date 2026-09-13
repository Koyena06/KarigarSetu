import type { ComponentType } from 'react';
import { ChevronRight } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { twMerge } from 'tailwind-merge';
import { Card } from './Card';

export function FeatureCard({ icon: Icon, title, subtitle, iconClassName, onPress }: {
  icon: ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  title: string;
  subtitle: string;
  iconClassName: string;
  onPress: () => void;
}) {
  return (
    <Card onPress={onPress} className="p-4 flex-row items-center gap-4 min-h-24">
      <View className={twMerge('w-16 h-16 rounded-2xl items-center justify-center shrink-0', iconClassName)}>
        <Icon size={30} color="#FFFDF8" strokeWidth={2.2} />
      </View>
      <View className="flex-1 min-w-0">
        <Text className="text-base font-extrabold text-forest-700" numberOfLines={1}>{title}</Text>
        <Text className="text-sm text-forest-400 mt-0.5" numberOfLines={1}>{subtitle}</Text>
      </View>
      <ChevronRight size={21} color="#88C394" />
    </Card>
  );
}
