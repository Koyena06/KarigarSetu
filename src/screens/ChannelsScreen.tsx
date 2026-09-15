import { Image, Pressable, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Check } from 'lucide-react-native';
import { twMerge } from 'tailwind-merge';
import { useApp } from '@/store/AppContext';
import type { StringKey } from '@/i18n/strings';
import type { Channel } from '@/types';
import { Button } from '@/components/Button';
import { FlowProgress } from '@/components/FlowProgress';
import { GuideCard } from '@/components/GuideCard';
import { Header } from '@/components/Header';
import { Screen } from '@/components/Screen';
import { Txt } from '@/components/Txt';
import { Card, formatINR } from '@/components/ui';
import { colors } from '@/theme/colors';

const CHANNELS: { key: Channel; description: StringKey }[] = [
  { key: 'ONDC', description: 'ondcDesc' },
  { key: 'GeM', description: 'gemDesc' },
  { key: 'B2B', description: 'b2bDesc' },
];

export function ChannelsScreen() {
  const { t, draft, selectedChannels, toggleChannel, publishDraft, navigate } = useApp();

  const publish = () => {
    publishDraft('published');
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    navigate('success');
  };

  const saveDraft = () => {
    publishDraft('draft');
    navigate('products');
  };

  return (
    <Screen
      header={
        <>
          <Header title={t.addProduct} />
          <FlowProgress step={4} />
        </>
      }
      footer={
        <View className="gap-2">
          <Button label={t.publish} variant="gold" disabled={selectedChannels.length === 0} onPress={publish} />
          <Button label={t.saveDraft} variant="ghost" onPress={saveDraft} />
        </View>
      }
    >
      <Card className="flex-row items-center gap-3.5 p-3 mt-1">
        {draft.photo ? <Image source={{ uri: draft.photo }} className="w-16 h-16 rounded-xl" /> : <View className="w-16 h-16 rounded-xl bg-paper-200" />}
        <View className="flex-1">
          <Txt variant="body" weight="semibold" latin className="text-ink-900" numberOfLines={2}>
            {draft.title}
          </Txt>
          <Txt variant="bodySm" latin weight="semibold" className="mt-0.5 text-gold-600">
            {formatINR(draft.price)} · {draft.stock} pcs
          </Txt>
        </View>
      </Card>

      <Txt variant="title" className="mt-7">
        {t.channelsTitle}
      </Txt>
      <Txt variant="bodySm" className="mt-1">
        {t.channelsHint}
      </Txt>

      <View className="gap-3 mt-4">
        {CHANNELS.map(({ key, description }) => {
          const selected = selectedChannels.includes(key);
          return (
            <Pressable
              key={key}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selected }}
              onPress={() => toggleChannel(key)}
              className={twMerge('flex-row items-center gap-4 rounded-2xl border px-4 py-4', selected ? 'bg-gold-50 border-gold-400' : 'bg-white border-paper-200')}
              style={selected ? { borderWidth: 1.5 } : undefined}
            >
              <View className="flex-1">
                <Txt variant="heading" latin>
                  {key}
                </Txt>
                <Txt variant="bodySm" className="mt-0.5">
                  {t[description]}
                </Txt>
              </View>
              <View className={twMerge('w-6 h-6 rounded-md items-center justify-center border', selected ? 'bg-leaf-500 border-leaf-500' : 'border-paper-300')}>
                {selected && <Check size={15} color={colors.white} strokeWidth={3} />}
              </View>
            </Pressable>
          );
        })}
      </View>

      <GuideCard guide="channels" className="mt-5" />
    </Screen>
  );
}
