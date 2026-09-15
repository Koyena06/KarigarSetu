import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { twMerge } from 'tailwind-merge';
import { useApp } from '@/store/AppContext';
import { Button } from '@/components/Button';
import { FlowProgress } from '@/components/FlowProgress';
import { GuideCard } from '@/components/GuideCard';
import { Header } from '@/components/Header';
import { Screen } from '@/components/Screen';
import { Txt } from '@/components/Txt';
import { Field, formatINR } from '@/components/ui';
import { HeroBand } from '@/components/HeroBand';

const PROFIT_OPTIONS = [20, 30, 40];
const toNumber = (value: string) => Math.max(0, Number(value.replace(/[^0-9.]/g, '')) || 0);
const digits = (value: string) => value.replace(/[^0-9]/g, '');

export function PriceScreen() {
  const { t, draft, setDraft, navigate } = useApp();
  const [material, setMaterial] = useState(draft.costBreakdown.material ? String(draft.costBreakdown.material) : '');
  const [hours, setHours] = useState('');
  const [rate, setRate] = useState('80');
  const [profitPct, setProfitPct] = useState(30);
  const [customPrice, setCustomPrice] = useState(draft.price ? String(draft.price) : '');
  const [stock, setStock] = useState(String(draft.stock || 1));

  const breakdown = useMemo(() => {
    const materialCost = toNumber(material);
    const labour = toNumber(hours) * toNumber(rate);
    const cost = materialCost + labour;
    const margin = cost * (profitPct / 100);
    const suggested = Math.round((cost + margin) / 10) * 10;
    return { material: materialCost, labour, margin: Math.round(margin), suggested };
  }, [material, hours, rate, profitPct]);

  const hasCost = breakdown.suggested > 0;
  const finalPrice = customPrice ? toNumber(customPrice) : breakdown.suggested || draft.aiPrice || 0;
  const total = breakdown.material + breakdown.labour + breakdown.margin || 1;

  const next = () => {
    setDraft({
      price: finalPrice,
      stock: Math.max(1, Math.round(toNumber(stock))),
      costBreakdown: { material: breakdown.material, labour: breakdown.labour, margin: breakdown.margin },
    });
    navigate('channels');
  };

  return (
    <Screen
      header={
        <>
          <Header title={t.addProduct} />
          <FlowProgress step={3} />
        </>
      }
      footer={<Button label={`${t.continue} · ${formatINR(finalPrice)}`} disabled={finalPrice <= 0} onPress={next} />}
    >
      <Txt variant="title" className="mt-1">
        {t.priceTitle}
      </Txt>

      <View className="gap-3 mt-5">
        <Field label={t.materialCost} prefix="₹" keyboardType="number-pad" value={material} onChangeText={(v) => setMaterial(digits(v))} placeholder="0" latin />
        <View className="flex-row gap-3">
          <Field className="flex-1" label={t.hoursWorked} keyboardType="decimal-pad" value={hours} onChangeText={setHours} placeholder="0" latin />
          <Field className="flex-1" label={t.hourlyRate} prefix="₹" keyboardType="number-pad" value={rate} onChangeText={(v) => setRate(digits(v))} latin />
        </View>
        <View>
          <Txt variant="caption" weight="semibold" className="mb-1.5 px-1 text-ink-600">
            {t.profit}
          </Txt>
          <View className="flex-row gap-2">
            {PROFIT_OPTIONS.map((pct) => (
              <Pressable
                key={pct}
                onPress={() => setProfitPct(pct)}
                className={twMerge('flex-1 h-12 rounded-[12px] items-center justify-center border', pct === profitPct ? 'bg-gold-400 border-gold-400' : 'bg-white border-paper-300')}
              >
                <Txt variant="body" latin weight="semibold" className={pct === profitPct ? 'text-leaf-900' : 'text-ink-700'}>
                  {pct}%
                </Txt>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      <HeroBand rounded={false} style={{ marginTop: 20, borderRadius: 22 }}>
        <View className="p-5">
        <Txt variant="overline" className="text-gold-200">{t.suggestedPrice}</Txt>
        <View className="flex-row items-baseline gap-2 mt-2">
          <Txt variant="display" latin className="text-[46px] leading-[54px] text-gold-300">
            {formatINR(hasCost ? breakdown.suggested : draft.aiPrice ?? 0)}
          </Txt>
          <Txt variant="bodySm" className="text-leaf-100">{t.perPiece}</Txt>
        </View>

        {hasCost && (
          <>
            <View className="flex-row h-2 rounded-full overflow-hidden mt-4 bg-white/15">
              <View className="bg-gold-400" style={{ flex: breakdown.material / total }} />
              <View className="bg-leaf-300" style={{ flex: breakdown.labour / total }} />
              <View className="bg-clay-500" style={{ flex: breakdown.margin / total }} />
            </View>
            <View className="mt-3 gap-1.5">
              {[
                { label: t.material, value: breakdown.material, dot: 'bg-gold-400' },
                { label: t.labour, value: breakdown.labour, dot: 'bg-leaf-300' },
                { label: t.margin, value: breakdown.margin, dot: 'bg-clay-500' },
              ].map((row) => (
                <View key={row.label} className="flex-row items-center gap-2">
                  <View className={twMerge('w-2 h-2 rounded-full', row.dot)} />
                  <Txt variant="bodySm" className="flex-1 text-leaf-100">
                    {row.label}
                  </Txt>
                  <Txt variant="bodySm" latin weight="semibold" className="text-white">
                    {formatINR(row.value)}
                  </Txt>
                </View>
              ))}
            </View>
          </>
        )}

        {draft.aiPrice ? (
          <View className="mt-4 pt-4 border-t border-white/15">
            <Txt variant="caption" weight="semibold" className="text-gold-300">
              {t.marketNote} · {formatINR(draft.aiPrice)}
            </Txt>
            {draft.aiPriceReason ? (
              <Txt variant="bodySm" className="mt-1 text-leaf-100">
                {draft.aiPriceReason}
              </Txt>
            ) : null}
          </View>
        ) : null}
        </View>
      </HeroBand>

      <View className="flex-row gap-3 mt-5">
        <Field
          className="flex-[1.4]"
          label={t.yourPrice}
          prefix="₹"
          keyboardType="number-pad"
          value={customPrice}
          placeholder={String(breakdown.suggested || draft.aiPrice || '')}
          onChangeText={(v) => setCustomPrice(digits(v))}
          latin
        />
        <Field className="flex-1" label={t.stockLabel} keyboardType="number-pad" value={stock} onChangeText={(v) => setStock(digits(v))} latin />
      </View>

      <GuideCard guide="price" className="mt-5" />
    </Screen>
  );
}
