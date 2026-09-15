import { Bell, Camera, ClipboardList, Package, Send } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';
import { useApp } from '@/AppContext';
import { ARTISAN_NAME, DASHBOARD_COPY, LANGUAGES } from '@/mockData';
import { FeatureCard } from '@/components/FeatureCard';
import { IconButton } from '@/components/IconButton';
import { OfflineBanner } from '@/components/OfflineBanner';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { TabBar } from '@/components/TabBar';
import { FadeSlideIn } from '@/components/FadeSlideIn';
import { getHeadingFont } from '@/theme/fonts';

export function HomeDashboardScreen() {
  const { language, navigate, t } = useApp();
  const copy = DASHBOARD_COPY[language];
  const selectedLanguage = LANGUAGES.find((item) => item.key === language)?.nativeLabel ?? 'English';
  const greetingFont = getHeadingFont(language, 'bold');

  const features = [
    { icon: Camera, title: t.addProduct, subtitle: copy.takePhoto, iconClassName: 'bg-forest-500', onPress: () => navigate('camera') },
    { icon: Package, title: t.myProducts, subtitle: copy.viewManage, iconClassName: 'bg-terracotta-500', onPress: () => navigate('products') },
    { icon: ClipboardList, title: t.orders, subtitle: copy.viewOrders, iconClassName: 'bg-lavender-500', onPress: () => navigate('orders', 'orders') },
    { icon: Send, title: t.publishSell, subtitle: copy.sendToChannels, iconClassName: 'bg-mist-500', onPress: () => navigate('channels') },
  ];

  return (
    <>
      <ScreenWrapper hasTabBar noPadding>
        <FadeSlideIn slide={false}>
          <LinearGradient colors={['#16482F', '#236B45']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingTop: 20, paddingBottom: 24, paddingHorizontal: 16 }}>
            {/* Subtle emblem: layered rings, evokes a potter's wheel / woven motif */}
            <View pointerEvents="none" style={{ position: 'absolute', right: -30, top: -30 }}>
              <View className="w-44 h-44 rounded-full border-[10px] border-cream-50/10" />
            </View>
            <View pointerEvents="none" style={{ position: 'absolute', right: 10, top: 40 }}>
              <View className="w-20 h-20 rounded-full border-[6px] border-gold-400/20" />
            </View>

            <View className="flex-row items-center gap-3">
              <View className="w-[54px] h-[54px] rounded-md bg-cream-50/15 border border-cream-50/25 items-center justify-center">
                <Text className="text-xl font-heading-bold text-cream-50">{ARTISAN_NAME[0]}</Text>
              </View>
              <View className="flex-1 min-w-0">
                <Text className="text-xl font-heading-bold text-cream-50" numberOfLines={1} style={greetingFont ? { fontFamily: greetingFont } : undefined}>{t.greeting}, {ARTISAN_NAME}</Text>
                <Text className="text-sm font-body-medium text-cream-200 mt-0.5">{selectedLanguage} · KarigarSetu</Text>
              </View>
              <IconButton label="Notifications" onPress={() => {}} className="bg-cream-50/15 border-cream-50/25">
                <Bell size={20} color="#FFFDF8" strokeWidth={2.4} />
              </IconButton>
            </View>
          </LinearGradient>
          <View className="h-[3px] bg-gold-500" />
        </FadeSlideIn>

        <View className="px-4">
          <OfflineBanner />

          <FadeSlideIn delay={80} style={{ marginTop: 22 }}>
            <Text className="text-lg font-heading-bold text-forest-700">Your workspace</Text>
            <Text className="text-sm font-body text-forest-400 mt-1">Everything you need to sell your craft online.</Text>
          </FadeSlideIn>

          <View className="gap-3 mt-4">
            {features.map((feature, index) => (
              <FadeSlideIn key={feature.title} delay={120 + index * 65}>
                <FeatureCard {...feature} />
              </FadeSlideIn>
            ))}
          </View>
        </View>
      </ScreenWrapper>
      <TabBar />
    </>
  );
}
