import { Pressable, Text, View } from 'react-native';
import { ChevronDown, Globe } from 'lucide-react-native';
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
      className="flex-row items-center gap-1.5 bg-cream-50 border border-cream-200 rounded-md px-3 py-2 active:bg-cream-100"
    >
      <Globe size={15} color="#4C9A61" strokeWidth={2.4} />
      <Text className="text-xs font-body-bold text-forest-600">{current.nativeLabel}</Text>
      <View className="ml-0.5">
        <ChevronDown size={13} color="#4C9A61" strokeWidth={2.6} />
      </View>
    </Pressable>
  );
}
