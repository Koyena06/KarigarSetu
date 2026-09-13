import type { Product, Language, Translations, Channel } from './types';

export const DUMMY_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Handpainted Terracotta Pot',
    description:
      'Beautifully handpainted terracotta pot with traditional tribal motifs. Perfect for home decor or gifting. Each piece is unique and crafted by skilled artisans of Odisha.',
    price: 600,
    stock: 12,
    image: 'https://images.pexels.com/photos/34144282/pexels-photo-34144282.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    channels: ['ONDC', 'GeM', 'B2B'],
    status: 'published',
    costBreakdown: { material: 200, labour: 250, margin: 150 },
  },
  {
    id: '2',
    title: 'Handwoven Cotton Saree',
    description:
      'Elegant handwoven cotton saree with natural dye patterns. Soft, breathable fabric ideal for everyday wear and festive occasions.',
    price: 1200,
    stock: 5,
    image: 'https://images.pexels.com/photos/31854096/pexels-photo-31854096.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    channels: ['ONDC', 'B2B'],
    status: 'published',
    costBreakdown: { material: 500, labour: 500, margin: 200 },
  },
  {
    id: '3',
    title: 'Silver Tribal Earrings',
    description:
      'Handcrafted silver tribal earrings with intricate filigree work. Lightweight and skin-friendly. A timeless statement piece.',
    price: 850,
    stock: 8,
    image: 'https://images.pexels.com/photos/9871565/pexels-photo-9871565.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    channels: ['GeM', 'B2B'],
    status: 'published',
    costBreakdown: { material: 400, labour: 300, margin: 150 },
  },
  {
    id: '4',
    title: 'Carved Wooden Wall Panel',
    description:
      'Intricately carved wooden wall panel featuring traditional floral patterns. Made from premium teak wood. A stunning addition to any living space.',
    price: 2200,
    stock: 3,
    image: 'https://images.pexels.com/photos/5505438/pexels-photo-5505438.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    channels: ['ONDC'],
    status: 'draft',
    costBreakdown: { material: 900, labour: 800, margin: 500 },
  },
  {
    id: '5',
    title: 'Leather Handmade Bag',
    description:
      'Premium handcrafted leather bag with brass buckles. Spacious, durable and stylish. Ethically sourced leather, vegetable tanned.',
    price: 1500,
    stock: 7,
    image: 'https://images.pexels.com/photos/27680730/pexels-photo-27680730.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    channels: ['ONDC', 'GeM', 'B2B'],
    status: 'published',
    costBreakdown: { material: 600, labour: 500, margin: 400 },
  },
];

export const ALL_CHANNELS: Channel[] = ['ONDC', 'GeM', 'B2B'];

export const CHANNEL_INFO: Record<
  Channel,
  { description: string; icon: 'shopping-bag' | 'building-2' | 'handshake' }
> = {
  ONDC: { description: 'Sell to millions of online buyers across India', icon: 'shopping-bag' },
  GeM: { description: 'Government e-Marketplace for bulk orders', icon: 'building-2' },
  B2B: { description: 'Connect with wholesalers and retailers directly', icon: 'handshake' },
};

