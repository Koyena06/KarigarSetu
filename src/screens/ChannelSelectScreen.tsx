import { ShoppingBag, Building2, Handshake, Check } from 'lucide-react-native';
import { useApp } from '@/AppContext';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Button } from '@/components/Button';
import { CHANNEL_INFO } from '@/mockData';
import type { Channel } from '@/types';
import { twMerge } from 'tailwind-merge';
import { View, Text, Pressable } from 'react-native';

const ICON_MAP = { 'shopping-bag': ShoppingBag, 'building-2': Building2, handshake: Handshake };

export function ChannelSelectScreen() {
  const { t, navigate, selectedChannels, toggleChannel } = useApp();

  const handleGoLive = () => {
    navigate('success');
  };

  return (
    <ScreenWrapper>
      <ScreenHeader title="Publish / Sell" backTo="price" />

      <View className="mb-5">
        <Text className="text-lg font-bold text-forest-700 mb-1">Select Channels</Text>
        <Text className="text-sm text-forest-400">Choose where to sell your product</Text>
      </View>

      <View className="gap-3 mb-8">
        {(Object.keys(CHANNEL_INFO) as Channel[]).map((channel) => {
          const info = CHANNEL_INFO[channel];
          const Icon = ICON_MAP[info.icon];
          const isSelected = selectedChannels.includes(channel);

          return (
            <Pressable
              key={channel}
              onPress={() => toggleChannel(channel)}
              className={twMerge(
                'flex-row items-center gap-4 p-5 rounded-3xl border-2 active:scale-[0.98]',
                isSelected ? 'border-forest-500 bg-cream-50 shadow-md shadow-forest-500/10' : 'border-cream-200 bg-cream-50/70'
              )}
            >
              <View
                className={twMerge('w-14 h-14 rounded-2xl items-center justify-center shrink-0', isSelected ? 'bg-forest-500' : 'bg-cream-200')}
              >
                <Icon size={28} color={isSelected ? '#FFFDF8' : '#4C9A61'} strokeWidth={2} />
              </View>
              <View className="flex-1 min-w-0">
                <Text className="text-lg font-bold text-forest-700">{channel}</Text>
                <Text className="text-sm text-forest-400 leading-snug">{info.description}</Text>
              </View>
              <View
                className={twMerge(
                  'w-7 h-7 rounded-full border-2 items-center justify-center shrink-0',
                  isSelected ? 'border-forest-500 bg-forest-500' : 'border-cream-300'
                )}
              >
                {isSelected && <Check size={16} color="#FDFAF3" strokeWidth={3} />}
              </View>
            </Pressable>
          );
        })}
      </View>

      <Button size="xl" variant="secondary" onPress={handleGoLive} disabled={selectedChannels.length === 0}>
        {t.goLive}
      </Button>
    </ScreenWrapper>
  );
}
