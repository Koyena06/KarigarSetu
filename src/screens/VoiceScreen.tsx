import { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, View } from 'react-native';
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { Mic, Pause, Play, Square } from 'lucide-react-native';
import { twMerge } from 'tailwind-merge';
import { useApp } from '@/store/AppContext';
import { services } from '@/config';
import { transcribe } from '@/services/transcription';
import { stopSpeaking } from '@/services/speech';
import { Button } from '@/components/Button';
import { FlowProgress } from '@/components/FlowProgress';
import { GuideCard } from '@/components/GuideCard';
import { Header } from '@/components/Header';
import { Screen } from '@/components/Screen';
import { Txt } from '@/components/Txt';
import { Field } from '@/components/ui';
import { colors } from '@/theme/colors';

type Status = 'idle' | 'recording' | 'transcribing';

const RECORDING_OPTIONS = { ...RecordingPresets.HIGH_QUALITY, isMeteringEnabled: true };

const formatTime = (ms: number) => {
  const seconds = Math.floor(ms / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
};

export function VoiceScreen() {
  const { t, language, draft, setDraft, navigate } = useApp();
  const recorder = useAudioRecorder(RECORDING_OPTIONS);
  const recorderState = useAudioRecorderState(recorder, 120);
  const player = useAudioPlayer(draft.voiceAudioUri ? { uri: draft.voiceAudioUri } : null);
  const playerStatus = useAudioPlayerStatus(player);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      void setAudioModeAsync({ allowsRecording: false });
    };
  }, []);

  const start = async () => {
    setError(null);
    stopSpeaking();
    const permission = await requestRecordingPermissionsAsync();
    if (!permission.granted) {
      setError(t.micPermission);
      return;
    }
    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    await recorder.prepareToRecordAsync();
    recorder.record();
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStatus('recording');
  };

  const stop = async () => {
    await recorder.stop();
    await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const uri = recorder.uri;
    if (!uri) {
      setStatus('idle');
      return;
    }
    setDraft({ voiceAudioUri: uri });
    player.replace({ uri });

    if (!services.speechToText) {
      setStatus('idle');
      return;
    }
    setStatus('transcribing');
    try {
      const text = await transcribe(uri, language);
      if (text) setDraft({ transcript: draft.transcript ? `${draft.transcript} ${text}` : text });
    } catch {
      setError(t.retry);
    } finally {
      setStatus('idle');
    }
  };

  const togglePlayback = () => {
    if (playerStatus.playing) {
      player.pause();
    } else {
      if (playerStatus.duration > 0 && playerStatus.currentTime >= playerStatus.duration - 0.1) void player.seekTo(0);
      player.play();
    }
  };

  // Metering is in dBFS (-160 silent … 0 loud); map the useful range to a ring scale.
  const level = recorderState.metering != null ? Math.min(1, Math.max(0, (recorderState.metering + 50) / 50)) : 0;
  const recording = status === 'recording';
  const canContinue = draft.transcript.trim().length >= 3;

  return (
    <Screen
      header={
        <>
          <Header title={t.addProduct} />
          <FlowProgress step={1} />
        </>
      }
      footer={<Button label={t.continue} disabled={!canContinue || status !== 'idle'} onPress={() => navigate('listing')} />}
    >
      <Txt variant="title" className="mt-1">
        {t.voiceTitle}
      </Txt>
      <Txt variant="bodySm" className="mt-1.5">
        {t.voiceHint}
      </Txt>

      <View className="items-center py-8">
        <View className="w-44 h-44 items-center justify-center">
          <View
            className="absolute rounded-full bg-gold-200"
            style={{ width: 176, height: 176, opacity: recording ? 0.35 + level * 0.5 : 0, transform: [{ scale: 0.75 + level * 0.25 }] }}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={recording ? t.tapToStop : t.tapToSpeak}
            disabled={status === 'transcribing'}
            onPress={() => void (recording ? stop() : start())}
            className={twMerge('w-28 h-28 rounded-full items-center justify-center active:opacity-90', recording ? 'bg-clay-500' : 'bg-leaf-500')}
          >
            {status === 'transcribing' ? (
              <ActivityIndicator color={colors.white} size="large" />
            ) : recording ? (
              <Square size={34} color={colors.white} fill={colors.white} />
            ) : (
              <Mic size={42} color={colors.white} strokeWidth={1.8} />
            )}
          </Pressable>
        </View>
        <Txt variant="title" latin className="mt-3">
          {formatTime(recording ? recorderState.durationMillis : 0)}
        </Txt>
        <Txt variant="bodySm" weight="medium" className="mt-0.5">
          {status === 'transcribing' ? t.transcribing : recording ? t.tapToStop : t.tapToSpeak}
        </Txt>

        {draft.voiceAudioUri && !recording && status === 'idle' && (
          <Pressable onPress={togglePlayback} className="mt-4 h-10 px-4 rounded-full bg-white border border-paper-300 flex-row items-center gap-2 active:bg-paper-50">
            {playerStatus.playing ? <Pause size={16} color={colors.ink900} /> : <Play size={16} color={colors.ink900} />}
            <Txt variant="bodySm" weight="semibold" className="text-ink-900">
              {t.playRecording}
            </Txt>
          </Pressable>
        )}
      </View>

      {error && (
        <Pressable onPress={() => error === t.micPermission && void Linking.openSettings()} className="mb-4 rounded-2xl bg-clay-50 px-4 py-3">
          <Txt variant="bodySm" className="text-clay-600">
            {error}
          </Txt>
        </Pressable>
      )}

      <Field
        label={draft.transcript ? t.youSaid : t.typeInstead}
        placeholder={t.typePlaceholder}
        value={draft.transcript}
        onChangeText={(transcript) => setDraft({ transcript })}
        multiline
      />

      <GuideCard guide="voice" className="mt-5" />
    </Screen>
  );
}
