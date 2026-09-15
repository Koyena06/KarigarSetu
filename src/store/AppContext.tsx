import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetworkState } from 'expo-network';
import type { Channel, Language, NewProductDraft, Order, OrderStatus, Product, Profile, ScreenName, TabName } from '@/types';
import { STRINGS, type Strings } from '@/i18n/strings';
import { sampleOrders, sampleProducts } from './sampleData';

const STORAGE_KEY = 'karigarsetu:v2';

interface PersistedState {
  language: Language;
  onboarded: boolean;
  profile: Profile;
  voiceGuide: boolean;
  products: Product[];
  orders: Order[];
}

const DEFAULT_STATE: PersistedState = {
  language: 'english',
  onboarded: false,
  profile: { name: '', craft: '' },
  voiceGuide: true,
  products: [],
  orders: [],
};

const emptyDraft = (): NewProductDraft => ({
  originalPhoto: null,
  photo: null,
  enhancedWith: null,
  voiceAudioUri: null,
  transcript: '',
  title: '',
  description: '',
  localDescription: '',
  highlights: [],
  category: '',
  aiPrice: null,
  aiPriceReason: '',
  price: 0,
  stock: 1,
  costBreakdown: { material: 0, labour: 0, margin: 0 },
});

/** Where the hardware/back button goes from each screen. */
const PARENT: Partial<Record<ScreenName, ScreenName>> = {
  camera: 'home',
  enhance: 'camera',
  voice: 'camera',
  listing: 'voice',
  price: 'listing',
  channels: 'price',
  success: 'home',
  products: 'home',
  productDetail: 'products',
  orders: 'home',
  settings: 'home',
  tutorial: 'settings',
};

const TAB_FOR_SCREEN: Partial<Record<ScreenName, TabName>> = {
  home: 'home',
  products: 'products',
  productDetail: 'products',
  orders: 'orders',
  settings: 'settings',
};

export const NEXT_ORDER_STATUS: Record<OrderStatus, OrderStatus | null> = {
  new: 'accepted',
  accepted: 'packed',
  packed: 'shipped',
  shipped: 'delivered',
  delivered: null,
};

interface AppContextValue extends PersistedState {
  hydrated: boolean;
  t: Strings;
  online: boolean;

  screen: ScreenName;
  activeTab: TabName;
  navigate: (screen: ScreenName) => void;
  goBack: () => boolean;

  setLanguage: (language: Language) => void;
  updateProfile: (profile: Partial<Profile>) => void;
  completeOnboarding: () => void;
  setVoiceGuide: (enabled: boolean) => void;

  draft: NewProductDraft;
  setDraft: (patch: Partial<NewProductDraft>) => void;
  startNewProduct: () => void;
  selectedChannels: Channel[];
  toggleChannel: (channel: Channel) => void;
  publishDraft: (status: Product['status']) => Product;
  lastPublishedId: string | null;

