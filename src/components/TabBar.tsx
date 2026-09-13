import { Home, Package, ClipboardList, MoreHorizontal } from 'lucide-react-native';
import { useApp } from '@/AppContext';
import type { TabName } from '@/types';
import { twMerge } from 'tailwind-merge';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TABS: { key: TabName; icon: typeof Home; labelKey: 'home' | 'products' | 'orders' | 'more' }[] = [
  { key: 'home', icon: Home, labelKey: 'home' },
  { key: 'products', icon: Package, labelKey: 'products' },
  { key: 'orders', icon: ClipboardList, labelKey: 'orders' },
  { key: 'more', icon: MoreHorizontal, labelKey: 'more' },
];

export function TabBar() {
  const { activeTab, navigate, t } = useApp();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="absolute bottom-0 left-0 right-0 bg-cream-50 border-t border-cream-200 px-3 pt-2 z-30"
      style={{ paddingBottom: Math.max(insets.bottom, 6) }}
    >
      <View className="flex-row items-center justify-around">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              onPress={() =>
                navigate(
                  tab.key === 'home'
                    ? 'home'
                    : tab.key === 'products'
                    ? 'products'
                    : tab.key === 'orders'
                    ? 'orders'
                    : 'settings',
                  tab.key
                )
              }
              className={twMerge('items-center gap-1 py-2.5 px-4 rounded-2xl min-w-16', active && 'bg-forest-100')}
            >
              <Icon size={24} color={active ? '#1B5938' : '#88C394'} strokeWidth={active ? 2.5 : 2} />
              <Text className={twMerge('text-[11px] font-semibold', active ? 'text-forest-600' : 'text-forest-300')}>
                {t[tab.labelKey]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
