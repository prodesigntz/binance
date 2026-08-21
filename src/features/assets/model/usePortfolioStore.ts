import { create } from 'zustand';

export interface UserHolding {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  color: string;
  category: 'spot' | 'futures' | 'funding' | 'earn';
}

export type AssetsTabId = 'overview' | 'spot' | 'futures' | 'funding' | 'earn';

export interface PortfolioState {
  hideBalance: boolean;
  hideSmallBalances: boolean;
  selectedTab: AssetsTabId;
  searchQuery: string;
  holdings: UserHolding[];
  
  toggleHideBalance: () => void;
  toggleHideSmallBalances: () => void;
  setSelectedTab: (tab: AssetsTabId) => void;
  setSearchQuery: (query: string) => void;
}

const DEFAULT_HOLDINGS: UserHolding[] = [
  {
    id: 'tether',
    symbol: 'USDT',
    name: 'Tether',
    amount: 5420.5,
    color: '#02a47e',
    category: 'spot',
  },
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    amount: 0.115,
    color: '#f7931a',
    category: 'spot',
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    amount: 1.25,
    color: '#627eea',
    category: 'spot',
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    amount: 18.4,
    color: '#14f195',
    category: 'futures',
  },
  {
    id: 'binancecoin',
    symbol: 'BNB',
    name: 'BNB',
    amount: 3.5,
    color: '#f3ba2f',
    category: 'earn',
  },
  {
    id: 'ripple',
    symbol: 'XRP',
    name: 'XRP',
    amount: 450.0,
    color: '#23292f',
    category: 'spot',
  },
  {
    id: 'cardano',
    symbol: 'ADA',
    name: 'Cardano',
    amount: 0.85, // small balance testing
    color: '#0033ad',
    category: 'funding',
  },
];

export const usePortfolioStore = create<PortfolioState>((set) => ({
  hideBalance: false,
  hideSmallBalances: false,
  selectedTab: 'overview',
  searchQuery: '',
  holdings: DEFAULT_HOLDINGS,

  toggleHideBalance: () => set((state) => ({ hideBalance: !state.hideBalance })),
  toggleHideSmallBalances: () =>
    set((state) => ({ hideSmallBalances: !state.hideSmallBalances })),
  setSelectedTab: (selectedTab) => set({ selectedTab }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));
