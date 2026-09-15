import { useState } from 'react';
import { ActivityIndicator, Image, Linking, Pressable, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, ImagePlus, RotateCcw, X } from 'lucide-react-native';
import { useApp } from '@/store/AppContext';
import { preparePhoto } from '@/services/image';
import { Button } from '@/components/Button';
import { FlowProgress } from '@/components/FlowProgress';
import { GuideCard } from '@/components/GuideCard';
import { Header } from '@/components/Header';
import { Screen } from '@/components/Screen';
import { Txt } from '@/components/Txt';
import { colors } from '@/theme/colors';
import { images } from '@/theme/images';

export function CameraScreen() {
  const { t, draft, setDraft, navigate } = useApp();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pick = async (source: 'camera' | 'gallery') => {
    setError(null);
    const permission =
      source === 'camera' ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError(source === 'camera' ? t.cameraPermission : t.galleryPermission);
      return;
    }

    const options: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 0.9, allowsEditing: true, aspect: [1, 1] };
    const result = source === 'camera' ? await ImagePicker.launchCameraAsync(options) : await ImagePicker.launchImageLibraryAsync(options);
    const asset = result.canceled ? null : result.assets[0];
    if (!asset) return;

    setBusy(true);
    try {
      const uri = await preparePhoto(asset.uri);
      setDraft({ originalPhoto: uri, photo: uri, enhancedWith: null });
    } catch {
      // Fall back to the picker's file if normalising fails; it still works for this session.
      setDraft({ originalPhoto: asset.uri, photo: asset.uri, enhancedWith: null });
    } finally {
      setBusy(false);
    }
  };

  const photo = draft.originalPhoto;

  return (
    <Screen
      header={
        <>
          <Header
            title={t.addProduct}
            right={
              <Pressable accessibilityLabel={t.cancel} onPress={() => navigate('home')} hitSlop={8} className="w-11 h-11 rounded-full items-center justify-center active:bg-paper-200">
                <X size={22} color={colors.ink900} />
              </Pressable>
            }
            showBack={false}
          />
          <FlowProgress step={0} />
        </>
      }
      footer={
        photo ? (
          <View className="flex-row gap-3">
            <Button label={t.retake} variant="secondary" icon={RotateCcw} className="flex-1" onPress={() => void pick('camera')} />
            <Button label={t.usePhoto} className="flex-[1.6]" onPress={() => navigate('enhance')} />
          </View>
        ) : (
          <View className="flex-row gap-3">
            <Button label={t.gallery} variant="secondary" icon={ImagePlus} className="flex-1" onPress={() => void pick('gallery')} />
            <Button label={t.takePhoto} icon={Camera} className="flex-[1.6]" onPress={() => void pick('camera')} />
          </View>
        )
      }
    >
      <Txt variant="title" className="mt-1">
        {t.photoTitle}
      </Txt>
      <Txt variant="bodySm" className="mt-1.5">
        {t.photoHint}
      </Txt>

      <Pressable
        disabled={busy}
        onPress={() => void pick('camera')}
        className={`mt-5 w-full aspect-square rounded-[20px] overflow-hidden items-center justify-center ${photo ? 'bg-paper-200' : 'border border-gold-200'}`}
      >
        {busy ? (
          <ActivityIndicator color={colors.leaf500} size="large" />
        ) : photo ? (
          <Image source={{ uri: photo }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <View className="w-full h-full">
            <Image source={images.cameraTip} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            <View className="absolute bottom-4 self-center flex-row items-center gap-2 rounded-full bg-leaf-500 px-4 py-2.5">
              <Camera size={18} color={colors.gold300} strokeWidth={2} />
              <Txt variant="bodySm" weight="semibold" className="text-white">
                {t.takePhoto}
              </Txt>
            </View>
          </View>
        )}
      </Pressable>

      {error && (
        <Pressable onPress={() => void Linking.openSettings()} className="mt-4 rounded-2xl bg-clay-50 px-4 py-3">
          <Txt variant="bodySm" className="text-clay-600">
            {error}
          </Txt>
        </Pressable>
      )}

      <GuideCard guide="camera" className="mt-5" />
    </Screen>
  );
}
