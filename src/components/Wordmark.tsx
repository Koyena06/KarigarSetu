import { Text } from 'react-native';
import { DISPLAY_FONT } from '@/theme/fonts';

export function Wordmark({ size = 22, inverted = false }: { size?: number; inverted?: boolean }) {
  return (
    <Text style={{ fontFamily: DISPLAY_FONT, fontSize: size, lineHeight: size * 1.25, letterSpacing: -0.3 }}>
      <Text style={{ color: inverted ? '#FFFFFF' : '#161D19' }}>Karigar</Text>
      <Text style={{ color: inverted ? '#EEC55A' : '#1F6B47' }}>Setu</Text>
    </Text>
  );
}
