import type { Language } from '@/types';

export interface VoiceRecording {
  id: string;
  language: Language;
  startedAt: number;
  audioUri: string | null;
  source: 'demo-fallback';
}

export interface TranscriptionResult {
  text: string;
  language: Language;
  source: 'demo-fallback';
}

/**
 * Boundary for a future native audio recorder. expo-audio is not installed in
 * this project yet, so the demo records timing and language only—never a fake
 * audio file—and declares that limitation to the caller.
 */
export async function recordAudio(language: Language): Promise<VoiceRecording> {
  return { id: `voice-${Date.now()}`, language, startedAt: Date.now(), audioUri: null, source: 'demo-fallback' };
}

/**
 * Boundary for a future multilingual speech-to-text provider. The fallback
 * varies its sample by spoken duration and selected language; it is explicitly
 * marked as demo output rather than an AI transcription.
 */
export async function transcribeAudio(recording: VoiceRecording, durationSeconds: number): Promise<TranscriptionResult> {
  if (durationSeconds < 1) throw new Error('Record a little longer before creating a description.');
  await new Promise<void>((resolve) => setTimeout(resolve, 900));

  const samples: Record<Language, string[]> = {
    english: ['A handmade terracotta planter with hand-painted patterns, made from natural clay over two days.', 'This is a woven cotton stole made by hand with soft natural-dyed thread.'],
    hindi: ['यह प्राकृतिक मिट्टी से बना हाथ से रंगा टेराकोटा गमला है, जिसे बनाने में दो दिन लगते हैं।', 'यह हाथ से बुना सूती दुपट्टा है, जिसमें प्राकृतिक रंगों का उपयोग हुआ है।'],
    odia: ['ଏହା ପ୍ରାକୃତିକ ମାଟିରେ ତିଆରି ହାତରେ ରଙ୍ଗ କରା ଟେରାକୋଟା ଗାମଲା, ତିଆରି କରିବାକୁ ଦୁଇ ଦିନ ଲାଗେ।', 'ଏହା ପ୍ରାକୃତିକ ରଙ୍ଗରେ ତିଆରି ହାତବୁଣା ସୂତା କପଡ଼ା।'],
    bengali: ['এটি প্রাকৃতিক মাটি দিয়ে তৈরি হাতে আঁকা টেরাকোটা টব, বানাতে দুই দিন লাগে।', 'এটি প্রাকৃতিক রঙের সুতো দিয়ে হাতে বোনা সুতির স্টোল।'],
    tamil: ['இது இயற்கை களிமண்ணால் செய்யப்பட்ட கையால் வரையப்பட்ட டெரகோட்டா தொட்டி; இதை உருவாக்க இரண்டு நாட்கள் ஆகும்.', 'இது இயற்கை சாயம் பூசப்பட்ட நூலால் கையால் நெய்யப்பட்ட பருத்தி ஸ்டோல்.'],
    telugu: ['ఇది సహజ మట్టితో తయారైన చేతితో రంగించిన టెర్రకోటా కుండ; దీనికి రెండు రోజులు పడుతుంది.', 'ఇది సహజ రంగుల దారంతో చేతితో నేసిన కాటన్ స్టోల్.'],
    marathi: ['हे नैसर्गिक मातीचे हाताने रंगवलेले टेराकोटा कुंडे आहे; ते बनवायला दोन दिवस लागतात.', 'हा नैसर्गिक रंगांच्या धाग्याने हाताने विणलेला सुती स्टोल आहे.'],
    gujarati: ['આ કુદરતી માટીથી બનેલો હાથથી રંગેલો ટેરાકોટા કૂંડો છે; તેને બનાવવામાં બે દિવસ લાગે છે.', 'આ કુદરતી રંગના દોરાથી હાથથી વણાયેલો કોટન સ્ટોલ છે.'],
  };

  return { text: samples[recording.language][durationSeconds % samples[recording.language].length], language: recording.language, source: 'demo-fallback' };
}

export async function playRecording(recording: VoiceRecording): Promise<boolean> {
  return Boolean(recording.audioUri);
}
