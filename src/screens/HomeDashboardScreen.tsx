import { Bell, Camera, ClipboardList, Mic, Package, Send } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';
import { useApp } from '@/AppContext';
import { ARTISAN_NAME, DASHBOARD_COPY, LANGUAGES } from '@/mockData';
import { FeatureCard } from '@/components/FeatureCard';
import { IconButton } from '@/components/IconButton';
import { OfflineBanner } from '@/components/OfflineBanner';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { TabBar } from '@/components/TabBar';
import { FadeSlideIn } from '@/components/FadeSlideIn';

export function HomeDashboardScreen() {
  const { language, navigate, t } = useApp();
  const copy = DASHBOARD_COPY[language];
  const selectedLanguage = LANGUAGES.find((item) => item.key === language)?.nativeLabel ?? 'English';

  const features = [
    { icon: Camera, title: t.addProduct, subtitle: copy.takePhoto, iconClassName: 'bg-forest-500', onPress: () => navigate('camera') },
    { icon: Package, title: t.myProducts, subtitle: copy.viewManage, iconClassName: 'bg-terracotta-500', onPress: () => navigate('products') },
    { icon: ClipboardList, title: t.orders, subtitle: copy.viewOrders, iconClassName: 'bg-lavender-500', onPress: () => navigate('orders', 'orders') },
    { icon: Send, title: t.publishSell, subtitle: copy.sendToChannels, iconClassName: 'bg-mist-500', onPress: () => navigate('channels') },
  ];

  return (
    <>
      <ScreenWrapper hasTabBar>
        <OfflineBanner />

        <FadeSlideIn slide={false} style={{ paddingTop: 16 }}>
          <View className="flex-row items-center gap-3">
            <LinearGradient colors={['#236B45', '#4C9A61']} style={{ width: 54, height: 54, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
              <Text className="text-xl font-extrabold text-cream-50">{ARTISAN_NAME[0]}</Text>
            </LinearGradient>
            <View className="flex-1 min-w-0">
              <Text className="text-xl font-extrabold text-forest-700" numberOfLines={1}>{t.greeting}, {ARTISAN_NAME}</Text>
              <Text className="text-sm font-medium text-forest-400 mt-0.5">{selectedLanguage} · KarigarSetu</Text>
            </View>
            <IconButton label="Notifications" onPress={() => {}} className="bg-cream-50">
              <Bell size={22} color="#1B5938" />
            </IconButton>
          </View>
        </FadeSlideIn>

        <FadeSlideIn delay={80} style={{ marginTop: 26 }}>
          <Pressable onPress={() => navigate('voice')} className="overflow-hidden rounded-[28px] shadow-md shadow-forest-900/10 active:scale-[0.99]">
            <LinearGradient colors={['#236B45', '#16482F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: 22 }}>
              <View className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-cream-50/10" />
              <View className="flex-row items-center gap-4">
                <View className="w-16 h-16 rounded-3xl bg-cream-50/15 border border-cream-50/20 items-center justify-center">
                  <Mic size={32} color="#FFFDF8" strokeWidth={2.3} />
                </View>
                <View className="flex-1 pr-2">
                  <Text className="text-xl font-extrabold text-cream-50 leading-snug">{copy.voicePrompt}</Text>
                  <Text className="text-sm text-cream-200 leading-relaxed mt-2">{copy.voiceHint}</Text>
                </View>
              </View>
            </LinearGradient>
          </Pressable>
        </FadeSlideIn>

        <FadeSlideIn delay={130} style={{ marginTop: 28 }}>
          <Text className="text-lg font-extrabold text-forest-700">Your workspace</Text>
          <Text className="text-sm text-forest-400 mt-1">Everything you need to sell your craft online.</Text>
        </FadeSlideIn>

        <View className="gap-3 mt-4">
          {features.map((feature, index) => (
            <FadeSlideIn key={feature.title} delay={170 + index * 65}>
              <FeatureCard {...feature} />
            </FadeSlideIn>
          ))}
        </View>
      </ScreenWrapper>
      <TabBar />
    </>
  );
}
