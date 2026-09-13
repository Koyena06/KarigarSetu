import type { Channel } from '@/types';
import { twMerge } from 'tailwind-merge';
import { Text } from 'react-native';

const CHANNEL_STYLES: Record<Channel, string> = {
  ONDC: 'bg-forest-100 text-forest-600',
  GeM: 'bg-lavender-100 text-lavender-600',
  B2B: 'bg-terracotta-100 text-terracotta-600',
};

export function ChannelBadge({ channel, className }: { channel: Channel; className?: string }) {
  return (
    <Text
      className={twMerge(
        'text-[10px] font-bold px-2.5 py-1 rounded-lg overflow-hidden',
        CHANNEL_STYLES[channel],
        className
      )}
    >
      {channel}
    </Text>
  );
}
