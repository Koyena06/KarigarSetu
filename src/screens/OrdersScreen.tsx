import { ClipboardList } from 'lucide-react-native';
import { useApp } from '@/AppContext';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { OfflineBanner } from '@/components/OfflineBanner';
import { TabBar } from '@/components/TabBar';
import { Card } from '@/components/Card';
import { ChannelBadge } from '@/components/ChannelBadge';
import { EmptyState } from '@/components/EmptyState';
import { StatusBadge } from '@/components/StatusBadge';
import { View, Text, Image } from 'react-native';

const ORDERS = [
  { id: 'O1', product: 'Handpainted Terracotta Pot', qty: 2, total: 1200, status: 'New', channel: 'ONDC' as const, image: 'https://images.pexels.com/photos/34144282/pexels-photo-34144282.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'O2', product: 'Leather Handmade Bag', qty: 1, total: 1500, status: 'Packed', channel: 'B2B' as const, image: 'https://images.pexels.com/photos/27680730/pexels-photo-27680730.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'O3', product: 'Silver Tribal Earrings', qty: 3, total: 2550, status: 'Shipped', channel: 'GeM' as const, image: 'https://images.pexels.com/photos/9871565/pexels-photo-9871565.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
];

export function OrdersScreen() {
  const { t } = useApp();

  return (
    <>
      <ScreenWrapper hasTabBar>
        <OfflineBanner />

        <View className="pt-6 pb-4">
          <Text className="text-2xl font-heading-bold text-forest-700">{t.orders}</Text>
          <Text className="text-sm text-forest-400 mt-1">{ORDERS.length} total orders</Text>
        </View>

        {ORDERS.length === 0 ? (
          <EmptyState icon={<ClipboardList size={38} color="#7653B8" />} title="No orders yet" />
        ) : (
          <View className="gap-3">
            {ORDERS.map((order) => (
              <Card key={order.id} className="p-4">
                <View className="flex-row gap-3">
                  <Image source={{ uri: order.image }} className="w-16 h-16 rounded-md shrink-0" resizeMode="cover" />
                  <View className="flex-1 min-w-0">
                    <View className="flex-row items-start justify-between gap-2">
                      <Text className="flex-1 text-sm font-body-bold text-forest-700 leading-snug" numberOfLines={1}>
                        {order.product}
                      </Text>
                      <StatusBadge
                        label={order.status}
                        tone={order.status === 'New' ? 'accent' : order.status === 'Packed' ? 'warning' : 'success'}
                        className="shrink-0"
                      />
                    </View>
                    <Text className="text-xs text-forest-400 mt-1">Qty: {order.qty} · #{order.id}</Text>
                    <View className="flex-row items-center justify-between mt-2">
                      <Text className="text-lg font-heading-bold text-forest-600">₹{order.total}</Text>
                      <ChannelBadge channel={order.channel} />
                    </View>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScreenWrapper>
      <TabBar />
    </>
  );
}
