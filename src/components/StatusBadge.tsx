import { Text } from 'react-native';
import { twMerge } from 'tailwind-merge';

type StatusTone = 'success' | 'warning' | 'accent' | 'neutral';

const tones: Record<StatusTone, string> = {
  success: 'bg-forest-100 text-forest-600',
  warning: 'bg-terracotta-100 text-terracotta-600',
  accent: 'bg-lavender-100 text-lavender-600',
  neutral: 'bg-cream-200 text-forest-500',
};

export function StatusBadge({ label, tone = 'neutral', className }: { label: string; tone?: StatusTone; className?: string }) {
  return <Text className={twMerge('text-[10px] font-extrabold px-2.5 py-1 rounded-lg overflow-hidden', tones[tone], className)}>{label}</Text>;
}
