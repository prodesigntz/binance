import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { ScreenLayout } from '../../../shared/layout';
import { useMarkets } from '../../markets/api/useMarkets';
import { usePortfolioStore, type UserHolding, type WithdrawalRecord } from '../model/usePortfolioStore';
import { AssetsHeader } from './AssetsHeader';
import { AssetsTabStrip } from './AssetsTabStrip';
import { HoldingRow } from './HoldingRow';
import { AddFundsSheet } from './AddFundsSheet';
import { SendSheet } from './SendSheet';
import { SelectAssetSheet, type CoinAsset } from './SelectAssetSheet';
import { ChooseNetworkSheet, type CryptoNetwork } from './ChooseNetworkSheet';
import { DepositDetailModal } from './DepositDetailModal';
import { EnterAddressModal } from './EnterAddressModal';
import { ChooseWithdrawNetworkSheet, type WithdrawNetwork } from './ChooseWithdrawNetworkSheet';
import { WithdrawAmountModal } from './WithdrawAmountModal';
import { ConfirmWithdrawModal } from './ConfirmWithdrawModal';
import { VerifyPasskeyModal } from './VerifyPasskeyModal';
import { WithdrawProcessingModal } from './WithdrawProcessingModal';
import { WithdrawHistoryModal } from './WithdrawHistoryModal';
import { WithdrawDetailModal } from './WithdrawDetailModal';

