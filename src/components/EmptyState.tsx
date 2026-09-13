import type { ReactNode } from 'react';
import { View, Text } from 'react-native';

export function EmptyState({ icon, title, description }: { icon: ReactNode; title: string; description?: string }) {
  return (
    <View className="items-center justify-center py-16 px-8">
      <View className="w-20 h-20 rounded-3xl bg-lavender-100 items-center justify-center mb-5">{icon}</View>
      <Text className="text-lg font-extrabold text-forest-700 text-center">{title}</Text>
      {description && <Text className="text-sm leading-relaxed text-forest-400 text-center mt-2">{description}</Text>}
    </View>
  );
}
