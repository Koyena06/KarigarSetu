import type { ReactNode } from 'react';
import { View, Text } from 'react-native';

export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <View className="flex-row items-end justify-between gap-3 mb-3">
      <View className="flex-1">
        <Text className="font-section text-xl text-forest-700">{title}</Text>
        {subtitle && <Text className="font-body text-sm text-forest-400 mt-0.5">{subtitle}</Text>}
      </View>
      {action}
    </View>
  );
}