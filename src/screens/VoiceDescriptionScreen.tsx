import { useEffect, useRef, useState } from 'react';
import { Mic, Play, RotateCcw, Square, Volume2, X } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import { Text, View, Pressable } from 'react-native';
import { useApp } from '@/AppContext';
import { Button } from '@/components/Button';
import { ErrorState } from '@/components/ErrorState';
import { InfoCallout } from '@/components/InfoCallout';
import { PulseRing } from '@/components/PulseRing';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { Waveform } from '@/components/Waveform';
import { playRecording, recordAudio, transcribeAudio, type VoiceRecording } from '@/services/voiceService';

type VoiceStatus = 'idle' | 'recording' | 'processing' | 'transcribed' | 'error';

const formatTime = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

export function VoiceDescriptionScreen() {
  const { language, navigate, setDraft, t } = useApp();
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [seconds, setSeconds] = useState(0);
  const [recording, setRecording] = useState<VoiceRecording | null>(null);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (status === 'recording') timer.current = setInterval(() => setSeconds((value) => value + 1), 1000);
    else if (timer.current) clearInterval(timer.current);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [status]);

  useEffect(() => () => { void Speech.stop(); }, []);

  const startRecording = async () => {
    setError(null);
    setTranscript('');
    setSeconds(0);
    try {
      const newRecording = await recordAudio(language);
      setRecording(newRecording);
      setStatus('recording');
    } catch (reason) {
      setStatus('error');
      setError(reason instanceof Error ? reason.message : 'Recording could not start.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    setStatus('processing');
    try {
      const result = await transcribeAudio(recording, seconds);
      setTranscript(result.text);
      setDraft({ voiceAudioUri: recording.audioUri, voiceTranscript: result.text, description: result.text });
      setStatus('transcribed');
    } catch (reason) {
      setStatus('error');
      setError(reason instanceof Error ? reason.message : 'Transcription could not be completed.');
    }
  };

  const retry = () => { setRecording(null); setTranscript(''); setSeconds(0); setError(null); setStatus('idle'); };
  const readAloud = () => { if (transcript) Speech.speak(transcript); };
  const tryPlayRecording = async () => {
    if (!recording) return;
    const played = await playRecording(recording);
    if (!played) setError('Playback will be available when a native audio recorder is connected.');
  };

  if (status === 'error') {
    return (
      <ScreenWrapper>
        <ScreenHeader title="Tell us about your product" backTo="enhance" />
        <ErrorState title="Voice description needs another try" description={error ?? undefined} />
        <View className="gap-3">
          <Button onPress={retry}><View className="flex-row items-center gap-2"><RotateCcw size={20} color="#FFFDF8" /><Text className="text-cream-50 font-bold text-lg">Retry</Text></View></Button>
          <Button variant="ghost" onPress={() => navigate('enhance')}>{t.cancel}</Button>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScreenHeader title="Tell us about your product" backTo="enhance" />
      <View className="flex-1 items-center py-5">
        <View className="w-20 h-20 rounded-[28px] bg-lavender-100 items-center justify-center mb-5"><Mic size={38} color="#60419B" /></View>
        <Text className="text-2xl font-extrabold text-forest-700 text-center">Tell us about your product</Text>
        <Text className="text-sm text-forest-500 leading-relaxed text-center mt-3 px-4">You can speak naturally in your language. Describe what it is, what it is made of, and how long it takes to make.</Text>

        {status === 'processing' ? (
          <View className="w-full mt-10"><Waveform active /><Text className="text-center text-lg font-extrabold text-forest-700 mt-5">Creating your description…</Text><Text className="text-center text-sm text-forest-400 mt-2">Processing your voice note</Text></View>
        ) : status === 'transcribed' ? (
          <View className="w-full mt-8">
            <View className="bg-mist-50 border border-mist-200 rounded-3xl p-5">
              <Text className="text-xs font-extrabold uppercase tracking-wide text-mist-500">Demo transcription</Text>
              <Text className="text-base leading-relaxed text-forest-700 mt-3">{transcript}</Text>
              <Text className="text-xs leading-relaxed text-forest-400 mt-3">Demo fallback only — connect a speech-to-text provider to transcribe recorded audio.</Text>
              <View className="flex-row gap-2 mt-4">
                <Pressable onPress={() => void tryPlayRecording()} className="flex-1 min-h-12 rounded-2xl bg-cream-50 border border-cream-200 flex-row items-center justify-center gap-2"><Play size={18} color="#1B5938" /><Text className="font-bold text-forest-600">Play recording</Text></Pressable>
                <Pressable onPress={readAloud} className="flex-1 min-h-12 rounded-2xl bg-forest-500 flex-row items-center justify-center gap-2"><Volume2 size={18} color="#FFFDF8" /><Text className="font-bold text-cream-50">Read aloud</Text></Pressable>
              </View>
            </View>
          </View>
        ) : (
          <View className="items-center mt-8 w-full">
            <Text className="text-4xl font-extrabold tracking-wider text-forest-700">{formatTime(seconds)}</Text>
            <View className="mt-6 w-full"><Waveform active={status === 'recording'} /></View>
            <View className="relative mt-5 w-32 h-32 items-center justify-center">
              {status === 'recording' && <><PulseRing color="#236B45" size={128} /><PulseRing color="#236B45" size={128} delay={450} /></>}
              <Pressable onPress={() => void (status === 'recording' ? stopRecording() : startRecording())} className={`w-28 h-28 rounded-full items-center justify-center shadow-xl active:scale-95 ${status === 'recording' ? 'bg-terracotta-500 shadow-terracotta-500/30' : 'bg-forest-500 shadow-forest-500/30'}`}>
                {status === 'recording' ? <Square size={38} color="#FFFDF8" fill="#FFFDF8" /> : <Mic size={47} color="#FFFDF8" />}
              </Pressable>
            </View>
            <Text className="text-sm font-semibold text-forest-400 mt-4">{status === 'recording' ? 'Tap to stop recording' : 'Tap to start recording'}</Text>
          </View>
        )}

        <View className="w-full mt-auto pt-8">
          {status !== 'transcribed' && <InfoCallout title="Your language">KarigarSetu will use your selected language for the recording service.</InfoCallout>}
          <View className="gap-3 mt-5">
            {status === 'transcribed' && <Button size="xl" onPress={() => navigate('listing')}>{t.continue}</Button>}
            {status === 'transcribed' && <Button variant="outline" onPress={retry}>Record Again</Button>}
            {status !== 'processing' && <Button variant="ghost" onPress={() => navigate('enhance')}><View className="flex-row items-center gap-2"><X size={19} color="#1B5938" /><Text className="text-forest-600 font-bold text-lg">{t.cancel}</Text></View></Button>}
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}
