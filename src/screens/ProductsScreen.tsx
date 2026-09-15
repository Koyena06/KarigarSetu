import { useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { Package, Plus } from 'lucide-react-native';
import { twMerge } from 'tailwind-merge';
import { useApp } from '@/store/AppContext';
import { format } from '@/i18n/strings';
import { Button } from '@/components/Button';
import { GuideCard } from '@/components/GuideCard';
import { Header } from '@/components/Header';
import { Screen } from '@/components/Screen';
import { Txt } from '@/components/Txt';
import { Badge, EmptyState, formatINR } from '@/components/ui';
import { colors } from '@/theme/colors';
import { images } from '@/theme/images';

type Filter = 'all' | 'published' | 'draft';

export function ProductsScreen() {
  const { t, products, startNewProduct, openProduct } = useApp();
  const [filter, setFilter] = useState<Filter>('all');
  const filtered = products.filter((p) => filter === 'all' || p.status === filter);

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: 'all', label: t.all, count: products.length },
    { key: 'published', label: t.published, count: products.filter((p) => p.status === 'published').length },
    { key: 'draft', label: t.draft, count: products.filter((p) => p.status === 'draft').length },
  ];

  return (
    <Screen
      withTabBar
      header={
        <Header
          large
          title={t.products}
          right={
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t.addProduct}
              onPress={startNewProduct}
              className="w-12 h-12 rounded-full bg-gold-400 items-center justify-center active:bg-gold-500 mb-1"
            >
              <Plus size={22} color={colors.leaf900} strokeWidth={2.4} />
            </Pressable>
          }
        />
      }
    >
      <View className="flex-row bg-paper-200 rounded-[12px] p-1">
        {filters.map((f) => (
          <Pressable key={f.key} onPress={() => setFilter(f.key)} className={twMerge('flex-1 h-9 rounded-[9px] items-center justify-center', filter === f.key && 'bg-leaf-500')}>
            <Txt variant="bodySm" weight="semibold" className={filter === f.key ? 'text-white' : 'text-ink-600'}>
              {f.label} <Txt variant="bodySm" latin weight="semibold" className={filter === f.key ? 'text-gold-300' : 'text-ink-400'}>{f.count}</Txt>
            </Txt>
          </Pressable>
        ))}
      </View>

      <GuideCard guide="products" className="mt-4" />

      {filtered.length === 0 ? (
        <EmptyState
          icon={Package}
          image={images.emptyProducts}
          title={t.noProductsYet}
          body={t.noProductsHint}
          action={<Button label={t.addProduct} icon={Plus} onPress={startNewProduct} />}
        />
      ) : (
        <View className="flex-row flex-wrap justify-between mt-4" style={{ rowGap: 14 }}>
          {filtered.map((product) => (
            <Pressable key={product.id} onPress={() => openProduct(product.id)} className="w-[48.5%] active:opacity-80">
              <View className="w-full aspect-square rounded-2xl overflow-hidden bg-paper-200">
                {product.image ? <Image source={{ uri: product.image }} className="w-full h-full" resizeMode="cover" /> : null}
                <View className="absolute top-2 left-2">
                  <Badge label={product.status === 'published' ? t.published : t.draft} tone={product.status === 'published' ? 'leaf' : 'neutral'} className={product.status === 'published' ? 'bg-white' : 'bg-white/90'} />
                </View>
              </View>
              <Txt variant="bodySm" weight="semibold" latin className="text-ink-900 mt-2" numberOfLines={1}>
                {product.title}
              </Txt>
              <View className="flex-row items-center justify-between mt-0.5">
                <Txt variant="body" latin weight="semibold" className="text-gold-600">
                  {formatINR(product.price)}
                </Txt>
                <Txt variant="caption" className={product.stock === 0 ? 'text-clay-500' : undefined}>
                  {format(t.inStock, { n: product.stock })}
                </Txt>
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </Screen>
  );
}
