import { ArrowLeft } from 'lucide-react-native';
import { useApp } from '@/AppContext';
import type { ScreenName } from '@/types';
import { View, Text } from 'react-native';
import { IconButton } from './IconButton';

interface ScreenHeaderProps {
  title: string;
  backTo?: ScreenName;
  rightAction?: React.ReactNode;
}

export function ScreenHeader({ title, backTo = 'home', rightAction }: ScreenHeaderProps) {
  const { navigate } = useApp();

  return (
    <View className="flex-row items-center gap-3 pt-4 pb-3">
      <IconButton label="Go back" onPress={() => navigate(backTo)}>
        <ArrowLeft size={21} color="#1B5938" />
      </IconButton>

      <Text className="font-heading text-2xl text-forest-700 flex-1">{title}</Text>

      {rightAction}
    </View>
  );
}