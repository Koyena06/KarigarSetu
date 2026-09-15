import { useCallback, useEffect, useState } from 'react';
import { CircleCheck, Sparkles } from 'lucide-react-native';
import { Image, Text, View } from 'react-native';
import { useApp } from '@/AppContext';
import { Button } from '@/components/Button';
import { CheckItem } from '@/components/CheckItem';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { enhanceProductImage, type VisionEnhancementResult } from '@/services/visionService';

type EnhancementStatus = 'preparing' | 'processing' | 'completed' | 'failed';

export function PhotoEnhancementScreen() {
  const { t, navigate, draft, setDraft } = useApp();
  const [status, setStatus] = useState<EnhancementStatus>('preparing');
  const [result, setResult] = useState<VisionEnhancementResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runEnhancement = useCallback(async () => {
    if (!draft.photo) {
      setStatus('failed');
      setError('Choose or capture a product photo before starting enhancement.');
      return;
    }

    setStatus('preparing');
    setError(null);
    setResult(null);
    try {
      await new Promise<void>((resolve) => setTimeout(resolve, 350));
      setStatus('processing');
      const enhancement = await enhanceProductImage(draft.photo);
      setResult(enhancement);
      setDraft({ photo: enhancement.imageUri });
      setStatus('completed');
    } catch (reason) {
      setStatus('failed');
      setError(reason instanceof Error ? reason.message : 'Image enhancement could not be completed.');
    }
  }, [draft.photo, setDraft]);

  useEffect(() => {
    void runEnhancement();
  }, [runEnhancement]);

  const imageUri = result?.imageUri ?? draft.photo;

  if (status === 'failed') {
    return (
      <ScreenWrapper>
        <ScreenHeader title="AI Image Enhancement" backTo="camera" />
        <ErrorState title="Enhancement couldn’t finish" description={error ?? undefined} />
        <View className="gap-3">
          <Button onPress={() => void runEnhancement()}>Retry Enhancement</Button>
          <Button variant="outline" onPress={() => navigate('camera')}>Choose Another Photo</Button>
        </View>
      </ScreenWrapper>
    );
  }

  if (status === 'preparing' || status === 'processing') {
    return (
      <ScreenWrapper>
        <ScreenHeader title="AI Image Enhancement" backTo="camera" />
        <LoadingState label={status === 'preparing' ? 'Preparing your product photo…' : 'Improving your product photo…'} />
        {imageUri && <Image source={{ uri: imageUri }} className="w-36 h-36 rounded-md self-center border-4 border-cream-200" resizeMode="cover" />}
        <View className="bg-mist-50 border border-mist-200 rounded-md p-4 mt-7">
          <Text className="text-sm font-body-bold text-mist-500">{status === 'preparing' ? 'Preparing' : 'Processing'}</Text>
          <Text className="text-sm leading-relaxed text-forest-500 mt-1">We are creating a cleaner product presentation while preserving your original image.</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScreenHeader title="AI Image Enhancement" backTo="camera" />
      <View className="flex-row gap-3 bg-forest-50 border border-forest-100 rounded-md p-4 mb-5">
        <View className="w-10 h-10 rounded-md bg-forest-500 items-center justify-center shrink-0"><CircleCheck size={22} color="#FFFDF8" /></View>
        <View className="flex-1">
          <Text className="text-base font-heading-bold text-forest-700">Your product photo is ready</Text>
          <Text className="text-xs text-forest-500 leading-relaxed mt-0.5">The current demo keeps your original image URI while the enhancement service interface is ready for a live provider.</Text>
        </View>
      </View>

      <View className="flex-row items-center justify-center gap-2 mb-3">
        <Sparkles size={16} color="#A87D1E" strokeWidth={2.4} />
        <Text className="text-sm font-heading-bold text-forest-700 tracking-wide">BEFORE → AFTER</Text>
      </View>
      <View className="flex-row gap-3 mb-6">
        <View className="flex-1">
          <Text className="text-xs font-body-bold text-forest-400 mb-2 text-center">Original</Text>
          <View className="rounded-md overflow-hidden border-2 border-cream-200 bg-cream-200">
            {imageUri && <Image source={{ uri: imageUri }} className="w-full h-44 opacity-75" resizeMode="cover" />}
          </View>
        </View>
        <View className="flex-1">
          <Text className="text-xs font-body-bold text-forest-500 mb-2 text-center">Enhanced</Text>
          <View className="rounded-md overflow-hidden border-2 border-forest-500 bg-forest-50">
            {imageUri && <Image source={{ uri: imageUri }} className="w-full h-44" resizeMode="cover" />}
          </View>
        </View>
      </View>

      <View className="bg-cream-50 rounded-md p-5 border border-cream-200 border-l-[3px] border-l-gold-500 mb-6">
        <Text className="text-base font-heading-bold text-forest-700 mb-2">Enhancement summary</Text>
        <CheckItem label={t.backgroundRemoved.replace('removed', 'improved')} checked={result?.checks.includes('background') ?? false} />
        <CheckItem label={t.lightingImproved} checked={result?.checks.includes('lighting') ?? false} />
        <CheckItem label={t.productCentered} checked={result?.checks.includes('centred') ?? false} />
      </View>

      <View className="gap-3">
        <Button size="xl" onPress={() => navigate('voice')}>Use This Photo</Button>
        <Button size="lg" variant="outline" onPress={() => navigate('camera')}>Retake Photo</Button>
      </View>
    </ScreenWrapper>
  );
}
