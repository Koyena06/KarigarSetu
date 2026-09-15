import { useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, ChevronDown } from 'lucide-react-native';
import { twMerge } from 'tailwind-merge';
import { useApp } from '@/store/AppContext';
import { LANGUAGES, getLanguageInfo } from '@/i18n/languages';
import { colors } from '@/theme/colors';
import { getBodyFont } from '@/theme/fonts';
import type { Language } from '@/types';
import { Txt } from './Txt';

/** Dropdown field that opens a bottom sheet of languages. */
export function LanguagePicker({ className }: { className?: string }) {
  const { language, setLanguage, t } = useApp();
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const current = getLanguageInfo(language);

  const choose = (key: Language) => {
    setLanguage(key);
    setOpen(false);
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${t.language}: ${current.label}`}
        onPress={() => setOpen(true)}
        className={twMerge('h-14 px-4 rounded-[14px] bg-white border border-paper-300 flex-row items-center active:bg-paper-50', className)}
      >
        <View className="flex-1 flex-row items-baseline gap-2">
          <Txt variant="body" weight="semibold" className="text-ink-900">
            {current.nativeLabel}
          </Txt>
          {current.key !== 'english' && (
            <Txt variant="caption" latin>
              {current.label}
            </Txt>
          )}
        </View>
        <ChevronDown size={20} color={colors.ink500} strokeWidth={2} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" statusBarTranslucent navigationBarTranslucent onRequestClose={() => setOpen(false)}>
        <Pressable className="flex-1 bg-black/40" onPress={() => setOpen(false)} />
        <View className="bg-white rounded-t-[24px] pt-2" style={{ paddingBottom: insets.bottom + 12, maxHeight: '75%' }}>
          <View className="self-center w-10 h-1 rounded-full bg-paper-300 mb-3" />
          <Txt variant="heading" className="px-6 pb-2">
            {t.selectLanguage}
          </Txt>
          <ScrollView>
            {LANGUAGES.map((item, index) => {
              const selected = item.key === language;
              return (
                <Pressable
                  key={item.key}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  onPress={() => choose(item.key)}
                  className={twMerge('mx-3 px-3 h-14 rounded-xl flex-row items-center active:bg-paper-100', selected && 'bg-leaf-50', index > 0 && 'mt-0.5')}
                >
                  <View className="flex-1">
                    <Txt variant="body" weight={selected ? 'semibold' : 'medium'} className={selected ? 'text-leaf-700' : 'text-ink-900'} style={{ fontFamily: getBodyFont(item.key, selected ? 'semibold' : 'medium') }}>
                      {item.nativeLabel}
                    </Txt>
                  </View>
                  <Txt variant="caption" latin className="mr-3">
                    {item.label}
                  </Txt>
                  <View className="w-5 items-center">{selected && <Check size={18} color={colors.leaf600} strokeWidth={2.5} />}</View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}
