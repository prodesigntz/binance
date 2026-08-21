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
import { usePortfolioStore, type UserHolding } from '../model/usePortfolioStore';
import { AssetsHeader } from './AssetsHeader';
import { AssetsTabStrip } from './AssetsTabStrip';
import { HoldingRow } from './HoldingRow';
import { AddFundsSheet } from './AddFundsSheet';

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
  } = usePortfolioStore();

  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isAddFundsOpen, setIsAddFundsOpen] = React.useState(false);

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
              {/* Sub Tab Strip on VERY TOP (Overview, Funding, Earn, Spot, Futures) */}
              <AssetsTabStrip activeTab={selectedTab} onTabChange={setSelectedTab} />

              {/* Main Total Balance & Quick Actions */}
              <AssetsHeader
                totalUsd={totalUsdBalance}
                btcPrice={btcPrice}
                hideBalance={hideBalance}
                onToggleHideBalance={toggleHideBalance}
                onQuickAction={(action) => {
                  if (action === 'deposit') {
                    setIsAddFundsOpen(true);
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

        {/* Select Deposit Method Bottom Sheet */}
        <AddFundsSheet
          visible={isAddFundsOpen}
          onClose={() => setIsAddFundsOpen(false)}
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
