import type { ReactNode } from 'react';
import { View, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/theme/colors';
import { Jaali } from './Jaali';

/**
 * Deep green band that continues the status bar into the page, with a faint
 * gold jaali lattice and a gold rule along the bottom edge.
 */
export function HeroBand({ children, style, rounded = true }: { children: ReactNode; style?: ViewStyle; rounded?: boolean }) {
  return (
    <View style={[{ overflow: 'hidden' }, rounded && { borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }, style]}>
      <LinearGradient colors={[colors.leaf500, colors.leaf700, colors.leaf800]} locations={[0, 0.65, 1]} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
      <Jaali />
      {/* Soft gold glow in the top-right corner */}
      <View
        pointerEvents="none"
        style={{ position: 'absolute', right: -80, top: -90, width: 240, height: 240, borderRadius: 120, backgroundColor: colors.gold400, opacity: 0.14 }}
      />
      {children}
      <View style={{ height: 3, backgroundColor: colors.gold400, opacity: rounded ? 0 : 1 }} />
    </View>
  );
}
