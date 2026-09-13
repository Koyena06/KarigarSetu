import { useState } from 'react';
import { BadgeIndianRupee, TrendingUp, Wrench, Package } from 'lucide-react-native';
import { useApp } from '@/AppContext';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Button } from '@/components/Button';
import { MOCK_PRICE_BREAKDOWN } from '@/mockData';
import { View, Text, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';
import { InfoCallout } from '@/components/InfoCallout';

export function PriceSuggestionScreen() {
  const { t, navigate, setDraft } = useApp();
  const [suggestedPrice] = useState(
    MOCK_PRICE_BREAKDOWN.material + MOCK_PRICE_BREAKDOWN.labour + MOCK_PRICE_BREAKDOWN.margin
  );
  const [customPrice, setCustomPrice] = useState(suggestedPrice);
  const [editing, setEditing] = useState(false);

  const handleKeepPrice = () => {
    setDraft({ price: suggestedPrice, costBreakdown: MOCK_PRICE_BREAKDOWN });
    navigate('channels');
  };

  const handleSaveCustom = () => {
    setDraft({ price: customPrice, costBreakdown: MOCK_PRICE_BREAKDOWN });
    setEditing(false);
    navigate('channels');
  };

  const breakdownItems = [
    { label: t.material, value: MOCK_PRICE_BREAKDOWN.material, icon: Package },
    { label: t.labour, value: MOCK_PRICE_BREAKDOWN.labour, icon: Wrench },
    { label: t.margin, value: MOCK_PRICE_BREAKDOWN.margin, icon: TrendingUp },
  ];

  return (
    <ScreenWrapper>
      <ScreenHeader title="Price Suggestion" backTo="listing" />

      {!editing ? (
        <>
          <View className="bg-cream-50 rounded-3xl p-8 border border-cream-200 items-center mb-5">
            <View className="flex-row items-center gap-1.5 bg-forest-100 px-3 py-1.5 rounded-full mb-4">
              <TrendingUp size={14} color="#1B5938" />
              <Text className="text-forest-600 text-xs font-bold">{t.recommended}</Text>
            </View>
            <View className="flex-row items-center justify-center gap-1">
              <BadgeIndianRupee size={40} color="#236B45" strokeWidth={2.5} />
              <Text className="text-6xl font-extrabold text-forest-600">{suggestedPrice}</Text>
            </View>
            <Text className="text-sm text-forest-400 mt-2">Selling price per unit</Text>
          </View>

          <View className="bg-cream-50 rounded-3xl p-5 border border-cream-200 mb-6">
            <Text className="text-sm font-bold text-forest-400 mb-4">Cost Breakdown</Text>
            <View className="gap-3">
              {breakdownItems.map((item) => {
                const Icon = item.icon;
                return (
                  <View key={item.label} className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-xl bg-cream-100 items-center justify-center">
                      <Icon size={20} color="#236B45" />
                    </View>
                    <Text className="flex-1 text-base font-medium text-forest-600">{item.label}</Text>
                    <Text className="text-lg font-bold text-forest-700">₹{item.value}</Text>
                  </View>
                );
              })}
              <View className="pt-3 border-t border-cream-200 flex-row items-center justify-between">
                <Text className="text-base font-bold text-forest-600">Total</Text>
                <Text className="text-xl font-extrabold text-forest-700">₹{suggestedPrice}</Text>
              </View>
            </View>
          </View>

          <View className="mb-6">
            <InfoCallout title="Why this price?">
              Based on current market trends for similar handmade products and your material + labour costs.
            </InfoCallout>
          </View>

          <View className="gap-3">
            <Button size="lg" variant="outline" onPress={() => setEditing(true)}>
              {t.changePrice}
            </Button>
            <Button size="xl" variant="primary" onPress={handleKeepPrice}>
              {t.keepThisPrice}
            </Button>
          </View>
        </>
      ) : (
        <>
          <View className="bg-cream-50 rounded-3xl p-6 border border-cream-200 items-center mb-5">
            <Text className="text-sm font-medium text-forest-400 mb-4">Set your price</Text>
            <View className="flex-row items-center justify-center gap-1 mb-6">
              <BadgeIndianRupee size={32} color="#236B45" strokeWidth={2.5} />
              <TextInput
                value={String(customPrice)}
                onChangeText={(v) => setCustomPrice(Math.max(0, parseInt(v, 10) || 0))}
                keyboardType="number-pad"
                className="text-5xl font-extrabold text-forest-600 w-40 text-center border-b-2 border-forest-500"
              />
            </View>

            <Slider
              minimumValue={100}
              maximumValue={5000}
              step={50}
              value={customPrice}
              onValueChange={setCustomPrice}
              minimumTrackTintColor="#236B45"
              maximumTrackTintColor="#E8DCC8"
              thumbTintColor="#236B45"
            />
            <View className="flex-row justify-between mt-2 w-full">
              <Text className="text-xs text-forest-400">₹100</Text>
              <Text className="text-xs text-forest-400">₹5000</Text>
            </View>
          </View>

          <View className="gap-3">
            <Button size="xl" variant="primary" onPress={handleSaveCustom}>
              Save Price — ₹{customPrice}
            </Button>
            <Button size="lg" variant="ghost" onPress={() => setEditing(false)}>
              Back to suggestion
            </Button>
          </View>
        </>
      )}
    </ScreenWrapper>
  );
}
