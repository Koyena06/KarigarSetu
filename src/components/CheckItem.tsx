import { Check } from 'lucide-react-native';
import { twMerge } from 'tailwind-merge';
import { View, Text } from 'react-native';

interface CheckItemProps {
  label: string;
  checked: boolean;
}

export function CheckItem({ label, checked }: CheckItemProps) {
  return (
    <View className={twMerge('flex-row items-center gap-4 py-3.5', checked ? 'opacity-100' : 'opacity-40')}>
      <View
        className={twMerge(
          'w-8 h-8 rounded-full items-center justify-center shrink-0',
          checked ? 'bg-forest-500' : 'bg-cream-200'
        )}
      >
        {checked && <Check size={20} color="#FDFAF3" strokeWidth={3} />}
      </View>
      <Text className={twMerge('text-base font-medium', checked ? 'text-forest-700' : 'text-forest-400')}>
        {label}
      </Text>
    </View>
  );
}
