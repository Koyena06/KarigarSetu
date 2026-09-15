export type Language = 'english' | 'hindi' | 'odia' | 'bengali' | 'tamil' | 'telugu' | 'marathi' | 'gujarati';

export type ScreenName =
  | 'onboarding'
  | 'tutorial'
  | 'home'
  | 'camera'
  | 'enhance'
  | 'voice'
  | 'listing'
  | 'price'
  | 'channels'
  | 'success'
  | 'products'
  | 'productDetail'
  | 'orders'
  | 'settings';

export type TabName = 'home' | 'products' | 'orders' | 'settings';

export type Channel = 'ONDC' | 'GeM' | 'B2B';

export interface CostBreakdown {
  material: number;
  labour: number;
  margin: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  /** Artisan-language copy of the description, read aloud to them. */
  localDescription?: string;
  highlights: string[];
  category?: string;
  price: number;
  stock: number;
  image: string;
  channels: Channel[];
  status: 'published' | 'draft';
  costBreakdown: CostBreakdown;
  createdAt: number;
}

export type OrderStatus = 'new' | 'accepted' | 'packed' | 'shipped' | 'delivered';

export interface Order {
  id: string;
  productTitle: string;
  image: string;
  qty: number;
  total: number;
  buyer: string;
  city: string;
  channel: Channel;
  status: OrderStatus;
  createdAt: number;
}

export interface Profile {
  name: string;
  craft: string;
}

export interface NewProductDraft {
  originalPhoto: string | null;
  photo: string | null;
  enhancedWith: 'studio' | 'original' | null;
  voiceAudioUri: string | null;
  transcript: string;
  title: string;
  description: string;
  localDescription: string;
  highlights: string[];
  category: string;
  aiPrice: number | null;
  aiPriceReason: string;
  price: number;
  stock: number;
  costBreakdown: CostBreakdown;
}
