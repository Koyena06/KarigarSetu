import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, Image, Pressable, View } from 'react-native';
import { RotateCcw } from 'lucide-react-native';
import { twMerge } from 'tailwind-merge';
import { useApp } from '@/store/AppContext';
import { providers, services } from '@/config';
import type { StringKey } from '@/i18n/strings';
import { createStudioShot, type StudioBackdrop } from '@/services/image';
import { GeminiError } from '@/services/gemini';
import { Button } from '@/components/Button';
import { FlowProgress } from '@/components/FlowProgress';
import { GuideCard } from '@/components/GuideCard';
import { Header } from '@/components/Header';
import { Screen } from '@/components/Screen';
import { Txt } from '@/components/Txt';
import { colors } from '@/theme/colors';

const BACKDROPS: { key: StudioBackdrop; label: StringKey; swatch: string }[] = [
  { key: 'white', label: 'bgWhite', swatch: '#FFFFFF' },
  { key: 'ivory', label: 'bgIvory', swatch: '#EFE6D4' },
  { key: 'wood', label: 'bgWood', swatch: '#C9A27A' },
  { key: 'stone', label: 'bgStone', swatch: '#B9BCBA' },
];

type ShotState = { status: 'working' } | { status: 'done'; uri: string } | { status: 'failed'; needsBilling: boolean };

/** Results survive leaving and re-entering the screen for the same original photo. */
const shotCache = new Map<string, string>();
const cacheKey = (photo: string, backdrop: StudioBackdrop) => `${photo}|${backdrop}`;

