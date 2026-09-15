import { useId } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Circle, Defs, Path, Pattern, Rect } from 'react-native-svg';
import { colors } from '@/theme/colors';

/** Lattice motif inspired by carved jaali screens, drawn as a repeating SVG tile. */
export function Jaali({ color = colors.gold300, opacity = 0.16, size = 34 }: { color?: string; opacity?: number; size?: number }) {
  const id = `jaali-${useId().replace(/:/g, '')}`;
  const h = size / 2;
  return (
    <Svg width="100%" height="100%" style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <Pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          <Path d={`M${h} 1 L${size - 1} ${h} L${h} ${size - 1} L1 ${h} Z`} stroke={color} strokeWidth={1} fill="none" />
          <Path d={`M${h} ${h * 0.55} L${h * 1.45} ${h} L${h} ${h * 1.45} L${h * 0.55} ${h} Z`} stroke={color} strokeWidth={0.8} fill="none" />
          <Circle cx={0} cy={0} r={2} fill={color} />
          <Circle cx={size} cy={0} r={2} fill={color} />
          <Circle cx={0} cy={size} r={2} fill={color} />
          <Circle cx={size} cy={size} r={2} fill={color} />
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill={`url(#${id})`} opacity={opacity} />
    </Svg>
  );
}
