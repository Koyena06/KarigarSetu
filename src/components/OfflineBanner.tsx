import { WifiOff } from 'lucide-react-native';
import { useApp } from '@/AppContext';
import { View, Text } from 'react-native';

export function OfflineBanner() {
  const { offline } = useApp();
  if (!offline) return null;

  return (
    <View className="mb-4 bg-terracotta-100 border border-terracotta-200 rounded-3xl px-4 py-3 flex-row items-center gap-3">
      <View className="w-10 h-10 rounded-2xl bg-terracotta-200 items-center justify-center shrink-0">
        <WifiOff size={20} color="#B95F1E" />
      </View>
      <Text className="flex-1 text-sm font-medium text-terracotta-600 leading-snug">
        No internet — saved locally, will sync automatically
      </Text>
    </View>
  );
}
