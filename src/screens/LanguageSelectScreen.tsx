import { Check, Languages } from 'lucide-react-native';
import { useApp } from '@/AppContext';
import { DASHBOARD_COPY, LANGUAGES } from '@/mockData';
import { PrimaryButton } from '@/components/Button';
import { twMerge } from 'tailwind-merge';
import { View, Text, Pressable, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FadeSlideIn } from '@/components/FadeSlideIn';
import karigarSetuLogo from '../../assets/karigarsetu-logo.png';

export function LanguageSelectScreen() {
  const { setLanguage, navigate, language, t } = useApp();
  const copy = DASHBOARD_COPY[language];

  return (
    <SafeAreaView
      className="flex-1 bg-cream-100"
      edges={['top', 'bottom']}
    >
      <ScrollView
        contentContainerClassName="px-5 pt-7 pb-5"
        showsVerticalScrollIndicator={false}
      >
        <FadeSlideIn
          slide={false}
          style={{
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Image
            source={karigarSetuLogo}
            style={{
              width: 320,
              height: 160,
            }}
            resizeMode="contain"
          />
        </FadeSlideIn>

        <FadeSlideIn
          delay={100}
          style={{
            marginTop: 30,
          }}
        >
          <View className="flex-row items-center gap-3 mb-2">
            <View className="w-11 h-11 rounded-2xl bg-lavender-100 items-center justify-center">
              <Languages size={23} color="#60419B" />
            </View>

            <View className="flex-1">
              <Text className="font-section text-xl text-forest-700">
                {copy.chooseLanguage}
              </Text>

              <Text className="font-body text-sm text-forest-400 mt-0.5">
                {copy.chooseLanguageHint}
              </Text>
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
                    'min-h-20 flex-row items-center gap-4 px-5 rounded-3xl border-2',
                    selected
                      ? 'border-forest-500 bg-forest-50'
                      : 'border-cream-200 bg-cream-50'
                  )}
                >
                  <View
                    className={twMerge(
                      'w-12 h-12 rounded-2xl items-center justify-center',
                      selected ? 'bg-forest-100' : 'bg-cream-100'
                    )}
                  >
                    <Text className="text-2xl">{item.flag}</Text>
                  </View>

                  <View className="flex-1">
                    <Text className="font-bold text-lg text-forest-700">
                      {item.nativeLabel}
                    </Text>

                    <Text className="font-body text-sm text-forest-400 mt-0.5">
                      {item.label}
                    </Text>
                  </View>

                  <View
                    className={twMerge(
                      'w-7 h-7 rounded-full border-2 items-center justify-center',
                      selected
                        ? 'border-forest-500 bg-forest-500'
                        : 'border-cream-300'
                    )}
                  >
                    {selected && (
                      <Check
                        size={16}
                        color="#FFFDF8"
                        strokeWidth={3}
                      />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </FadeSlideIn>

        <FadeSlideIn
          delay={180}
          style={{ marginTop: 24 }}
        >
          <PrimaryButton
            size="xl"
            onPress={() => navigate('home')}
          >
            {t.continue}
          </PrimaryButton>
        </FadeSlideIn>
      </ScrollView>
    </SafeAreaView>
  );
}