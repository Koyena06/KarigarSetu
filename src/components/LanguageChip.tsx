import { Pressable, Text, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { useApp } from '@/AppContext';
import { LANGUAGES } from '@/mockData';

export function LanguageChip() {
  const { language, setLanguage } = useApp();
  const current = LANGUAGES.find((l) => l.key === language) ?? LANGUAGES[0];

  const cycle = () => {
    const idx = LANGUAGES.findIndex((l) => l.key === language);
    const next = LANGUAGES[(idx + 1) % LANGUAGES.length];
    setLanguage(next.key);
  };

  return (
    <Pressable
      onPress={cycle}
      className="flex-row items-center gap-1.5 bg-cream-50 border border-cream-200 rounded-full px-3 py-2 active:scale-95"
    >
      <Text className="text-base">{current.flag}</Text>
      <Text className="text-xs font-bold text-forest-600">{current.nativeLabel}</Text>
      <View className="ml-0.5">
        <ChevronDown size={12} color="#4C9A61" />
      </View>
    </Pressable>
  );
}
