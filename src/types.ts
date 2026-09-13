export type Language = 'english' | 'hindi' | 'odia' | 'bengali' | 'tamil' | 'telugu' | 'marathi' | 'gujarati';

export type ScreenName =
  | 'language'
  | 'home'
  | 'camera'
  | 'enhance'
  | 'voice'
  | 'listing'
  | 'price'
  | 'channels'
  | 'success'
  | 'products'
  | 'orders'
  | 'settings';

export type TabName = 'home' | 'products' | 'orders' | 'more';

export type Channel = 'ONDC' | 'GeM' | 'B2B';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  channels: Channel[];
  status: 'published' | 'draft';
  costBreakdown: {
    material: number;
    labour: number;
    margin: number;
  };
}

export interface NewProductDraft {
  photo: string | null;
  voiceAudioUri: string | null;
  voiceTranscript: string;
  title: string;
  description: string;
  price: number;
  channels: Channel[];
  costBreakdown: {
    material: number;
    labour: number;
    margin: number;
  };
}

export interface Translations {
  greeting: string;
  addProduct: string;
  myProducts: string;
  orders: string;
  publishSell: string;
  home: string;
  products: string;
  more: string;
  continue: string;
  cancel: string;
  keepThisPrice: string;
  changePrice: string;
  goLive: string;
  viewMyProducts: string;
  soundsGood: string;
  sayAgain: string;
  readAloud: string;
  recommended: string;
  material: string;
  labour: string;
  margin: string;
  all: string;
  published: string;
  draft: string;
  backgroundRemoved: string;
  lightingImproved: string;
  productCentered: string;
  validating: string;
  sending: string;
  done: string;
  noInternet: string;
}
