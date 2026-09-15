import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/store/AppContext';
import { TutorialSlides } from '@/components/TutorialSlides';

/** Replay of the onboarding walkthrough, opened from Settings. */
export function TutorialScreen() {
  const { t, startNewProduct, navigate } = useApp();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-paper-100" style={{ paddingBottom: insets.bottom }}>
      <TutorialSlides finishLabel={t.tryNow} onFinish={startNewProduct} onSkip={() => navigate('settings')} />
    </View>
  );
}