  selectedProductId: string | null;
  openProduct: (id: string) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  advanceOrder: (id: string) => void;
  loadSampleData: () => void;
  resetApp: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [persisted, setPersisted] = useState<PersistedState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [screen, setScreen] = useState<ScreenName>('onboarding');
  const [draft, setDraftState] = useState<NewProductDraft>(emptyDraft);
  const [selectedChannels, setSelectedChannels] = useState<Channel[]>(['ONDC']);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [lastPublishedId, setLastPublishedId] = useState<string | null>(null);
  const network = useNetworkState();
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const stored = { ...DEFAULT_STATE, ...(JSON.parse(raw) as Partial<PersistedState>) };
          setPersisted(stored);
          setScreen(stored.onboarded ? 'home' : 'onboarding');
        }
      } catch {
        // Corrupt storage: start fresh rather than crash.
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    }, 250);
  }, [persisted, hydrated]);

  const patch = useCallback((update: Partial<PersistedState> | ((prev: PersistedState) => Partial<PersistedState>)) => {
    setPersisted((prev) => ({ ...prev, ...(typeof update === 'function' ? update(prev) : update) }));
  }, []);

  const navigate = useCallback((next: ScreenName) => setScreen(next), []);

  const goBack = useCallback(() => {
    const parent = PARENT[screen];
    if (!parent) return false;
    setScreen(parent);
    return true;
  }, [screen]);

  const setDraft = useCallback((d: Partial<NewProductDraft>) => setDraftState((prev) => ({ ...prev, ...d })), []);

  const startNewProduct = useCallback(() => {
    setDraftState(emptyDraft());
    setSelectedChannels(['ONDC']);
    setScreen('camera');
  }, []);

  const toggleChannel = useCallback((channel: Channel) => {
    setSelectedChannels((prev) => (prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]));
  }, []);

  const publishDraft = useCallback(
    (status: Product['status']) => {
      const product: Product = {
        id: `p-${Date.now()}`,
        title: draft.title.trim() || 'Handmade product',
        description: draft.description.trim(),
        localDescription: draft.localDescription,
        highlights: draft.highlights,
        category: draft.category,
        price: draft.price,
        stock: draft.stock,
        image: draft.photo ?? '',
        channels: selectedChannels,
        status,
        costBreakdown: draft.costBreakdown,
        createdAt: Date.now(),
      };
      patch((prev) => ({ products: [product, ...prev.products] }));
      setLastPublishedId(product.id);
      return product;
    },
    [draft, selectedChannels, patch]
  );

  const openProduct = useCallback((id: string) => {
    setSelectedProductId(id);
    setScreen('productDetail');
  }, []);

  const updateProduct = useCallback(
    (id: string, update: Partial<Product>) =>
      patch((prev) => ({ products: prev.products.map((p) => (p.id === id ? { ...p, ...update } : p)) })),
    [patch]
  );

  const deleteProduct = useCallback(
    (id: string) => patch((prev) => ({ products: prev.products.filter((p) => p.id !== id) })),
    [patch]
  );

  const advanceOrder = useCallback(
    (id: string) =>
      patch((prev) => ({
        orders: prev.orders.map((o) => {
          const next = NEXT_ORDER_STATUS[o.status];
          return o.id === id && next ? { ...o, status: next } : o;
        }),
      })),
    [patch]
  );

  const loadSampleData = useCallback(() => {
    patch((prev) => {
      const existing = new Set(prev.products.map((p) => p.id));
      const existingOrders = new Set(prev.orders.map((o) => o.id));
      return {
        products: [...prev.products, ...sampleProducts().filter((p) => !existing.has(p.id))],
        orders: [...sampleOrders().filter((o) => !existingOrders.has(o.id)), ...prev.orders],
      };
    });
  }, [patch]);

  const resetApp = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setPersisted(DEFAULT_STATE);
    setDraftState(emptyDraft());
    setScreen('onboarding');
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      ...persisted,
      hydrated,
      t: STRINGS[persisted.language],
      // Treat "unknown" as online so we never show a false offline banner at launch.
      online: network.isInternetReachable !== false && network.isConnected !== false,
      screen,
      activeTab: TAB_FOR_SCREEN[screen] ?? 'home',
      navigate,
      goBack,
      setLanguage: (language) => patch({ language }),
      updateProfile: (profile) => patch((prev) => ({ profile: { ...prev.profile, ...profile } })),
      completeOnboarding: () => patch({ onboarded: true }),
      setVoiceGuide: (voiceGuide) => patch({ voiceGuide }),
      draft,
      setDraft,
      startNewProduct,
      selectedChannels,
      toggleChannel,
      publishDraft,
      lastPublishedId,
      selectedProductId,
      openProduct,
      updateProduct,
      deleteProduct,
      advanceOrder,
      loadSampleData,
      resetApp,
    }),
    [persisted, hydrated, network.isInternetReachable, network.isConnected, screen, navigate, goBack, patch, draft, setDraft, startNewProduct, selectedChannels, toggleChannel, publishDraft, lastPublishedId, selectedProductId, openProduct, updateProduct, deleteProduct, advanceOrder, loadSampleData, resetApp]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
