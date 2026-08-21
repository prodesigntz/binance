import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../app/providers/ThemeProvider';

export interface CoinAsset {
  id: string;
  symbol: string;
  name: string;
  imageUrl?: string;
  category?: 'trending' | 'standard';
}

const ALL_COINS: CoinAsset[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', category: 'trending' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', category: 'trending' },
  { id: 'tether', symbol: 'USDT', name: 'TetherUS', category: 'trending' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', category: 'trending' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', category: 'trending' },
  { id: 'tron', symbol: 'TRX', name: 'TRON', category: 'trending' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', category: 'trending' },
  { id: 'og', symbol: 'OG', name: 'OG', category: 'standard' },
  { id: '1000cat', symbol: '1000CAT', name: "1000*Simons Cat", category: 'standard' },
  { id: '1000cheems', symbol: '1000CHEEMS', name: '1000*cheems.pet', category: 'standard' },
  { id: '1000sats', symbol: '1000SATS', name: '1000*SATS (Ordinals)', category: 'standard' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', category: 'standard' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', category: 'standard' },
];

const HISTORY_TAGS = ['BTC', 'ETH', 'USDT', 'TRX', 'BNB'];

export interface SelectAssetSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelectCoin: (coin: CoinAsset) => void;
}

export function SelectAssetSheet({
  visible,
  onClose,
  onSelectCoin,
}: SelectAssetSheetProps): React.JSX.Element | null {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');

  if (!visible) return null;

  const filteredCoins = ALL_COINS.filter(
    (c) =>
      c.symbol.toLowerCase().includes(search.toLowerCase().trim()) ||
      c.name.toLowerCase().includes(search.toLowerCase().trim())
  );

  const trendingCoins = filteredCoins.filter((c) => c.category === 'trending');
  const otherCoins = filteredCoins.filter((c) => c.category !== 'trending');

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: '#171E26',
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Select Asset</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Search Bar */}
        <View style={[styles.searchBox, { backgroundColor: '#212A34' }]}>
          <Ionicons name="search" size={16} color={colors.iconMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search Coins"
            placeholderTextColor={colors.text2}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={16} color={colors.iconMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* History Tags */}
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text2 }]}>History</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Ionicons name="trash-outline" size={16} color={colors.iconMuted} />
            </TouchableOpacity>
          </View>
          <View style={styles.historyPills}>
            {HISTORY_TAGS.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[styles.historyPill, { backgroundColor: '#212A34' }]}
                onPress={() => setSearch(tag)}
                activeOpacity={0.7}
              >
                <Text style={[styles.pillText, { color: colors.text }]}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Coins List */}
        {(() => {
          type ListItem =
            | { type: 'header'; title: string }
            | { type: 'item'; data: CoinAsset };

          const listData: ListItem[] = [
            ...(trendingCoins.length > 0 ? [{ type: 'header' as const, title: 'Trending' }] : []),
            ...trendingCoins.map((c) => ({ type: 'item' as const, data: c })),
            ...(otherCoins.length > 0 ? [{ type: 'header' as const, title: 'All Coins' }] : []),
            ...otherCoins.map((c) => ({ type: 'item' as const, data: c })),
          ];

          return (
            <FlatList<ListItem>
              data={listData}
              keyExtractor={(item, index) =>
                item.type === 'header' ? `header-${item.title}-${index}` : item.data.id
              }
              renderItem={({ item }) => {
                if (item.type === 'header') {
                  return (
                    <Text style={[styles.sectionTitle, { color: colors.text2, marginVertical: 8 }]}>
                      {item.title}
                    </Text>
                  );
                }

                const coin = item.data;
                return (
                  <TouchableOpacity
                    style={styles.coinRow}
                    onPress={() => onSelectCoin(coin)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.coinLogoFallback}>
                      <Text style={styles.avatarText}>{coin.symbol.slice(0, 2)}</Text>
                    </View>
                    <View style={styles.coinInfo}>
                      <Text style={[styles.coinSymbol, { color: colors.text }]}>{coin.symbol}</Text>
                      <Text style={[styles.coinName, { color: colors.text2 }]}>{coin.name}</Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          );
        })()}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
  },
  backBtn: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 8,
    marginBottom: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  historySection: {
    marginBottom: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  historyPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  historyPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 4,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 24,
  },
  coinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  coinLogoFallback: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0B90B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#0B0F14',
    fontSize: 12,
    fontWeight: '700',
  },
  coinInfo: {},
  coinSymbol: {
    fontSize: 15,
    fontWeight: '700',
  },
  coinName: {
    fontSize: 12,
    marginTop: 2,
  },
});
