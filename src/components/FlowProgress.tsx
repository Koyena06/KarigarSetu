import { View } from 'react-native';
import { twMerge } from 'tailwind-merge';
import { useApp } from '@/store/AppContext';
import { format, type StringKey } from '@/i18n/strings';
import { Txt } from './Txt';

const STEPS: StringKey[] = ['stepPhoto', 'stepVoice', 'stepListing', 'stepPrice', 'stepPublish'];

/** Thin segmented progress shown under the header of the add-product flow. */
export function FlowProgress({ step }: { step: number }) {
  const { t } = useApp();
  return (
    <View className="px-5 pb-3">
      <View className="flex-row gap-1.5">
        {STEPS.map((key, index) => (
          <View key={key} className={twMerge('flex-1 h-[3px] rounded-full', index < step ? 'bg-leaf-500' : index === step ? 'bg-gold-400' : 'bg-paper-300')} />
        ))}
      </View>
      <Txt variant="caption" weight="semibold" className="mt-2 text-gold-600">
        {format(t.stepOf, { n: step + 1, total: STEPS.length })} · {t[STEPS[step]]}
      </Txt>
    </View>
  );
}
