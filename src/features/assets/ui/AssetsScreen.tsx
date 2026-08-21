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
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { ScreenLayout } from '../../../shared/layout';
import { useMarkets } from '../../markets/api/useMarkets';
import { usePortfolioStore, type UserHolding } from '../model/usePortfolioStore';
import { AssetsHeader } from './AssetsHeader';
import { AssetsTabStrip } from './AssetsTabStrip';
import { AssetAllocationCard, type AllocationItem } from './AssetAllocationCard';
import { HoldingRow } from './HoldingRow';

export function AssetsScreen(): React.JSX.Element {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();

  const {
    hideBalance,
    hideSmallBalances,
    selectedTab,
    searchQuery,
    holdings,
    toggleHideBalance,
    toggleHideSmallBalances,
    setSelectedTab,
    setSearchQuery,
  } = usePortfolioStore();

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
      let change24h = 0;
      let imageUrl: string | undefined;

      // Special case for stablecoins if API doesn't return them
      if (h.symbol === 'USDT' || h.symbol === 'USDC') {
        unitPrice = 1.0;
      }

      const live = marketMap.get(h.symbol.toLowerCase()) ?? marketMap.get(h.id.toLowerCase());
      if (live) {
        if (live.price > 0) unitPrice = live.price;
        change24h = live.change24h;
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

  // Allocation Items calculation
  const allocations = useMemo<AllocationItem[]>(() => {
    if (totalUsdBalance <= 0) return [];
    return holdingsWithValuation
      .map((h) => ({
        symbol: h.symbol,
        color: h.color,
        valueUsd: h.totalValueUsd,
        percent: (h.totalValueUsd / totalUsdBalance) * 100,
      }))
      .filter((item) => item.percent >= 0.5)
      .sort((a, b) => b.valueUsd - a.valueUsd);
  }, [holdingsWithValuation, totalUsdBalance]);

  // Filtered Holdings according to Tab, Small Balances, and Search Query
  const filteredHoldings = useMemo(() => {
    return holdingsWithValuation.filter((h) => {
      // Tab filter
      if (selectedTab !== 'overview' && h.category !== selectedTab) {
        return false;
      }
      // Small balances filter (< $1.00)
      if (hideSmallBalances && h.totalValueUsd < 1.0) {
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
              {/* Main Total Balance & Quick Actions */}
              <AssetsHeader
                totalUsd={totalUsdBalance}
                btcPrice={btcPrice}
                hideBalance={hideBalance}
                onToggleHideBalance={toggleHideBalance}
              />

              {/* Sub Tab Strip (Overview, Spot, Futures, etc.) */}
              <AssetsTabStrip activeTab={selectedTab} onTabChange={setSelectedTab} />

              {/* Portfolio Asset Allocation Visualizer */}
              <AssetAllocationCard allocations={allocations} hideBalance={hideBalance} />

              {/* Filter Controls Row */}
              <View style={styles.filterRow}>
                <TouchableOpacity
                  style={styles.hideSmallToggle}
                  onPress={toggleHideSmallBalances}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.checkbox,
                      {
                        borderColor: hideSmallBalances ? colors.primary : colors.border,
                        backgroundColor: hideSmallBalances ? colors.primary : 'transparent',
                      },
                    ]}
                  >
                    {hideSmallBalances && (
                      <Ionicons name="checkmark" size={12} color="#0B0F14" />
                    )}
                  </View>
                  <Text style={[styles.filterText, { color: colors.text2 }]}>
                    Hide small balances (&lt;$1)
                  </Text>
                </TouchableOpacity>

                {/* Inline Ticker Search */}
                <View style={[styles.searchBox, { backgroundColor: colors.card2 }]}>
                  <Ionicons name="search" size={14} color={colors.iconMuted} />
                  <TextInput
                    style={[styles.searchInput, { color: colors.text }]}
                    placeholder="Search coin"
                    placeholderTextColor={colors.text2}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                      <Ionicons name="close-circle" size={14} color={colors.iconMuted} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
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
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 4,
  },
  hideSmallToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  filterText: {
    fontSize: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 10,
    width: 130,
    gap: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
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
