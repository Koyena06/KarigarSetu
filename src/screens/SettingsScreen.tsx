import { User, Globe, WifiOff, HelpCircle, ShieldCheck, FileText, ChevronRight, Check, Info } from 'lucide-react-native';
import { useApp } from '@/AppContext';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { TabBar } from '@/components/TabBar';
import { Card } from '@/components/Card';
import { LANGUAGES, ARTISAN_NAME } from '@/mockData';
import type { Language } from '@/types';
import { twMerge } from 'tailwind-merge';
import { View, Text, Pressable, Switch } from 'react-native';

function Row({
  icon: Icon,
  label,
  value,
  onPress,
}: {
  icon: typeof User;
  label: string;
  value?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center gap-3 py-3.5 active:opacity-60"
    >
      <View className="w-9 h-9 rounded-md bg-forest-50 items-center justify-center">
        <Icon size={18} color="#1B5938" />
      </View>
      <Text className="flex-1 text-sm font-body-semibold text-forest-700">{label}</Text>
      {value && <Text className="text-xs text-forest-400 mr-1">{value}</Text>}
      {onPress && <ChevronRight size={20} color="#1B5938" strokeWidth={3} />}
    </Pressable>
  );
}

export function SettingsScreen() {
  const { language, setLanguage, offline, setOffline, products } = useApp();

  return (
    <>
      <ScreenWrapper hasTabBar>
        <View className="pt-6 pb-4">
          <Text className="text-2xl font-heading-bold text-forest-700">Settings</Text>
          <Text className="text-sm text-forest-400 mt-1">Manage your profile and preferences</Text>
        </View>

        <Card className="p-5 flex-row items-center gap-4 mb-5">
          <View className="w-14 h-14 rounded-full bg-forest-500 items-center justify-center">
            <Text className="text-xl font-body-bold text-cream-50">{ARTISAN_NAME[0]}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-lg font-body-bold text-forest-700">{ARTISAN_NAME}</Text>
            <Text className="text-xs text-forest-400 mt-0.5">{products.length} products in catalog</Text>
          </View>
        </Card>

        <Text className="text-xs font-body-bold text-forest-400 uppercase tracking-wide mb-2 px-1">Language</Text>
        <Card className="px-4 mb-5">
          {LANGUAGES.map((lang, i) => {
            const isSelected = language === lang.key;
            return (
              <Pressable
                key={lang.key}
                onPress={() => setLanguage(lang.key as Language)}
                className={twMerge(
                  'flex-row items-center gap-3 py-3.5 active:opacity-60',
                  i < LANGUAGES.length - 1 && 'border-b border-cream-100'
                )}
              >
                <View className="w-9 h-9 rounded-md bg-cream-100 items-center justify-center">
                  <Globe size={16} color="#4C9A61" strokeWidth={2.4} />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-body-semibold text-forest-700">{lang.nativeLabel}</Text>
                  <Text className="text-xs text-forest-400">{lang.label}</Text>
                </View>
                {isSelected && (
                  <View className="w-6 h-6 rounded-full bg-forest-500 items-center justify-center">
                    <Check size={14} color="#FDFAF3" strokeWidth={3} />
                  </View>
                )}
              </Pressable>
            );
          })}
        </Card>

        <Text className="text-xs font-body-bold text-forest-400 uppercase tracking-wide mb-2 px-1">Preferences</Text>
        <Card className="px-4 mb-5">
          <View className="flex-row items-center gap-3 py-3.5">
            <View className="w-9 h-9 rounded-md bg-forest-50 items-center justify-center">
              <WifiOff size={18} color="#1D4ED8" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-body-semibold text-forest-700">Offline Mode</Text>
              <Text className="text-xs text-forest-400">Simulate no internet connection</Text>
            </View>
            <Switch
              value={offline}
              onValueChange={setOffline}
              trackColor={{ false: '#E9DEFF', true: '#88C394' }}
              thumbColor={offline ? '#1B5938' : '#FFFDF8'}
            />
          </View>
        </Card>

        <Text className="text-xs font-body-bold text-forest-400 uppercase tracking-wide mb-2 px-1">About</Text>
        <Card className="px-4 mb-5">
          <Row icon={HelpCircle} label="Help & Support" onPress={() => {}} />
          <View className="border-b border-cream-100" />
          <Row icon={ShieldCheck} label="Privacy Policy" onPress={() => {}} />
          <View className="border-b border-cream-100" />
          <Row icon={FileText} label="Terms of Service" onPress={() => {}} />
          <View className="border-b border-cream-100" />
          <Row icon={Info} label="App Version" value="1.0.0" />
        </Card>

        <View className="items-center py-4">
          <View className="flex-row items-center gap-1.5 opacity-60">
            <Globe size={12} color="#93C5FD" />
            <Text className="text-[11px] text-forest-300">KarigarSetu · AI for Artisans</Text>
          </View>
        </View>
      </ScreenWrapper>
      <TabBar />
    </>
  );
}
