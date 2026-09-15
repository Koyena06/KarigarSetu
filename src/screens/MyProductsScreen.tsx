import { useState } from 'react';
import { Package, Plus } from 'lucide-react-native';
import { useApp } from '@/AppContext';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { OfflineBanner } from '@/components/OfflineBanner';
import { TabBar } from '@/components/TabBar';
import { Card } from '@/components/Card';
import { ChannelBadge } from '@/components/ChannelBadge';
import { EmptyState } from '@/components/EmptyState';
import { StatusBadge } from '@/components/StatusBadge';
import { twMerge } from 'tailwind-merge';
import type { Product } from '@/types';
import { View, Text, Pressable, Image } from 'react-native';

type FilterTab = 'all' | 'published' | 'draft';

export function MyProductsScreen() {
  const { t, products, navigate } = useApp();
  const [filter, setFilter] = useState<FilterTab>('all');

  const filtered = products.filter((p) => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: t.all, count: products.length },
    { key: 'published', label: t.published, count: products.filter((p) => p.status === 'published').length },
    { key: 'draft', label: t.draft, count: products.filter((p) => p.status === 'draft').length },
  ];

  return (
    <>
      <ScreenWrapper hasTabBar>
        <OfflineBanner />

        <View className="pt-6 pb-4 flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-heading-bold text-forest-700">{t.myProducts}</Text>
            <Text className="text-sm text-forest-400 mt-1">{products.length} products in your catalog</Text>
          </View>
          <Pressable
            onPress={() => navigate('camera')}
            className="flex-row items-center gap-1.5 bg-forest-500 rounded-md pl-3 pr-4 py-2.5 active:scale-95"
          >
            <Plus size={16} color="#FDFAF3" strokeWidth={2.5} />
            <Text className="text-cream-50 text-xs font-body-bold">Add New</Text>
          </Pressable>
        </View>

        <View className="flex-row gap-2 mb-4">
          {tabs.map((tab) => (
            <Pressable
              key={tab.key}
              onPress={() => setFilter(tab.key)}
              className={twMerge(
                'px-4 py-2.5 rounded-md',
              filter === tab.key ? 'bg-forest-500' : 'bg-cream-50 border border-cream-200'
              )}
            >
              <Text className={twMerge('font-body-bold text-sm', filter === tab.key ? 'text-cream-50' : 'text-forest-400')}>
                {tab.label} ({tab.count})
              </Text>
            </Pressable>
          ))}
        </View>

        {filtered.length === 0 ? (
          <EmptyState icon={<Package size={38} color="#7653B8" />} title="No products here yet" description="Add your first item to start building your catalogue." />
        ) : (
          <View className="flex-row flex-wrap gap-3">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </View>
        )}
      </ScreenWrapper>
      <TabBar />
    </>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="overflow-hidden w-[48%]">
      <View className="relative">
        <Image source={{ uri: product.image }} className="w-full h-32" resizeMode="cover" />
        <View className="absolute top-2 right-2">
          <StatusBadge label={product.status === 'published' ? 'Live' : 'Draft'} tone={product.status === 'published' ? 'success' : 'neutral'} />
        </View>
      </View>
      <View className="p-3">
        <Text className="text-sm font-body-bold text-forest-700 leading-snug mb-2" numberOfLines={2}>
          {product.title}
        </Text>
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-lg font-heading-bold text-forest-600">₹{product.price}</Text>
          <Text className="text-xs text-forest-400">{product.stock} in stock</Text>
        </View>
        <View className="flex-row flex-wrap gap-1">
          {product.channels.map((ch) => (
            <ChannelBadge key={ch} channel={ch} />
          ))}
        </View>
      </View>
    </Card>
  );
}
