import { useState } from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';
import { Camera as CameraIcon, Image as ImageIcon, RefreshCw, SwitchCamera, X, Zap } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useApp } from '@/AppContext';
import { Button } from '@/components/Button';
import { ErrorState } from '@/components/ErrorState';
import { IconButton } from '@/components/IconButton';
import { LoadingState } from '@/components/LoadingState';

type CaptureSource = 'camera' | 'gallery';

export function CameraCaptureScreen() {
  const { draft, navigate, setDraft } = useApp();
  const [previewUri, setPreviewUri] = useState<string | null>(draft.photo);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [frontCamera, setFrontCamera] = useState(false);

  const savePhoto = (uri: string) => {
    setPreviewUri(uri);
    setDraft({ photo: uri });
    setError(null);
  };

  const openPicker = async (source: CaptureSource) => {
    setBusy(true);
    setError(null);
    try {
      const permission = source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        setError(
          source === 'camera'
            ? 'Camera permission is needed to photograph your product. You can enable it in your device settings.'
            : 'Photo library permission is needed to choose a product image. You can enable it in your device settings.'
        );
        return;
      }

      const result = source === 'camera'
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            quality: 0.85,
            cameraType: frontCamera ? ImagePicker.CameraType.front : ImagePicker.CameraType.back,
          })
        : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.85 });

      if (!result.canceled && result.assets[0]?.uri) savePhoto(result.assets[0].uri);
    } catch {
      setError('We could not open the camera or photo library. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleRetake = () => {
    setPreviewUri(null);
    setDraft({ photo: null });
    void openPicker('camera');
  };

  if (error) {
    return (
      <View className="flex-1 bg-cream-100 px-5 pt-14">
        <IconButton label="Close camera" onPress={() => navigate('home')}><X size={22} color="#1B5938" /></IconButton>
        <ErrorState title="Photo access needs attention" description={error} />
        <View className="gap-3">
          <Button onPress={() => void openPicker('camera')}>Try Camera Again</Button>
          <Button variant="outline" onPress={() => void openPicker('gallery')}>Choose from Gallery</Button>
          <Button variant="ghost" onPress={() => setError(null)}>Back to Photo Screen</Button>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#101512]">
      <View className="absolute top-0 left-0 right-0 bottom-0 bg-[#101512]" />
      {previewUri ? (
        <Image source={{ uri: previewUri }} className="absolute top-0 left-0 right-0 bottom-0" resizeMode="cover" />
      ) : (
        <View className="absolute top-0 left-0 right-0 bottom-0 items-center justify-center px-10">
          <View className="w-24 h-24 rounded-[30px] bg-cream-50/10 border border-cream-50/15 items-center justify-center">
            <CameraIcon size={42} color="#FFFDF8" strokeWidth={1.8} />
          </View>
          <Text className="text-cream-50 text-xl font-extrabold text-center mt-6">Frame your product clearly</Text>
          <Text className="text-cream-200 text-sm text-center leading-relaxed mt-2">Your device camera will open to capture a real product photo.</Text>
        </View>
      )}
      <View className="absolute top-0 left-0 right-0 h-32 bg-black/35" />
      <View className="absolute top-0 left-0 right-0 flex-row items-center justify-between px-5 pt-14">
        <IconButton label="Close camera" onPress={() => navigate('home')} className="bg-black/35 border-cream-50/20">
          <X size={22} color="#FFFDF8" />
        </IconButton>
        <IconButton
          label="Flash controls are available in the device camera"
          onPress={() => Alert.alert('Flash control', 'Use your device camera controls to change the flash while taking a photo.')}
          className="bg-black/35 border-cream-50/20"
        >
          <Zap size={21} color="#FFFDF8" />
        </IconButton>
      </View>

      <View className="absolute left-5 right-5 bottom-8">
        {busy ? (
          <View className="bg-black/55 rounded-3xl"><LoadingState label="Opening camera…" /></View>
        ) : previewUri ? (
          <View className="gap-3">
            <Button size="xl" onPress={() => navigate('enhance')}>Use Photo</Button>
            <Button size="lg" variant="outline" onPress={handleRetake} className="border-cream-50 bg-black/40">
              <View className="flex-row items-center gap-2"><RefreshCw size={20} color="#FFFDF8" /><Text className="text-cream-50 text-lg font-bold">Retake</Text></View>
            </Button>
          </View>
        ) : (
          <View className="flex-row items-end justify-between">
            <Pressable onPress={() => void openPicker('gallery')} className="w-16 h-16 rounded-2xl bg-cream-50/15 border border-cream-50/20 items-center justify-center active:scale-95">
              <ImageIcon size={26} color="#FFFDF8" />
              <Text className="text-cream-50 text-[10px] font-bold mt-1">Gallery</Text>
            </Pressable>
            <Pressable accessibilityLabel="Take product photo" onPress={() => void openPicker('camera')} className="w-24 h-24 rounded-full bg-cream-50 border-[7px] border-cream-50/35 items-center justify-center active:scale-95">
              <View className="w-16 h-16 rounded-full bg-terracotta-500 items-center justify-center"><CameraIcon size={30} color="#FFFDF8" /></View>
            </Pressable>
            <Pressable onPress={() => setFrontCamera((current) => !current)} className="w-16 h-16 rounded-2xl bg-cream-50/15 border border-cream-50/20 items-center justify-center active:scale-95">
              <SwitchCamera size={26} color="#FFFDF8" />
              <Text className="text-cream-50 text-[10px] font-bold mt-1">Switch</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}
