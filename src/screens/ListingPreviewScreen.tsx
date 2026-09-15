import { useState, useEffect } from 'react';
import { Volume2, ShoppingBag, Star, ThumbsUp, RotateCcw } from 'lucide-react-native';
import { useApp } from '@/AppContext';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Button } from '@/components/Button';
import { MOCK_LISTING } from '@/mockData';
import { twMerge } from 'tailwind-merge';
import { View, Text, Image, Pressable } from 'react-native';
import * as Speech from 'expo-speech';

export function ListingPreviewScreen() {
  const { t, navigate, draft, setDraft } = useApp();
  const [speaking, setSpeaking] = useState(false);

  const photo = draft.photo || 'https://images.pexels.com/photos/34144282/pexels-photo-34144282.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
  const title = MOCK_LISTING.title;
  const description = MOCK_LISTING.description;
  const price = 600;

  useEffect(() => {
    setDraft({ title, description, price });
  }, [setDraft, title, description, price]);

  const handleReadAloud = () => {
    if (speaking) {
      Speech.stop();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    Speech.speak(`${title}. ${description}`, {
      onDone: () => setSpeaking(false),
      onStopped: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
  };

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  return (
    <ScreenWrapper>
      <ScreenHeader title="Listing Preview" backTo="voice" />

      <Text className="text-sm font-body text-forest-400 mb-4 text-center px-4">
        Here's how buyers will see your product
      </Text>

      <View className="bg-cream-50 rounded-md overflow-hidden border border-cream-200">
        <View className="relative">
          <Image source={{ uri: photo }} className="w-full h-60" resizeMode="cover" />
          <View className="absolute top-3 right-3 bg-forest-500 px-3 py-1.5 rounded-md">
            <Text className="text-cream-50 text-xs font-body-bold">₹{price}</Text>
          </View>
        </View>

        <View className="p-5">
          <Text className="text-xl font-heading-bold text-forest-700 leading-snug">{title}</Text>

          <View className="flex-row items-center gap-1 mt-2 mb-3">
            <View className="flex-row">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={16} color="#A87D1E" fill="#A87D1E" />
              ))}
            </View>
            <Text className="text-xs font-body text-forest-400 ml-1">(New arrival)</Text>
          </View>

          <Text className="text-sm font-body text-forest-500 leading-relaxed">{description}</Text>

          <Pressable
            onPress={handleReadAloud}
            className={twMerge(
              'mt-4 flex-row items-center justify-center gap-2 py-3 rounded-md',
              speaking ? 'bg-forest-500' : 'bg-forest-50'
            )}
          >
            <Volume2 size={20} color={speaking ? '#FFFDF8' : '#1B5938'} strokeWidth={2.4} />
            <Text className={twMerge('font-body-bold', speaking ? 'text-cream-50' : 'text-forest-600')}>
              {speaking ? 'Reading...' : t.readAloud}
            </Text>
          </Pressable>

          <View className="mt-4 flex-row items-center justify-center gap-2 py-3 rounded-md bg-terracotta-500/10">
            <ShoppingBag size={20} color="#B95F1E" strokeWidth={2.4} />
            <Text className="font-body-bold text-terracotta-600">Add to Cart</Text>
          </View>
        </View>
      </View>

      <View className="bg-cream-50 rounded-md p-5 border border-cream-200 border-l-[3px] border-l-gold-500 mt-4">
        <Text className="text-sm font-body-bold text-forest-700 mb-3">Key Features</Text>
        <View className="gap-2">
          {['Handmade by local artisans', 'Made from natural clay', 'Eco-friendly and durable'].map((f) => (
            <View key={f} className="flex-row items-center gap-2">
              <View className="w-1.5 h-1.5 rounded-full bg-gold-500" />
              <Text className="text-sm font-body text-forest-500 flex-1">{f}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="mt-6 gap-3">
        <Button size="xl" variant="primary" onPress={() => navigate('price')}>
          <View className="flex-row items-center gap-2.5">
            <ThumbsUp size={20} color="#FFFDF8" strokeWidth={2.6} />
            <Text className="font-body-bold text-xl text-cream-50">{t.soundsGood}</Text>
          </View>
        </Button>
        <Button size="lg" variant="outline" onPress={() => navigate('voice')}>
          <View className="flex-row items-center gap-2.5">
            <RotateCcw size={18} color="#1B5938" strokeWidth={2.6} />
            <Text className="font-body-bold text-lg text-forest-600">{t.sayAgain}</Text>
          </View>
        </Button>
      </View>
    </ScreenWrapper>
  );
}