export function AssetsScreen(): React.JSX.Element {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();

  const {
    hideBalance,
    hideSmallBalances,
    selectedTab,
    assetsAccountTab,
    searchQuery,
    holdings,
    toggleHideBalance,
    setSelectedTab,
    setAssetsAccountTab,
    setSearchQuery,
    addWithdrawalRecord,
  } = usePortfolioStore();

  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isAddFundsOpen, setIsAddFundsOpen] = React.useState(false);
  const [isSendSheetOpen, setIsSendSheetOpen] = React.useState(false);
  const [isSelectAssetOpen, setIsSelectAssetOpen] = React.useState(false);
  const [isChooseNetworkOpen, setIsChooseNetworkOpen] = React.useState(false);
  const [isDepositDetailOpen, setIsDepositDetailOpen] = React.useState(false);

  const [assetFlowMode, setAssetFlowMode] = React.useState<'deposit' | 'withdraw'>('deposit');
  const [isEnterAddressOpen, setIsEnterAddressOpen] = React.useState(false);
  const [isChooseWithdrawNetworkOpen, setIsChooseWithdrawNetworkOpen] = React.useState(false);

  // Withdraw Flow Modal States
  const [isWithdrawAmountOpen, setIsWithdrawAmountOpen] = React.useState(false);
  const [isConfirmWithdrawOpen, setIsConfirmWithdrawOpen] = React.useState(false);
  const [isVerifyPasskeyOpen, setIsVerifyPasskeyOpen] = React.useState(false);
  const [isWithdrawProcessingOpen, setIsWithdrawProcessingOpen] = React.useState(false);
  const [isWithdrawHistoryOpen, setIsWithdrawHistoryOpen] = React.useState(false);
  const [isWithdrawDetailOpen, setIsWithdrawDetailOpen] = React.useState(false);

  const [selectedDepositCoin, setSelectedDepositCoin] = React.useState<CoinAsset | null>(null);
  const [selectedDepositNetwork, setSelectedDepositNetwork] = React.useState<CryptoNetwork | null>(null);
  const [selectedWithdrawNetwork, setSelectedWithdrawNetwork] = React.useState<WithdrawNetwork | null>(null);
  const [withdrawAddress, setWithdrawAddress] = React.useState('');
  const [withdrawAmount, setWithdrawAmount] = React.useState(0);
  const [selectedHistoryRecord, setSelectedHistoryRecord] = React.useState<WithdrawalRecord | null>(null);

  // Fetch live market data (top 50 market caps) from CoinGecko
  const { data: marketsList = [], isLoading, refetch } = useMarkets('usd', 50, 1);

  // Map market list by symbol & id for fast lookup
  const marketMap = useMemo(() => {
    const map = new Map<string, { price: number; change24h: number; image: string; id: string }>();
    for (const coin of marketsList) {
      map.set(coin.symbol.toLowerCase(), {
        price: coin.current_price ?? 0,
        change24h: coin.price_change_percentage_24h ?? 0,
        image: coin.image,
        id: coin.id,
      });
      map.set(coin.id.toLowerCase(), {
        price: coin.current_price ?? 0,
        change24h: coin.price_change_percentage_24h ?? 0,
        image: coin.image,
        id: coin.id,
      });
    }
    return map;
  }, [marketsList]);

  // Live Bitcoin price for BTC equivalent calculation
  const btcPrice = useMemo(() => {
    return marketMap.get('bitcoin')?.price ?? marketMap.get('btc')?.price ?? 96000;
  }, [marketMap]);

  // Compute calculated valuation for each holding
  const holdingsWithValuation = useMemo(() => {
    return holdings.map((h) => {
      let unitPrice = 0;
      let change24h = h.pnlPercent ?? 0.2;
      let imageUrl: string | undefined;

      // Special case for stablecoins if API doesn't return them
      if (h.symbol === 'USDT' || h.symbol === 'USDC') {
        unitPrice = 1.0;
      }

      const live = marketMap.get(h.symbol.toLowerCase()) ?? marketMap.get(h.id.toLowerCase());
      if (live) {
        if (live.price > 0) unitPrice = live.price;
        if (live.change24h !== 0) change24h = live.change24h;
        imageUrl = live.image;
      }

      const totalValueUsd = h.amount * unitPrice;
      return {
        ...h,
        unitPrice,
        change24h,
        imageUrl,
        totalValueUsd,
      };
    });
  }, [holdings, marketMap]);

  // Total Portfolio USD Balance
  const totalUsdBalance = useMemo(() => {
    return holdingsWithValuation.reduce((acc, curr) => acc + curr.totalValueUsd, 0);
  }, [holdingsWithValuation]);

  // Filtered Holdings according to Tab, Small Balances, and Search Query
  const filteredHoldings = useMemo(() => {
    return holdingsWithValuation.filter((h) => {
      // Tab filter
      if (selectedTab !== 'overview' && h.category !== selectedTab) {
        return false;
      }
      // Small balances filter (< $1.00)
      if (hideSmallBalances && h.totalValueUsd < 0.000001) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        return h.symbol.toLowerCase().includes(q) || h.name.toLowerCase().includes(q);
      }
      return true;
    });
  }, [holdingsWithValuation, selectedTab, hideSmallBalances, searchQuery]);

  const handlePressHolding = useCallback(
    (holding: UserHolding & { id: string }) => {
      // Navigate to Markets stack -> CoinDetails
      navigation.navigate('Markets', {
        screen: 'CoinDetails',
        params: { coinId: holding.id },
      });
    },
    [navigation]
  );

  return (
    <ScreenLayout inTabNavigator>
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        {/* Sticky Header at the top (Overview, Funding, Earn, Spot, Futures) */}
        <View style={{ backgroundColor: colors.bg, zIndex: 10 }}>
          <AssetsTabStrip activeTab={selectedTab} onTabChange={setSelectedTab} />
        </View>

        <FlatList
          data={filteredHoldings}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              tintColor="#F9B600"
              colors={['#F9B600']}
            />
          }
          ListHeaderComponent={
            <View>
              {/* Main Total Balance & Quick Actions */}
              <AssetsHeader
                totalUsd={totalUsdBalance}
                btcPrice={btcPrice}
                hideBalance={hideBalance}
                onToggleHideBalance={toggleHideBalance}
                onQuickAction={(action) => {
                  if (action === 'deposit') {
                    setIsAddFundsOpen(true);
                  } else if (action === 'send' || action === 'withdraw') {
                    setIsSendSheetOpen(true);
                  }
                }}
              />

              {/* Sub Header Bar: Assets | Account + Search & Settings icons */}
              <View style={styles.assetsAccountBar}>
                <View style={styles.tabsLeft}>
                  <TouchableOpacity
                    style={styles.subTabBtn}
                    onPress={() => setAssetsAccountTab('assets')}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.subTabTitle,
                        {
                          color: assetsAccountTab === 'assets' ? colors.text : colors.text2,
                          fontWeight: assetsAccountTab === 'assets' ? '700' : '500',
                        },
                      ]}
                    >
                      Assets
                    </Text>
                    {assetsAccountTab === 'assets' && <View style={styles.activeBar} />}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.subTabBtn}
                    onPress={() => setAssetsAccountTab('account')}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.subTabTitle,
                        {
                          color: assetsAccountTab === 'account' ? colors.text : colors.text2,
                          fontWeight: assetsAccountTab === 'account' ? '700' : '500',
                        },
                      ]}
                    >
                      Account
                    </Text>
                    {assetsAccountTab === 'account' && <View style={styles.activeBar} />}
                  </TouchableOpacity>
                </View>

                {/* Right side: Search & Settings Icons */}
                <View style={styles.iconsRight}>
                  <TouchableOpacity
                    onPress={() => setIsSearchOpen(!isSearchOpen)}
                    style={styles.iconPadding}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="search-outline" size={19} color={colors.text2} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconPadding} activeOpacity={0.7}>
                    <Feather name="hexagon" size={18} color={colors.text2} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Collapsible Search Bar */}
              {isSearchOpen && (
                <View style={[styles.searchBoxRow, { backgroundColor: colors.card2 }]}>
                  <Ionicons name="search" size={14} color={colors.iconMuted} />
                  <TextInput
                    style={[styles.searchInput, { color: colors.text }]}
                    placeholder="Search asset symbol"
                    placeholderTextColor={colors.text2}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoFocus
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                      <Ionicons name="close-circle" size={14} color={colors.iconMuted} />
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          }
          renderItem={({ item }) => (
            <HoldingRow
              holding={item}
              unitPrice={item.unitPrice}
              change24h={item.change24h}
              imageUrl={item.imageUrl}
              hideBalance={hideBalance}
              onPress={() => handlePressHolding(item)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="wallet-outline" size={40} color={colors.iconMuted} />
              <Text style={[styles.emptyText, { color: colors.text2 }]}>
                No assets found in this category
              </Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />

        {/* Step 1: Select Deposit Method Bottom Sheet */}
        <AddFundsSheet
          visible={isAddFundsOpen}
          onClose={() => setIsAddFundsOpen(false)}
          onSelectMethod={(method) => {
            if (method === 'deposit') {
              setAssetFlowMode('deposit');
              setIsSelectAssetOpen(true);
            }
          }}
        />

        {/* Select Withdraw Method Bottom Sheet (Send / Withdraw) */}
        <SendSheet
          visible={isSendSheetOpen}
          onClose={() => setIsSendSheetOpen(false)}
          onSelectMethod={(method) => {
            if (method === 'withdraw') {
              setAssetFlowMode('withdraw');
              setIsSelectAssetOpen(true);
            }
          }}
        />

        {/* Step 2: Select Asset Overlay */}
        <SelectAssetSheet
          visible={isSelectAssetOpen}
          onClose={() => setIsSelectAssetOpen(false)}
          onSelectCoin={(coin) => {
            setSelectedDepositCoin(coin);
            setIsSelectAssetOpen(false);
            if (assetFlowMode === 'deposit') {
              setIsChooseNetworkOpen(true);
            } else {
              setIsEnterAddressOpen(true);
            }
          }}
        />

        {/* Step 3 (Deposit Flow): Choose Network Bottom Sheet */}
        <ChooseNetworkSheet
          visible={isChooseNetworkOpen}
          coinSymbol={selectedDepositCoin?.symbol ?? 'USDT'}
          onClose={() => setIsChooseNetworkOpen(false)}
          onSelectNetwork={(net) => {
            setSelectedDepositNetwork(net);
            setIsChooseNetworkOpen(false);
            setIsDepositDetailOpen(true);
          }}
        />

        {/* Step 4 (Deposit Flow): Final Deposit Address & QR Code Modal */}
        <DepositDetailModal
          visible={isDepositDetailOpen}
          coin={selectedDepositCoin}
          network={selectedDepositNetwork}
          onClose={() => setIsDepositDetailOpen(false)}
          onSwitchNetwork={() => {
            setIsDepositDetailOpen(false);
            setIsChooseNetworkOpen(true);
          }}
        />

        {/* Step 3 (Withdraw Flow): Enter Address Modal */}
        <EnterAddressModal
          visible={isEnterAddressOpen}
          coin={selectedDepositCoin}
          selectedNetwork={selectedWithdrawNetwork}
          onSelectNetwork={setSelectedWithdrawNetwork}
          onClose={() => setIsEnterAddressOpen(false)}
          onProceedNext={(addr, net) => {
            setSelectedWithdrawNetwork(net);
            setWithdrawAddress(addr);
            setIsEnterAddressOpen(false);
            setIsWithdrawAmountOpen(true);
          }}
        />

        {/* Step 4 (Withdraw Flow): Choose Withdraw Network Sheet */}
        <ChooseWithdrawNetworkSheet
          visible={isChooseWithdrawNetworkOpen}
          selectedNetworkId={selectedWithdrawNetwork?.id}
          onClose={() => setIsChooseWithdrawNetworkOpen(false)}
          onSelectNetwork={(net) => {
            setSelectedWithdrawNetwork(net);
            setIsChooseWithdrawNetworkOpen(false);
          }}
        />

        {/* Step 5 (Withdraw Flow): Enter Amount Screen */}
        <WithdrawAmountModal
          visible={isWithdrawAmountOpen}
          coin={selectedDepositCoin}
          network={selectedWithdrawNetwork}
          address={withdrawAddress}
          onClose={() => setIsWithdrawAmountOpen(false)}
          onProceedWithdraw={(amt) => {
            setWithdrawAmount(amt);
            setIsWithdrawAmountOpen(false);
            setIsConfirmWithdrawOpen(true);
          }}
        />

        {/* Step 6 (Withdraw Flow): Confirm Order Screen */}
        <ConfirmWithdrawModal
          visible={isConfirmWithdrawOpen}
          coin={selectedDepositCoin}
          network={selectedWithdrawNetwork}
          address={withdrawAddress}
          amount={withdrawAmount}
          onClose={() => setIsConfirmWithdrawOpen(false)}
          onConfirm={() => {
            setIsConfirmWithdrawOpen(false);
            setIsVerifyPasskeyOpen(true);
          }}
        />

        {/* Step 7 (Withdraw Flow): Verify Passkey Modal */}
        <VerifyPasskeyModal
          visible={isVerifyPasskeyOpen}
          onClose={() => setIsVerifyPasskeyOpen(false)}
          onSuccess={() => {
            setIsVerifyPasskeyOpen(false);
            const now = new Date();
            const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
            const feeVal = typeof selectedWithdrawNetwork?.fee === 'number' ? selectedWithdrawNetwork.fee : parseFloat((selectedWithdrawNetwork?.fee as any) || '1.5');
            const newRecord: WithdrawalRecord = {
              id: `tx-${Date.now()}`,
              symbol: selectedDepositCoin?.symbol ?? 'USDT',
              name: selectedDepositCoin?.name ?? 'TetherUS',
              amount: withdrawAmount,
              usdEquivalent: withdrawAmount * (selectedDepositCoin?.symbol === 'BTC' ? 96000 : 1),
              network: selectedWithdrawNetwork?.name ?? 'Tron (TRC20)',
              address: withdrawAddress,
              fee: feeVal,
              status: 'Processing',
              createdAt: formattedDate,
              txId: `${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
              wallet: 'Spot Account',
            };
            addWithdrawalRecord(newRecord);
            setIsWithdrawProcessingOpen(true);
          }}
        />

        {/* Step 8 (Withdraw Flow): Withdrawal Processing Screen */}
        <WithdrawProcessingModal
          visible={isWithdrawProcessingOpen}
          coin={selectedDepositCoin}
          amount={withdrawAmount}
          onClose={() => setIsWithdrawProcessingOpen(false)}
          onViewHistory={() => {
            setIsWithdrawProcessingOpen(false);
            setIsWithdrawHistoryOpen(true);
          }}
        />

        {/* Step 9 (Withdraw Flow): Withdrawal History Screen */}
        <WithdrawHistoryModal
          visible={isWithdrawHistoryOpen}
          onClose={() => setIsWithdrawHistoryOpen(false)}
          onSelectWithdrawal={(record) => {
            setSelectedHistoryRecord(record);
            setIsWithdrawDetailOpen(true);
          }}
        />

        {/* Step 10 (Withdraw Flow): Withdrawal Details Screen */}
        <WithdrawDetailModal
          visible={isWithdrawDetailOpen}
          record={selectedHistoryRecord}
          onClose={() => setIsWithdrawDetailOpen(false)}
        />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
  assetsAccountBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  tabsLeft: {
    flexDirection: 'row',
    gap: 20,
  },
  subTabBtn: {
    position: 'relative',
    paddingBottom: 6,
  },
  subTabTitle: {
    fontSize: 16,
  },
  activeBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#F0B90B',
    borderRadius: 2,
  },
  iconsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconPadding: {
    padding: 2,
  },
  searchBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    padding: 0,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyText: {
    fontSize: 14,
  },
});
