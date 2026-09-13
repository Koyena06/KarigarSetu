import { useEffect, useRef } from 'react';
import { Animated, Easing, type ViewStyle } from 'react-native';

interface FadeSlideInProps {
  children: React.ReactNode;
  delay?: number;
  slide?: boolean;
  style?: ViewStyle;
}

export function FadeSlideIn({ children, delay = 0, slide = true, style }: FadeSlideInProps) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = Animated.timing(anim, {
      toValue: 1,
      duration: 400,
      delay,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    });
    timer.start();
    return () => timer.stop();
  }, [anim, delay]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: anim,
          transform: slide
            ? [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }]
            : undefined,
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
