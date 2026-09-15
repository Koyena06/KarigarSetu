import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ClipboardList, House, Package, Settings } from 'lucide-react-native';
import { twMerge } from 'tailwind-merge';
import { useApp } from '@/store/AppContext';
import type { ScreenName, TabName } from '@/types';
import { colors } from '@/theme/colors';
import { Txt } from './Txt';

export const TAB_BAR_HEIGHT = 64;

const TABS: { key: TabName; screen: ScreenName; icon: typeof House }[] = [
  { key: 'home', screen: 'home', icon: House },
  { key: 'products', screen: 'products', icon: Package },
  { key: 'orders', screen: 'orders', icon: ClipboardList },
  { key: 'settings', screen: 'settings', icon: Settings },
];

export function TabBar() {
  const { activeTab, navigate, t, orders } = useApp();
  const insets = useSafeAreaInsets();
  const newOrders = orders.filter((o) => o.status === 'new').length;

  return (
    <View
      className="absolute left-0 right-0 bottom-0 bg-white border-t border-paper-200 flex-row"
      style={{ paddingBottom: insets.bottom, height: TAB_BAR_HEIGHT + insets.bottom }}
    >
      {TABS.map(({ key, screen, icon: Icon }) => {
        const active = activeTab === key;
        return (
          <Pressable
            key={key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={t[key]}
            onPress={() => navigate(screen)}
            className="flex-1 items-center justify-center gap-1"
          >
            <View className={twMerge('w-14 h-8 rounded-full items-center justify-center', active && 'bg-gold-100')}>
              <Icon size={21} color={active ? colors.leaf700 : colors.ink400} strokeWidth={active ? 2.3 : 1.9} />
              {key === 'orders' && newOrders > 0 && (
                <View className="absolute top-0.5 right-3 min-w-4 h-4 px-1 rounded-full bg-gold-400 items-center justify-center">
                  <Txt variant="caption" latin weight="bold" className="text-[10px] leading-[12px] text-leaf-900">
                    {newOrders}
                  </Txt>
                </View>
              )}
            </View>
            <Txt variant="caption" weight={active ? 'semibold' : 'medium'} className={active ? 'text-leaf-700' : 'text-ink-500'} numberOfLines={1}>
              {t[key]}
            </Txt>
          </Pressable>
        );
      })}
    </View>
  );
}
