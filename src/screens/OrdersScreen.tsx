import { Image, View } from 'react-native';
import { ClipboardList } from 'lucide-react-native';
import { NEXT_ORDER_STATUS, useApp } from '@/store/AppContext';
import type { StringKey } from '@/i18n/strings';
import type { OrderStatus } from '@/types';
import { Button } from '@/components/Button';
import { GuideCard } from '@/components/GuideCard';
import { Header } from '@/components/Header';
import { Screen } from '@/components/Screen';
import { Txt } from '@/components/Txt';
import { images } from '@/theme/images';
import { Badge, CHANNEL_TONE, Card, EmptyState, ORDER_TONE, formatINR } from '@/components/ui';

const STATUS_LABEL: Record<OrderStatus, StringKey> = {
  new: 'orderNew',
  accepted: 'orderAccepted',
  packed: 'orderPacked',
  shipped: 'orderShipped',
  delivered: 'orderDelivered',
};

const NEXT_ACTION: Record<OrderStatus, StringKey | null> = {
  new: 'acceptOrder',
  accepted: 'markPacked',
  packed: 'markShipped',
  shipped: 'markDelivered',
  delivered: null,
};

const timeAgo = (ts: number) => {
  const minutes = Math.round((Date.now() - ts) / 60000);
  if (minutes < 60) return `${Math.max(1, minutes)}m`;
  const hours = Math.round(minutes / 60);
  return hours < 24 ? `${hours}h` : `${Math.round(hours / 24)}d`;
};

export function OrdersScreen() {
  const { t, orders, advanceOrder } = useApp();
  const sorted = [...orders].sort((a, b) => Number(a.status === 'delivered') - Number(b.status === 'delivered') || b.createdAt - a.createdAt);

  return (
    <Screen withTabBar header={<Header large title={t.orders} />}>
      <GuideCard guide="orders" />

      {sorted.length === 0 ? (
        <EmptyState icon={ClipboardList} image={images.emptyOrders} title={t.noOrders} body={t.noOrdersHint} />
      ) : (
        <View className="gap-3 mt-4">
          {sorted.map((order) => {
            const action = NEXT_ACTION[order.status];
            return (
              <Card key={order.id} className="p-4">
                <View className="flex-row gap-3.5">
                  <Image source={{ uri: order.image }} className="w-16 h-16 rounded-xl bg-paper-200" />
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between gap-2">
                      <Txt variant="caption" latin>
                        #{order.id} · {timeAgo(order.createdAt)}
                      </Txt>
                      <Badge label={t[STATUS_LABEL[order.status]]} tone={ORDER_TONE[order.status]} />
                    </View>
                    <Txt variant="body" weight="semibold" latin className="text-ink-900 mt-1" numberOfLines={1}>
                      {order.productTitle}
                    </Txt>
                    <Txt variant="bodySm" latin className="mt-0.5">
                      {order.buyer} · {order.city}
                    </Txt>
                  </View>
                </View>
                <View className="flex-row items-center justify-between mt-4 pt-3 border-t border-paper-200">
                  <View className="flex-row items-center gap-2">
                    <Txt variant="heading" latin className="text-gold-600">
                      {formatINR(order.total)}
                    </Txt>
                    <Txt variant="caption">
                      {t.qty} {order.qty}
                    </Txt>
                    <Badge label={order.channel} tone={CHANNEL_TONE[order.channel]} latin />
                  </View>
                  {action && NEXT_ORDER_STATUS[order.status] && (
                    <Button label={t[action]} size="sm" onPress={() => advanceOrder(order.id)} />
                  )}
                </View>
              </Card>
            );
          })}
        </View>
      )}
    </Screen>
  );
}
