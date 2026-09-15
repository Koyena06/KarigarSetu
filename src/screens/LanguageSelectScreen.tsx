import { Check, Languages, Sparkles, Hammer, Globe } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/AppContext';
import { DASHBOARD_COPY, LANGUAGES } from '@/mockData';
import { PrimaryButton } from '@/components/Button';
import { twMerge } from 'tailwind-merge';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FadeSlideIn } from '@/components/FadeSlideIn';

export function LanguageSelectScreen() {
  const { setLanguage, navigate, language, t } = useApp();
  const copy = DASHBOARD_COPY[language];

  return (
    <SafeAreaView className="flex-1 bg-cream-100" edges={['top', 'bottom']}>
      <ScrollView contentContainerClassName="pb-5" showsVerticalScrollIndicator={false}>
        <FadeSlideIn slide={false} style={{ alignItems: 'center' }}>
          <LinearGradient
            colors={['#16482F', '#236B45']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ width: '100%', paddingTop: 40, paddingBottom: 32, alignItems: 'center' }}
          >
            {/* Decorative emblem rings evoking a potter's wheel / handloom motif */}
            <View pointerEvents="none" style={{ position: 'absolute', left: -40, top: -20 }}>
              <View className="w-40 h-40 rounded-full border-[10px] border-cream-50/10" />
            </View>
            <View pointerEvents="none" style={{ position: 'absolute', right: -30, bottom: -30 }}>
              <View className="w-32 h-32 rounded-full border-[8px] border-gold-400/15" />
            </View>

            <View className="w-24 h-24 rounded-md bg-cream-50/15 border-2 border-cream-50/25 items-center justify-center">
              <Hammer size={40} color="#FFFDF8" strokeWidth={2.3} />
            </View>
            <Text className="text-3xl font-heading-bold tracking-tight text-cream-50 mt-4">KarigarSetu</Text>
            <View className="flex-row items-center gap-1.5 mt-2">
              <Sparkles size={14} color="#EDD48F" strokeWidth={2.4} />
              <Text className="text-sm font-body-semibold text-gold-200">{copy.bridge}</Text>
            </View>
          </LinearGradient>
          <View className="h-[3px] w-full bg-gold-500" />
        </FadeSlideIn>

        <View className="px-5 pt-7">
          <FadeSlideIn delay={100}>
            <View className="flex-row items-center gap-3 mb-2">
              <View className="w-11 h-11 rounded-md bg-lavender-100 items-center justify-center">
                <Languages size={23} color="#60419B" strokeWidth={2.4} />
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-heading-bold text-forest-700">{copy.chooseLanguage}</Text>
                <Text className="text-sm font-body text-forest-400 mt-0.5">{copy.chooseLanguageHint}</Text>
              </View>
            </View>

            <View className="gap-3 mt-5">
              {LANGUAGES.map((item) => {
                const selected = language === item.key;
                return (
                  <Pressable
                    key={item.key}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    onPress={() => setLanguage(item.key)}
                    className={twMerge(
                      'min-h-20 flex-row items-center gap-4 px-5 rounded-md border-2',
                      selected ? 'border-forest-500 bg-forest-50 border-l-[4px] border-l-gold-500' : 'border-cream-200 bg-cream-50'
                    )}
                  >
                    <View className={twMerge('w-12 h-12 rounded-md items-center justify-center', selected ? 'bg-forest-500' : 'bg-cream-200')}>
                      <Globe size={22} color={selected ? '#FFFDF8' : '#88C394'} strokeWidth={2.4} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-lg font-heading-bold text-forest-700">{item.nativeLabel}</Text>
                      <Text className="text-sm font-body text-forest-400 mt-0.5">{item.label}</Text>
                    </View>
                    <View className={twMerge('w-7 h-7 rounded-full border-2 items-center justify-center', selected ? 'border-forest-500 bg-forest-500' : 'border-cream-300')}>
                      {selected && <Check size={16} color="#FFFDF8" strokeWidth={3} />}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </FadeSlideIn>

          <FadeSlideIn delay={180} style={{ marginTop: 24 }}>
            <PrimaryButton size="xl" onPress={() => navigate('home')}>
              {t.continue}
            </PrimaryButton>
          </FadeSlideIn>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
