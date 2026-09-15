import '../global.css';
import { useFonts } from 'expo-font';
import { Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { NotoSans_400Regular, NotoSans_500Medium, NotoSans_600SemiBold, NotoSans_700Bold } from '@expo-google-fonts/noto-sans';
import {
  NotoSansDevanagari_400Regular,
  NotoSansDevanagari_500Medium,
  NotoSansDevanagari_600SemiBold,
  NotoSansDevanagari_700Bold,
} from '@expo-google-fonts/noto-sans-devanagari';
import {
  NotoSansOriya_400Regular,
  NotoSansOriya_500Medium,
  NotoSansOriya_600SemiBold,
  NotoSansOriya_700Bold,
} from '@expo-google-fonts/noto-sans-oriya';
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
import { View, Pressable } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

function ScreenRouter() {
  const { screen, offline, setOffline } = useApp();
  const insets = useSafeAreaInsets();

  const screens: Record<ScreenName, React.ReactNode> = {
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
          className="absolute right-3 z-50 w-10 h-10 rounded-md bg-cream-50/95 border border-cream-200 items-center justify-center active:bg-cream-100"
          style={{ top: insets.top + 8 }}
        >
          {offline ? <WifiOff size={17} color="#B95F1E" /> : <Wifi size={17} color="#4C9A61" />}
        </Pressable>
      )}
      <StatusBar style={screen === 'camera' ? 'light' : 'dark'} />
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_700Bold,
    NotoSans_400Regular,
    NotoSans_500Medium,
    NotoSans_600SemiBold,
    NotoSans_700Bold,
    NotoSansDevanagari_400Regular,
    NotoSansDevanagari_500Medium,
    NotoSansDevanagari_600SemiBold,
    NotoSansDevanagari_700Bold,
    NotoSansOriya_400Regular,
    NotoSansOriya_500Medium,
    NotoSansOriya_600SemiBold,
    NotoSansOriya_700Bold,
  });

  if (!fontsLoaded) {
    return <View className="flex-1 bg-forest-700" />;
  }

  return (
    <SafeAreaProvider>
      <AppProvider>
        <ScreenRouter />
      </AppProvider>
    </SafeAreaProvider>
  );
}
