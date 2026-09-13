import { ActivityIndicator, Text, View } from 'react-native';

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <View className="items-center justify-center py-16">
      <View className="w-16 h-16 rounded-3xl bg-mist-100 items-center justify-center mb-4">
        <ActivityIndicator size="large" color="#236B45" />
      </View>
      <Text className="text-sm font-semibold text-forest-500">{label}</Text>
    </View>
  );
}
