import '../global.css';

import { AppProvider, useApp } from '@/AppContext';

import { LanguageSelectScreen } from '@/screens/LanguageSelectScreen';
import { HomeDashboardScreen } from '@/screens/HomeDashboardScreen';
import { CameraCaptureScreen } from '@/screens/CameraCaptureScreen';
import { PhotoEnhancementScreen } from '@/screens/PhotoEnhancementScreen';
import { VoiceDescriptionScreen } from '@/screens/VoiceDescriptionScreen';
import { ListingPreviewScreen } from '@/screens/ListingPreviewScreen';
import { PriceSuggestionScreen } from '@/screens/PriceSuggestionScreen';
import { ChannelSelectScreen } from '@/screens/ChannelSelectScreen';
import { PublishSuccessScreen } from '@/screens/PublishSuccessScreen';
import { MyProductsScreen } from '@/screens/MyProductsScreen';
import { OrdersScreen } from '@/screens/OrdersScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';

import { WifiOff, Wifi } from 'lucide-react-native';
import type { ScreenName } from '@/types';
import type { ReactNode } from 'react';

import { View, Pressable } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { useFonts } from 'expo-font';

import {
  CormorantGaramond_500Medium,
  CormorantGaramond_600SemiBold,
  CormorantGaramond_700Bold,
} from '@expo-google-fonts/cormorant-garamond';

import {
  PlayfairDisplay_500Medium,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';

import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

function ScreenRouter() {
  const { screen, offline, setOffline } = useApp();
  const insets = useSafeAreaInsets();

  const screens: Record<ScreenName, ReactNode> = {
    language: <LanguageSelectScreen />,
    home: <HomeDashboardScreen />,
    camera: <CameraCaptureScreen />,
    enhance: <PhotoEnhancementScreen />,
    voice: <VoiceDescriptionScreen />,
    listing: <ListingPreviewScreen />,
    price: <PriceSuggestionScreen />,
    channels: <ChannelSelectScreen />,
    success: <PublishSuccessScreen />,
    products: <MyProductsScreen />,
    orders: <OrdersScreen />,
    settings: <SettingsScreen />,
  };

  return (
    <View className="flex-1 bg-cream-100">
      {screens[screen]}

      {screen !== 'language' && (
        <Pressable
          onPress={() => setOffline(!offline)}
          className="absolute right-3 z-50 w-10 h-10 rounded-2xl bg-cream-50/95 border border-cream-200 items-center justify-center shadow-sm active:scale-90"
          style={{
            top: insets.top + 8,
          }}
        >
          {offline ? (
            <WifiOff size={17} color="#B95F1E" />
          ) : (
            <Wifi size={17} color="#4C9A61" />
          )}
        </Pressable>
      )}

      <StatusBar
        style={screen === 'camera' ? 'light' : 'dark'}
      />
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    CormorantGaramond_500Medium,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_700Bold,

    PlayfairDisplay_500Medium,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,

    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AppProvider>
        <ScreenRouter />
      </AppProvider>
    </SafeAreaProvider>
  );
}