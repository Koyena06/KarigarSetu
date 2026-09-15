import { Image, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight, Camera, ChevronRight, Package, WifiOff } from 'lucide-react-native';
import { useApp } from '@/store/AppContext';
import { GuideCard } from '@/components/GuideCard';
import { TAB_BAR_HEIGHT } from '@/components/TabBar';
import { Txt } from '@/components/Txt';
import { Wordmark } from '@/components/Wordmark';
import { HeroBand } from '@/components/HeroBand';
import { Badge, Card, EmptyState, formatINR, formatINRCompact } from '@/components/ui';
import { colors } from '@/theme/colors';
import { images } from '@/theme/images';

export function HomeScreen() {
  const { t, profile, products, orders, online, startNewProduct, navigate, openProduct } = useApp();
  const insets = useSafeAreaInsets();

  const liveCount = products.filter((p) => p.status === 'published').length;
  const newOrders = orders.filter((o) => o.status === 'new').length;
  const earnings = orders.filter((o) => o.status !== 'new').reduce((sum, o) => sum + o.total, 0);
  const recent = products.slice(0, 4);
  const firstName = profile.name.trim().split(' ')[0];

  const stats = [
    { label: t.liveProducts, value: String(liveCount), onPress: () => navigate('products') },
    { label: t.newOrders, value: String(newOrders), onPress: () => navigate('orders'), highlight: newOrders > 0 },
    { label: t.earnings, value: formatINRCompact(earnings), onPress: () => navigate('orders') },
  ];

  return (
    <ScrollView
      className="flex-1 bg-paper-100"
      contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 24 }}
      showsVerticalScrollIndicator={false}
    >
      {/* The green band continues the status bar colour into the page. */}
      <HeroBand>
        <View className="px-5 pt-3 pb-16">
          <View className="flex-row items-center justify-between">
            <Wordmark size={18} inverted />
          </View>
          <Txt variant="display" className="text-white mt-6">
            {t.greeting}
            {firstName ? ',' : ''}
          </Txt>
          {firstName ? (
            <Txt variant="display" className="text-gold-300 -mt-1">
              {firstName}
            </Txt>
          ) : null}
          {profile.craft ? (
            <Txt variant="bodySm" className="text-leaf-100 mt-1.5">
              {profile.craft}
            </Txt>
          ) : null}

          <View className="flex-row mt-6 rounded-2xl bg-white/10 border border-white/10 overflow-hidden">
            {stats.map((stat, index) => (
              <Pressable key={stat.label} onPress={stat.onPress} className={`flex-1 px-3.5 py-3 active:bg-white/10 ${index > 0 ? 'border-l border-white/10' : ''}`}>
                <Txt variant="title" latin className={stat.highlight ? 'text-gold-300' : 'text-white'} numberOfLines={1}>
                  {stat.value}
                </Txt>
                <Txt variant="caption" numberOfLines={1} className="mt-0.5 text-leaf-100">
                  {stat.label}
                </Txt>
              </Pressable>
            ))}
          </View>
        </View>
      </HeroBand>

      <View className="px-5 -mt-10">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t.addProduct}
          onPress={startNewProduct}
          className="bg-white rounded-[22px] p-4 flex-row items-center gap-4 border border-gold-100 active:opacity-90"
          style={{ shadowColor: '#7A580E', shadowOpacity: 0.16, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 6 }}
        >
          <View className="w-16 h-16 rounded-2xl bg-gold-400 items-center justify-center">
            <Camera size={28} color={colors.leaf900} strokeWidth={1.9} />
          </View>
          <View className="flex-1">
            <Txt variant="heading">{t.addProduct}</Txt>
            <Txt variant="caption" className="mt-0.5">
              {t.addProductHint}
            </Txt>
          </View>
          <View className="w-10 h-10 rounded-full bg-leaf-500 items-center justify-center">
            <ArrowRight size={18} color={colors.white} />
          </View>
        </Pressable>

        {!online && (
          <View className="mt-4 flex-row items-center gap-3 rounded-2xl bg-clay-50 px-4 py-3">
            <WifiOff size={18} color={colors.clay500} />
            <Txt variant="bodySm" className="flex-1 text-clay-600">
              {t.offline}
            </Txt>
          </View>
        )}

        <GuideCard guide="home" className="mt-4" />

        <View className="flex-row items-center justify-between mt-8 mb-3 px-1">
          <View className="flex-row items-center gap-2">
            <View className="w-1 h-4 rounded-full bg-gold-400" />
            <Txt variant="heading">{t.recentProducts}</Txt>
          </View>
          {products.length > 0 && (
            <Pressable onPress={() => navigate('products')} hitSlop={8} className="flex-row items-center">
              <Txt variant="bodySm" weight="semibold" className="text-gold-600">
                {t.seeAll}
              </Txt>
              <ChevronRight size={16} color={colors.gold600} />
            </Pressable>
          )}
        </View>

        {recent.length === 0 ? (
          <Card>
            <EmptyState icon={Package} image={images.emptyProducts} title={t.noProductsYet} body={t.noProductsHint} />
          </Card>
        ) : (
          <Card className="overflow-hidden">
            {recent.map((product, index) => (
              <Pressable
                key={product.id}
                onPress={() => openProduct(product.id)}
                className={`flex-row items-center gap-3.5 px-4 py-3 active:bg-paper-50 ${index > 0 ? 'border-t border-paper-200' : ''}`}
              >
                {product.image ? (
                  <Image source={{ uri: product.image }} className="w-14 h-14 rounded-xl bg-paper-200" />
                ) : (
                  <View className="w-14 h-14 rounded-xl bg-paper-200" />
                )}
                <View className="flex-1">
                  <Txt variant="body" weight="semibold" className="text-ink-900" numberOfLines={1}>
                    {product.title}
                  </Txt>
                  <Txt variant="bodySm" latin weight="semibold" className="mt-0.5 text-gold-600">
                    {formatINR(product.price)}
                  </Txt>
                </View>
                <Badge label={product.status === 'published' ? t.published : t.draft} tone={product.status === 'published' ? 'leaf' : 'neutral'} />
              </Pressable>
            ))}
          </Card>
        )}
      </View>
    </ScrollView>
  );
}
