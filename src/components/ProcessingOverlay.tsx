import type { ReactNode } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { PulseRing } from './PulseRing';
import { FadeSlideIn } from './FadeSlideIn';

interface ProcessingOverlayProps {
  message: string;
  subtext?: string;
  children?: ReactNode;
}

export function ProcessingOverlay({ message, subtext, children }: ProcessingOverlayProps) {
  return (
    <FadeSlideIn slide={false} style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 64 }}>
      <View className="relative mb-8 w-20 h-20 items-center justify-center">
        <PulseRing color="#236B45" size={80} />
        <View className="w-20 h-20 rounded-full bg-forest-50 items-center justify-center">
          <ActivityIndicator size="large" color="#236B45" />
        </View>
      </View>
      <Text className="text-xl font-bold text-forest-700">{message}</Text>
      {subtext && <Text className="text-sm text-forest-400 mt-2">{subtext}</Text>}
      {children}
    </FadeSlideIn>
  );
}