export function EnhanceScreen() {
  const { t, draft, setDraft, navigate } = useApp();
  const original = draft.originalPhoto;
  // remove.bg can only produce a white background.
  const backdrops = providers.studio === 'remove.bg' ? BACKDROPS.slice(0, 1) : BACKDROPS;
  const [backdrop, setBackdrop] = useState<StudioBackdrop>('white');
  const [shots, setShots] = useState<Partial<Record<StudioBackdrop, ShotState>>>(() => {
    if (!original) return {};
    const cached: Partial<Record<StudioBackdrop, ShotState>> = {};
    BACKDROPS.forEach(({ key }) => {
      const uri = shotCache.get(cacheKey(original, key));
      if (uri) cached[key] = { status: 'done', uri };
    });
    return cached;
  });
  const [comparing, setComparing] = useState(false);
  const shimmer = useRef(new Animated.Value(0)).current;
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const generate = (key: StudioBackdrop) => {
    if (!original || !services.studio) return;
    setShots((prev) => ({ ...prev, [key]: { status: 'working' } }));
    createStudioShot(original, key)
      .then((uri) => {
        shotCache.set(cacheKey(original, key), uri);
        if (mounted.current) setShots((prev) => ({ ...prev, [key]: { status: 'done', uri } }));
      })
      .catch((error: unknown) => {
        const needsBilling = error instanceof GeminiError && error.needsBilling;
        if (mounted.current) setShots((prev) => ({ ...prev, [key]: { status: 'failed', needsBilling } }));
      });
  };

  const selectBackdrop = (key: StudioBackdrop) => {
    setBackdrop(key);
    const existing = shots[key];
    if (!existing || existing.status === 'failed') generate(key);
  };

  useEffect(() => {
    if (!original) {
      navigate('camera');
      return;
    }
    if (!shots.white) generate('white');
    // Start the first render once on entry.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = shots[backdrop];
  const working = current?.status === 'working';

  useEffect(() => {
    if (!working) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [working, shimmer]);

  if (!original) return null;

  const studioUri = current?.status === 'done' ? current.uri : null;
  const displayed = studioUri && !comparing ? studioUri : original;

  const useStudio = () => {
    if (!studioUri) return;
    setDraft({ photo: studioUri, enhancedWith: 'studio' });
    navigate('voice');
  };

  const useOriginal = () => {
    setDraft({ photo: original, enhancedWith: 'original' });
    navigate('voice');
  };

  return (
    <Screen
      header={
        <>
          <Header title={t.addProduct} />
          <FlowProgress step={0} />
        </>
      }
      footer={
        <View className="gap-2">
          {studioUri ? <Button label={t.usePhoto} onPress={useStudio} /> : <Button label={t.useOriginal} variant={working ? 'secondary' : 'primary'} onPress={useOriginal} />}
          {studioUri ? <Button label={t.useOriginal} variant="ghost" onPress={useOriginal} /> : <Button label={t.retake} variant="ghost" onPress={() => navigate('camera')} />}
        </View>
      }
    >
      <Txt variant="title" className="mt-1">
        {t.studioTitle}
      </Txt>
      <Txt variant="bodySm" className="mt-1.5">
        {services.studio ? t.studioHint : t.studioOff}
      </Txt>

      <Pressable
        disabled={!studioUri}
        onPressIn={() => setComparing(true)}
        onPressOut={() => setComparing(false)}
        className="mt-5 w-full aspect-square rounded-[20px] overflow-hidden bg-paper-200"
      >
        <Image source={{ uri: displayed }} className="w-full h-full" resizeMode="cover" />

        {working && (
          <View className="absolute inset-0 items-center justify-center bg-black/30">
            <Animated.View
              style={{ opacity: shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }}
            >
              <ActivityIndicator color={colors.white} size="large" />
            </Animated.View>
            <Txt variant="heading" className="text-white mt-4 text-center px-8">
              {t.creatingStudio}
            </Txt>
            <Txt variant="caption" className="text-white/85 mt-1 text-center px-10">
              {t.creatingStudioHint}
            </Txt>
          </View>
        )}

        {studioUri && (
          <View className="absolute top-3 left-3 rounded-full bg-gold-400 px-3 py-1">
            <Txt variant="caption" weight="semibold" className="text-leaf-900">
              {comparing ? t.original : t.studioTitle}
            </Txt>
          </View>
        )}
      </Pressable>

      {studioUri && (
        <Txt variant="caption" className="mt-2 text-center">
          {t.holdToCompare}
        </Txt>
      )}

      {services.studio && (
        <View className="flex-row gap-2.5 mt-5">
          {backdrops.map(({ key, label, swatch }) => {
            const selected = key === backdrop;
            const state = shots[key];
            return (
              <Pressable
                key={key}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                onPress={() => selectBackdrop(key)}
                className={twMerge('flex-1 items-center rounded-2xl border bg-white py-3', selected ? 'border-gold-400 bg-gold-50' : 'border-paper-200')}
                style={selected ? { borderWidth: 1.5 } : undefined}
              >
                <View className="w-9 h-9 rounded-full border border-paper-300 items-center justify-center" style={{ backgroundColor: swatch }}>
                  {state?.status === 'working' && <ActivityIndicator size="small" color={colors.leaf600} />}
                </View>
                <Txt variant="caption" weight={selected ? 'semibold' : 'medium'} className={twMerge('mt-1.5', selected ? 'text-gold-700' : 'text-ink-600')}>
                  {t[label]}
                </Txt>
              </Pressable>
            );
          })}
        </View>
      )}

      {current?.status === 'failed' && (
        <View className="mt-4 rounded-2xl bg-clay-50 px-4 py-3 flex-row items-center gap-3">
          <Txt variant="bodySm" className="flex-1 text-clay-600">
            {current.needsBilling ? t.studioNeedsBilling : t.studioFailed}
          </Txt>
          {!current.needsBilling && <Button label={t.regenerate} size="sm" variant="secondary" icon={RotateCcw} onPress={() => generate(backdrop)} />}
        </View>
      )}

      {studioUri && (
        <Pressable onPress={() => generate(backdrop)} className="self-center mt-3 flex-row items-center gap-1.5 h-10 px-3 rounded-full active:bg-paper-200">
          <RotateCcw size={15} color={colors.leaf600} />
          <Txt variant="bodySm" weight="semibold" className="text-leaf-700">
            {t.regenerate}
          </Txt>
        </Pressable>
      )}

      <GuideCard guide="enhance" className="mt-5" />
    </Screen>
  );
}
