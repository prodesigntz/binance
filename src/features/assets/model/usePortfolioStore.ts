import { create } from 'zustand';

export interface UserHolding {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  color: string;
  category: 'spot' | 'futures' | 'funding' | 'earn';
  pnlUsd?: number;
  pnlPercent?: number;
}

export type AssetsTabId = 'overview' | 'funding' | 'earn' | 'spot' | 'futures';

export interface PortfolioState {
  hideBalance: boolean;
  hideSmallBalances: boolean;
  selectedTab: AssetsTabId;
  assetsAccountTab: 'assets' | 'account';
  searchQuery: string;
  holdings: UserHolding[];

  toggleHideBalance: () => void;
  toggleHideSmallBalances: () => void;
  setSelectedTab: (tab: AssetsTabId) => void;
  setAssetsAccountTab: (tab: 'assets' | 'account') => void;
  setSearchQuery: (query: string) => void;
}

const DEFAULT_HOLDINGS: UserHolding[] = [
  {
    id: 'tether',
    symbol: 'USDT',
    name: 'TetherUS',
    amount: 100.62975578,
    color: '#26a17b',
    category: 'spot',
    pnlUsd: 0.00000982,
    pnlPercent: 0.0,
  },
  {
    id: 'binancecoin',
    symbol: 'BNB',
    name: 'BNB',
    amount: 0.00000421,
    color: '#f3ba2f',
    category: 'spot',
    pnlUsd: 0.0,
    pnlPercent: 0.2,
  },
  {
    id: 'tron',
    symbol: 'TRX',
    name: 'TRON',
    amount: 0.00000076,
    color: '#ef0027',
    category: 'spot',
    pnlUsd: 0.0,
    pnlPercent: 0.35,
  },
  {
    id: 'usd-coin',
    symbol: 'USDC',
    name: 'USD Coin',
    amount: 0.00000004,
    color: '#2775ca',
    category: 'spot',
    pnlUsd: 0.0,
    pnlPercent: 0.0,
  },
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    amount: 0.0000125,
    color: '#f7931a',
    category: 'spot',
    pnlUsd: 0.00012,
    pnlPercent: 0.15,
  },
];

export const usePortfolioStore = create<PortfolioState>((set) => ({
  hideBalance: false,
  hideSmallBalances: false,
  selectedTab: 'overview',
  assetsAccountTab: 'assets',
  searchQuery: '',
  holdings: DEFAULT_HOLDINGS,

  toggleHideBalance: () => set((state) => ({ hideBalance: !state.hideBalance })),
  toggleHideSmallBalances: () =>
    set((state) => ({ hideSmallBalances: !state.hideSmallBalances })),
  setSelectedTab: (selectedTab) => set({ selectedTab }),
  setAssetsAccountTab: (assetsAccountTab) => set({ assetsAccountTab }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));
