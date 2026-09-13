import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import type { Language, ScreenName, TabName, Channel, Product, NewProductDraft } from './types';
import { TRANSLATIONS, DUMMY_PRODUCTS } from './mockData';

interface AppContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (typeof TRANSLATIONS)[Language];
  screen: ScreenName;
  activeTab: TabName;
  navigate: (screen: ScreenName, tab?: TabName) => void;
  offline: boolean;
  setOffline: (v: boolean) => void;
  products: Product[];
  addProduct: (p: Product) => void;
  draft: NewProductDraft;
  setDraft: (d: Partial<NewProductDraft>) => void;
  resetDraft: () => void;
  selectedChannels: Channel[];
  toggleChannel: (ch: Channel) => void;
}

const emptyDraft: NewProductDraft = {
  photo: null,
  voiceAudioUri: null,
  voiceTranscript: '',
  title: '',
  description: '',
  price: 0,
  channels: ['ONDC', 'GeM', 'B2B'],
  costBreakdown: { material: 0, labour: 0, margin: 0 },
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('english');
  const [screen, setScreen] = useState<ScreenName>('language');
  const [activeTab, setActiveTab] = useState<TabName>('home');
  const [offline, setOffline] = useState(false);
  const [products, setProducts] = useState<Product[]>(DUMMY_PRODUCTS);
  const [draft, setDraftState] = useState<NewProductDraft>(emptyDraft);
  const [selectedChannels, setSelectedChannels] = useState<Channel[]>(['ONDC', 'GeM', 'B2B']);

  const navigate = useCallback((s: ScreenName, tab?: TabName) => {
    setScreen(s);
    if (tab) {
      setActiveTab(tab);
    } else if (s === 'home') {
      setActiveTab('home');
    } else if (s === 'products') {
      setActiveTab('products');
    } else if (s === 'orders') {
      setActiveTab('orders');
    } else if (s === 'settings') {
      setActiveTab('more');
    }
  }, []);

  const setDraft = useCallback((d: Partial<NewProductDraft>) => {
    setDraftState((prev) => ({ ...prev, ...d }));
  }, []);

  const resetDraft = useCallback(() => {
    setDraftState(emptyDraft);
    setSelectedChannels(['ONDC', 'GeM', 'B2B']);
  }, []);

  const addProduct = useCallback((p: Product) => {
    setProducts((prev) => [p, ...prev]);
  }, []);

  const toggleChannel = useCallback((ch: Channel) => {
    setSelectedChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    );
  }, []);

  const value: AppContextValue = useMemo(
    () => ({
      language,
      setLanguage,
      t: TRANSLATIONS[language],
      screen,
      activeTab,
      navigate,
      offline,
      setOffline,
      products,
      addProduct,
      draft,
      setDraft,
      resetDraft,
      selectedChannels,
      toggleChannel,
    }),
    [language, screen, activeTab, navigate, offline, products, addProduct, draft, setDraft, resetDraft, selectedChannels, toggleChannel]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
