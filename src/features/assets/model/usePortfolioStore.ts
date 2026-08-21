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

export interface WithdrawalRecord {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  usdEquivalent: number;
  network: string;
  address: string;
  fee: number;
  status: 'Processing' | 'Completed' | 'Failed';
  createdAt: string;
  txId: string;
  wallet: string;
}

export interface PortfolioState {
  hideBalance: boolean;
  hideSmallBalances: boolean;
  selectedTab: AssetsTabId;
  assetsAccountTab: 'assets' | 'account';
  searchQuery: string;
  holdings: UserHolding[];
  withdrawalHistory: WithdrawalRecord[];

  toggleHideBalance: () => void;
  toggleHideSmallBalances: () => void;
  setSelectedTab: (tab: AssetsTabId) => void;
  setAssetsAccountTab: (tab: 'assets' | 'account') => void;
  setSearchQuery: (query: string) => void;
  addWithdrawalRecord: (record: WithdrawalRecord) => void;
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

const INITIAL_WITHDRAWAL_HISTORY: WithdrawalRecord[] = [
  {
    id: 'tx-1001',
    symbol: 'USDT',
    name: 'TetherUS',
    amount: 0.010493,
    usdEquivalent: 0.010492,
    network: 'Tron (TRC20)',
    address: 'TMrGBFdGnKUgLhbhf2qcXc7pp5qaDDjMXg',
    fee: 1.5,
    status: 'Processing',
    createdAt: '2026-08-21 10:05:18',
    txId: '7a9c3d4f8e1b2a5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c',
    wallet: 'Spot Account',
  },
  {
    id: 'tx-1000',
    symbol: 'USDT',
    name: 'TetherUS',
    amount: 25.5,
    usdEquivalent: 25.5,
    network: 'BNB Smart Chain (BEP20)',
    address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    fee: 0.29,
    status: 'Completed',
    createdAt: '2026-08-20 18:22:04',
    txId: '0x4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e',
    wallet: 'Spot Account',
  },
  {
    id: 'tx-999',
    symbol: 'BTC',
    name: 'Bitcoin',
    amount: 0.0025,
    usdEquivalent: 240.0,
    network: 'Bitcoin',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    fee: 0.0001,
    status: 'Completed',
    createdAt: '2026-08-15 14:10:50',
    txId: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    wallet: 'Spot Account',
  },
];

export const usePortfolioStore = create<PortfolioState>((set) => ({
  hideBalance: false,
  hideSmallBalances: false,
  selectedTab: 'overview',
  assetsAccountTab: 'assets',
  searchQuery: '',
  holdings: DEFAULT_HOLDINGS,
  withdrawalHistory: INITIAL_WITHDRAWAL_HISTORY,

  toggleHideBalance: () => set((state) => ({ hideBalance: !state.hideBalance })),
  toggleHideSmallBalances: () =>
    set((state) => ({ hideSmallBalances: !state.hideSmallBalances })),
  setSelectedTab: (selectedTab) => set({ selectedTab }),
  setAssetsAccountTab: (assetsAccountTab) => set({ assetsAccountTab }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  addWithdrawalRecord: (record) =>
    set((state) => ({
      withdrawalHistory: [record, ...state.withdrawalHistory],
    })),
}));
