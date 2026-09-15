import { View, Text } from 'react-native';
import { Lightbulb } from 'lucide-react-native';

export function InfoCallout({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <View className="flex-row gap-3 bg-mist-50 border border-mist-200 rounded-md p-4">
      <View className="w-9 h-9 rounded-md bg-mist-100 items-center justify-center shrink-0">
        <Lightbulb size={17} color="#287B76" />
      </View>
      <View className="flex-1">
        {title && <Text className="text-sm font-body-bold text-forest-700 mb-0.5">{title}</Text>}
        <Text className="text-xs text-forest-500 leading-relaxed">{children}</Text>
      </View>
    </View>
  );
}
