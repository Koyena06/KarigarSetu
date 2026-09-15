import { View, Text } from 'react-native';
import { Check } from 'lucide-react-native';
import { twMerge } from 'tailwind-merge';

interface Step {
  label: string;
}

export function Stepper({ steps, activeIndex }: { steps: Step[]; activeIndex: number }) {
  return (
    <View className="flex-row items-center justify-center py-2">
      {steps.map((step, i) => {
        const done = i < activeIndex;
        const active = i === activeIndex;
        return (
          <View key={step.label} className="flex-row items-center">
            <View className="items-center" style={{ width: 64 }}>
              <View
                className={twMerge(
                  'w-8 h-8 rounded-full items-center justify-center border-2',
                  done ? 'bg-forest-500 border-forest-500' : active ? 'bg-forest-500 border-forest-500' : 'bg-cream-50 border-cream-300'
                )}
              >
                {done ? (
                  <Check size={16} color="#FDFAF3" strokeWidth={3} />
                ) : (
                  <Text className={twMerge('text-xs font-body-bold', active ? 'text-cream-50' : 'text-forest-300')}>{i + 1}</Text>
                )}
              </View>
              <Text className={twMerge('text-[11px] font-body-semibold mt-1', active || done ? 'text-forest-600' : 'text-forest-300')}>
                {step.label}
              </Text>
            </View>
            {i < steps.length - 1 && (
              <View className={twMerge('h-0.5 w-6 -mt-4', i < activeIndex ? 'bg-forest-500' : 'bg-cream-300')} />
            )}
          </View>
        );
      })}
    </View>
  );
}
