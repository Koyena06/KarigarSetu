import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';

export function Waveform({ active, bars = 24 }: { active: boolean; bars?: number }) {
  const values = useRef(Array.from({ length: bars }, () => new Animated.Value(0.3))).current;
  const mid = (bars - 1) / 2;

  useEffect(() => {
    if (!active) return;
    const loops = values.map((v, i) => {
      // Bell-curve envelope so amplitude peaks at the center bar and tapers
      // toward the edges, keeping the waveform visually centered as a group.
      const envelope = 1 - Math.abs(i - mid) / (mid + 1);
      return Animated.loop(
        Animated.sequence([
          Animated.delay((i % 5) * 60),
          Animated.timing(v, {
            toValue: (0.25 + Math.random() * 0.75) * envelope + 0.08,
            duration: 350 + (i % 3) * 80,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(v, {
            toValue: (0.15 + Math.random() * 0.35) * envelope + 0.08,
            duration: 350 + (i % 3) * 80,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ])
      );
    });
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [active, values, mid]);

  if (!active) {
    return <View className="h-2 w-48 rounded-full bg-cream-200 self-center" />;
  }

  return (
    <View className="h-24 w-full flex-row items-center justify-center gap-1.5 self-stretch">
      {values.map((v, i) => (
        <Animated.View
          key={i}
          className="w-1.5 rounded-full bg-forest-500"
          style={{ height: v.interpolate({ inputRange: [0, 1], outputRange: ['12%', '100%'] }) }}
        />
      ))}
    </View>
  );
}