export const LANGUAGES: { key: Language; label: string; nativeLabel: string; flag: string }[] = [
  { key: 'english', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { key: 'hindi', label: 'Hindi', nativeLabel: 'हिन्दी', flag: '🇮🇳' },
  { key: 'odia', label: 'Odia', nativeLabel: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { key: 'bengali', label: 'Bengali', nativeLabel: 'বাংলা', flag: '🇮🇳' },
  { key: 'tamil', label: 'Tamil', nativeLabel: 'தமிழ்', flag: '🇮🇳' },
  { key: 'telugu', label: 'Telugu', nativeLabel: 'తెలుగు', flag: '🇮🇳' },
  { key: 'marathi', label: 'Marathi', nativeLabel: 'मराठी', flag: '🇮🇳' },
  { key: 'gujarati', label: 'Gujarati', nativeLabel: 'ગુજરાતી', flag: '🇮🇳' },
];

const BASE_TRANSLATIONS: Record<'hindi' | 'odia' | 'english', Translations> = {
  hindi: {
    greeting: 'नमस्ते',
    addProduct: 'प्रोडक्ट जोड़ें',
    myProducts: 'मेरे प्रोडक्ट',
    orders: 'ऑर्डर',
    publishSell: 'प्रकाशित करें',
    home: 'होम',
    products: 'प्रोडक्ट',
    more: 'और',
    continue: 'आगे बढ़ें',
    cancel: 'रद्द करें',
    keepThisPrice: 'यह कीमत रखें',
    changePrice: 'कीमत बदलें',
    goLive: 'लाइव जाएं',
    viewMyProducts: 'मेरे प्रोडक्ट देखें',
    soundsGood: '👍 अच्छा लगा',
    sayAgain: '🔁 फिर से बोलें',
    readAloud: '🔊 सुनें',
    recommended: 'अनुशंसित',
    material: 'सामग्री',
    labour: 'मज़दूरी',
    margin: 'मुनाफा',
    all: 'सभी',
    published: 'प्रकाशित',
    draft: 'ड्राफ्ट',
    backgroundRemoved: 'बैकग्राउंड हटाया गया',
    lightingImproved: 'रोशनी सुधारी गई',
    productCentered: 'प्रोडक्ट केंद्र में',
    validating: 'जांच हो रही है',
    sending: 'भेजा जा रहा है',
    done: 'पूर्ण',
    noInternet: 'इंटरनेट नहीं है — स्थानीय रूप से सहेजा गया, स्वतः सिंक होगा',
  },
  odia: {
    greeting: 'ନମସ୍କାର',
    addProduct: 'ଉତ୍ପାଦନ ଯୋଗ କରନ୍ତୁ',
    myProducts: 'ମୋର ଉତ୍ପାଦନ',
    orders: 'ଅର୍ଡର',
    publishSell: 'ପ୍ରକାଶିତ କରନ୍ତୁ',
    home: 'ହୋମ',
    products: 'ଉତ୍ପାଦନ',
    more: 'ଅଧିକ',
    continue: 'ଆଗକୁ ବଢନ୍ତୁ',
    cancel: 'ବାତିଲ୍ କରନ୍ତୁ',
    keepThisPrice: 'ଏହି ଦାମ ରଖନ୍ତୁ',
    changePrice: 'ଦାମ ବଦଳାନ୍ତୁ',
    goLive: 'ଲାଇଭ୍ ଯାଆନ୍ତୁ',
    viewMyProducts: 'ମୋର ଉତ୍ପାଦନ ଦେଖନ୍ତୁ',
    soundsGood: '👍 ଭଲ ଲାଗିଲା',
    sayAgain: '🔁 ପୁଣି କୁହନ୍ତୁ',
    readAloud: '🔊 ଶୁଣନ୍ତୁ',
    recommended: 'ସୁପାରିଶିତ',
    material: 'ସାମଗ୍ରୀ',
    labour: 'ଶ୍ରମ',
    margin: 'ଲାଭ',
    all: 'ସବୁ',
    published: 'ପ୍ରକାଶିତ',
    draft: 'ଡ୍ରାଫ୍ଟ',
    backgroundRemoved: 'ବ୍ୟାକଗ୍ରାଉଣ୍ଡ୍ ହଟାଗଲା',
    lightingImproved: 'ଆଲୋକ ଉନ୍ନତ କରାଗଲା',
    productCentered: 'ଉତ୍ପାଦନ କେନ୍ଦ୍ରରେ',
    validating: 'ଯାଞ୍ଚ ହେଉଛି',
    sending: 'ପଠାଉଛି',
    done: 'ସମ୍ପୂର୍ଣ୍ଣ',
    noInternet: 'ଇଣ୍ଟରନେଟ୍ ନାହିଁ — ସ୍ଥାନୀୟ ଭାବରେ ସଞ୍ଚିତ, ସ୍ୱୟଂଚାଳିତ ସିଙ୍କ୍ ହେବ',
  },
  english: {
    greeting: 'Hello',
    addProduct: 'Add Product',
    myProducts: 'My Products',
    orders: 'Orders',
    publishSell: 'Publish / Sell',
    home: 'Home',
    products: 'Products',
    more: 'More',
    continue: 'Continue',
    cancel: 'Cancel',
    keepThisPrice: 'Keep This Price',
    changePrice: 'Change Price',
    goLive: 'Go Live',
    viewMyProducts: 'View My Products',
    soundsGood: '👍 Sounds Good',
    sayAgain: '🔁 Say Again',
    readAloud: '🔊 Read Aloud',
    recommended: 'Recommended',
    material: 'Material',
    labour: 'Labour',
    margin: 'Margin',
    all: 'All',
    published: 'Published',
    draft: 'Draft',
    backgroundRemoved: 'Background removed',
    lightingImproved: 'Lighting improved',
    productCentered: 'Product centered',
    validating: 'Validating',
    sending: 'Sending',
    done: 'Done',
    noInternet: 'No internet — saved locally, will sync automatically',
  },
};

export const TRANSLATIONS: Record<Language, Translations> = {
  ...BASE_TRANSLATIONS,
  bengali: { ...BASE_TRANSLATIONS.english, greeting: 'নমস্কার', addProduct: 'পণ্য যোগ করুন', myProducts: 'আমার পণ্য', orders: 'অর্ডার', publishSell: 'প্রকাশ করুন' },
  tamil: { ...BASE_TRANSLATIONS.english, greeting: 'வணக்கம்', addProduct: 'பொருளைச் சேர்', myProducts: 'என் பொருட்கள்', orders: 'ஆர்டர்கள்', publishSell: 'விற்பனை செய்யுங்கள்' },
  telugu: { ...BASE_TRANSLATIONS.english, greeting: 'నమస్కారం', addProduct: 'ఉత్పత్తి జోడించండి', myProducts: 'నా ఉత్పత్తులు', orders: 'ఆర్డర్లు', publishSell: 'విక్రయించండి' },
  marathi: { ...BASE_TRANSLATIONS.english, greeting: 'नमस्कार', addProduct: 'उत्पादन जोडा', myProducts: 'माझी उत्पादने', orders: 'ऑर्डर', publishSell: 'विक्री करा' },
  gujarati: { ...BASE_TRANSLATIONS.english, greeting: 'નમસ્તે', addProduct: 'ઉત્પાદન ઉમેરો', myProducts: 'મારી વસ્તુઓ', orders: 'ઓર્ડર', publishSell: 'વેચો' },
};

export interface DashboardCopy {
  bridge: string;
  chooseLanguage: string;
  chooseLanguageHint: string;
  voicePrompt: string;
  voiceHint: string;
  takePhoto: string;
  viewManage: string;
  viewOrders: string;
  sendToChannels: string;
}

export const DASHBOARD_COPY: Record<Language, DashboardCopy> = {
  english: { bridge: 'Your craft. Our digital bridge.', chooseLanguage: 'Choose your language', chooseLanguageHint: 'You can change this any time in Settings.', voicePrompt: 'What would you like to do?', voiceHint: 'Tap the microphone and tell KarigarSetu how we can help.', takePhoto: 'Take a photo', viewManage: 'View & manage', viewOrders: 'View orders', sendToChannels: 'Send to channels' },
  hindi: { bridge: 'आपकी कला। हमारा डिजिटल सेतु।', chooseLanguage: 'अपनी भाषा चुनें', chooseLanguageHint: 'इसे बाद में सेटिंग्स में बदला जा सकता है।', voicePrompt: 'आप क्या करना चाहते हैं?', voiceHint: 'माइक्रोफ़ोन दबाकर बताइए कि KarigarSetu आपकी कैसे मदद करे।', takePhoto: 'फोटो लें', viewManage: 'देखें और प्रबंधित करें', viewOrders: 'ऑर्डर देखें', sendToChannels: 'चैनलों पर भेजें' },
  odia: { bridge: 'ଆପଣଙ୍କ କଳା। ଆମର ଡିଜିଟାଲ ସେତୁ।', chooseLanguage: 'ଆପଣଙ୍କ ଭାଷା ବାଛନ୍ତୁ', chooseLanguageHint: 'ସେଟିଂସରେ ଏହାକୁ ପରେ ବଦଳାଇପାରିବେ।', voicePrompt: 'ଆପଣ କ’ଣ କରିବାକୁ ଚାହାଁନ୍ତି?', voiceHint: 'KarigarSetu କିପରି ସହାୟତା କରିବ କହିବା ପାଇଁ ମାଇକ୍ ଦବାନ୍ତୁ।', takePhoto: 'ଫଟୋ ନିଅନ୍ତୁ', viewManage: 'ଦେଖନ୍ତୁ ଓ ପରିଚାଳନା କରନ୍ତୁ', viewOrders: 'ଅର୍ଡର ଦେଖନ୍ତୁ', sendToChannels: 'ଚ୍ୟାନେଲକୁ ପଠାନ୍ତୁ' },
  bengali: { bridge: 'আপনার শিল্প। আমাদের ডিজিটাল সেতু।', chooseLanguage: 'আপনার ভাষা বেছে নিন', chooseLanguageHint: 'পরে সেটিংস থেকে পরিবর্তন করতে পারবেন।', voicePrompt: 'আপনি কী করতে চান?', voiceHint: 'KarigarSetu কীভাবে সাহায্য করবে তা বলতে মাইক্রোফোনে ট্যাপ করুন।', takePhoto: 'ছবি তুলুন', viewManage: 'দেখুন ও পরিচালনা করুন', viewOrders: 'অর্ডার দেখুন', sendToChannels: 'চ্যানেলে পাঠান' },
  tamil: { bridge: 'உங்கள் கைவினை. எங்கள் டிஜிட்டல் பாலம்.', chooseLanguage: 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்', chooseLanguageHint: 'பின்னர் அமைப்புகளில் மாற்றலாம்.', voicePrompt: 'நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்?', voiceHint: 'KarigarSetu எவ்வாறு உதவ வேண்டும் என்பதைச் சொல்ல மைக்கைத் தட்டவும்.', takePhoto: 'புகைப்படம் எடுக்கவும்', viewManage: 'பார்த்து நிர்வகிக்கவும்', viewOrders: 'ஆர்டர்களைப் பார்க்கவும்', sendToChannels: 'சேனல்களுக்கு அனுப்பவும்' },
  telugu: { bridge: 'మీ కళ. మా డిజిటల్ వారధి.', chooseLanguage: 'మీ భాషను ఎంచుకోండి', chooseLanguageHint: 'తర్వాత సెట్టింగ్‌లలో మార్చవచ్చు.', voicePrompt: 'మీరు ఏమి చేయాలనుకుంటున్నారు?', voiceHint: 'KarigarSetu ఎలా సహాయం చేయాలో చెప్పడానికి మైక్‌ను నొక్కండి.', takePhoto: 'ఫోటో తీయండి', viewManage: 'చూడండి & నిర్వహించండి', viewOrders: 'ఆర్డర్‌లను చూడండి', sendToChannels: 'చానెల్‌లకు పంపండి' },
  marathi: { bridge: 'तुमची कला. आमचा डिजिटल सेतू.', chooseLanguage: 'तुमची भाषा निवडा', chooseLanguageHint: 'नंतर सेटिंग्जमध्ये बदलू शकता.', voicePrompt: 'तुम्हाला काय करायचे आहे?', voiceHint: 'KarigarSetu कशी मदत करेल हे सांगण्यासाठी माइकवर टॅप करा.', takePhoto: 'फोटो घ्या', viewManage: 'पहा आणि व्यवस्थापित करा', viewOrders: 'ऑर्डर पहा', sendToChannels: 'चॅनेलवर पाठवा' },
  gujarati: { bridge: 'તમારી કલા. અમારો ડિજિટલ સેતુ.', chooseLanguage: 'તમારી ભાષા પસંદ કરો', chooseLanguageHint: 'પછી સેટિંગ્સમાં બદલી શકો છો.', voicePrompt: 'તમે શું કરવા માંગો છો?', voiceHint: 'KarigarSetu કેવી રીતે મદદ કરે તે જણાવવા માઇક પર ટેપ કરો.', takePhoto: 'ફોટો લો', viewManage: 'જુઓ અને મેનેજ કરો', viewOrders: 'ઓર્ડર જુઓ', sendToChannels: 'ચેનલો પર મોકલો' },
};

export const MOCK_LISTING = {
  title: 'Handpainted Terracotta Pot',
  description:
    'Beautifully handpainted terracotta pot with traditional tribal motifs. Perfect for home decor or gifting. Each piece is unique and crafted by skilled artisans of Odisha.',
};

export const MOCK_PRICE_BREAKDOWN = {
  material: 200,
  labour: 250,
  margin: 150,
};

export const ARTISAN_NAME = 'Ramesh';
