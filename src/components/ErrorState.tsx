import { AlertCircle } from 'lucide-react-native';
import { Text, View } from 'react-native';

export function ErrorState({ title = 'Something went wrong', description }: { title?: string; description?: string }) {
  return (
    <View className="items-center justify-center py-16 px-8">
      <View className="w-16 h-16 rounded-3xl bg-terracotta-100 items-center justify-center mb-4">
        <AlertCircle size={30} color="#B95F1E" />
      </View>
      <Text className="text-lg font-extrabold text-forest-700 text-center">{title}</Text>
      {description && <Text className="text-sm leading-relaxed text-forest-400 text-center mt-2">{description}</Text>}
    </View>
  );
}
