import { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Upload, PartyPopper } from 'lucide-react-native';
import { useApp } from '@/AppContext';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { Button } from '@/components/Button';
import { twMerge } from 'tailwind-merge';
import { View, Text, Animated, Easing } from 'react-native';
import { PulseRing } from '@/components/PulseRing';
import { FadeSlideIn } from '@/components/FadeSlideIn';

const STEPS = [
  { label: 'Validating listing...', key: 'validating' },
  { label: 'Sending to channels...', key: 'sending' },
  { label: 'Going live...', key: 'done' },
];

export function PublishSuccessScreen() {
  const { t, navigate, resetDraft, draft, selectedChannels, addProduct } = useApp();
  const [phase, setPhase] = useState<'uploading' | 'success'>('uploading');
  const [activeStep, setActiveStep] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;
  const bounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const bounceLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, { toValue: -8, duration: 400, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(bounce, { toValue: 0, duration: 400, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      ])
    );
    bounceLoop.start();
    return () => bounceLoop.stop();
  }, [bounce]);

  useEffect(() => {
    const stepTimers: ReturnType<typeof setTimeout>[] = [];
    STEPS.forEach((_, i) => {
      stepTimers.push(
        setTimeout(() => {
          setActiveStep(i);
          Animated.timing(progress, {
            toValue: (i + 1) / STEPS.length,
            duration: 500,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
          }).start();
        }, i * 500)
      );
    });
    const completeTimer = setTimeout(() => {
      const newProduct = {
        id: `new-${Date.now()}`,
        title: draft.title || 'Handpainted Terracotta Pot',
        description: draft.description || '',
        price: draft.price || 600,
        stock: 10,
        image: draft.photo || 'https://images.pexels.com/photos/34144282/pexels-photo-34144282.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        channels: selectedChannels.length > 0 ? selectedChannels : ['ONDC' as const],
        status: 'published' as const,
        costBreakdown: draft.costBreakdown,
      };
      addProduct(newProduct);
      setPhase('success');
    }, 1700);
    return () => {
      stepTimers.forEach(clearTimeout);
      clearTimeout(completeTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === 'uploading') {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center py-12">
          <Animated.View
            className="w-24 h-24 rounded-3xl bg-forest-50 items-center justify-center mb-8"
            style={{ transform: [{ translateY: bounce }] }}
          >
            <Upload size={48} color="#236B45" />
          </Animated.View>
          <Text className="text-xl font-bold text-forest-700 mb-1">Publishing your product...</Text>
          <Text className="text-sm text-forest-400 mb-8">This will just take a moment</Text>

          <View className="w-full max-w-xs">
            <View className="h-3 rounded-full bg-cream-200 overflow-hidden">
              <Animated.View
                className="h-full rounded-full bg-forest-500"
                style={{ width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }}
              />
            </View>
          </View>

          <View className="mt-8 w-full max-w-xs gap-4">
            {STEPS.map((step, i) => (
              <View key={step.key} className={twMerge('flex-row items-center gap-3', i <= activeStep ? 'opacity-100' : 'opacity-30')}>
                <View
                  className={twMerge(
                    'w-8 h-8 rounded-full items-center justify-center shrink-0',
                    i < activeStep ? 'bg-forest-500' : i === activeStep ? 'bg-forest-100 border-2 border-forest-500' : 'bg-cream-200'
                  )}
                >
                  {i < activeStep ? (
                    <CheckCircle2 size={20} color="#FDFAF3" />
                  ) : i === activeStep ? (
                    <View className="w-3 h-3 rounded-full bg-forest-500" />
                  ) : (
                    <View className="w-2 h-2 rounded-full bg-forest-300" />
                  )}
                </View>
                <Text className={twMerge('text-base font-medium', i <= activeStep ? 'text-forest-700' : 'text-forest-400')}>
                  {t[step.key as 'validating' | 'sending' | 'done']}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View className="flex-1 items-center justify-center py-12">
        <View className="relative mb-6 w-28 h-28 items-center justify-center">
          <PulseRing color="#236B45" size={112} />
          <PulseRing color="#236B45" size={112} delay={300} />
          <FadeSlideIn slide={false}>
            <View className="w-28 h-28 rounded-full bg-forest-500 items-center justify-center shadow-lg shadow-forest-500/30">
              <CheckCircle2 size={64} color="#FDFAF3" strokeWidth={2} />
            </View>
          </FadeSlideIn>
        </View>

        <View className="flex-row items-center gap-2 mb-2">
          <PartyPopper size={24} color="#DB7B2E" />
          <Text className="text-2xl font-extrabold text-forest-700">You're Live!</Text>
        </View>
        <Text className="text-center text-sm text-forest-400 max-w-xs mb-2">
          Your product is now selling on {selectedChannels.join(', ')}
        </Text>

        <View className="bg-cream-50 rounded-3xl p-5 border border-cream-200 mt-6 w-full max-w-sm">
          <View className="flex-row items-center gap-2 mb-3">
            <View className="w-2 h-2 rounded-full bg-forest-500" />
            <Text className="text-sm font-bold text-forest-600">Published Summary</Text>
          </View>
          <View className="gap-2">
            <View className="flex-row justify-between">
              <Text className="text-sm text-forest-400">Product</Text>
              <Text className="text-sm font-semibold text-forest-700">{draft.title || 'Terracotta Pot'}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-forest-400">Price</Text>
              <Text className="text-sm font-semibold text-forest-700">₹{draft.price || 600}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-forest-400">Channels</Text>
              <Text className="text-sm font-semibold text-forest-700">{selectedChannels.length} active</Text>
            </View>
          </View>
        </View>

        <View className="w-full max-w-sm mt-8">
          <Button
            size="xl"
            onPress={() => {
              resetDraft();
              navigate('products');
            }}
          >
            {t.viewMyProducts}
          </Button>
        </View>
      </View>
    </ScreenWrapper>
  );
}
