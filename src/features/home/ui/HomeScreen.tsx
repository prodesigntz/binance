import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { ScreenLayout } from '../../../shared/layout';
import { useMarkets } from '../../markets/api/useMarkets';
import { CryptoIcon } from '../../../components/CryptoIcon';
import { useNavigation } from '@react-navigation/native';
import { AddFundsSheet } from '../../assets/ui/AddFundsSheet';
import { SelectAssetSheet, type CoinAsset } from '../../assets/ui/SelectAssetSheet';
import { ChooseNetworkSheet, type CryptoNetwork } from '../../assets/ui/ChooseNetworkSheet';
import { DepositDetailModal } from '../../assets/ui/DepositDetailModal';

const { width } = Dimensions.get('window');

// Mini Sparkline SVG Chart Component
function BnbSparklineChart(): React.JSX.Element {
  return (
    <View style={sparklineStyles.container}>
      <Svg width={width * 0.38} height={40} viewBox="0 0 160 40">
        <Defs>
          <LinearGradient id="bnbGlow" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#0ECB81" stopOpacity={0.35} />
            <Stop offset="100%" stopColor="#0ECB81" stopOpacity={0.0} />
          </LinearGradient>
        </Defs>
        <Path
          d="M 0 32 Q 20 28, 40 30 T 80 20 T 120 12 T 160 8 L 160 40 L 0 40 Z"
          fill="url(#bnbGlow)"
        />
        <Path
          d="M 0 32 Q 20 28, 40 30 T 80 20 T 120 12 T 160 8"
          fill="none"
          stroke="#0ECB81"
          strokeWidth="2.5"
        />
      </Svg>
    </View>
  );
}

const sparklineStyles = StyleSheet.create({
  container: {
    marginTop: 8,
    overflow: 'hidden',
  },
});

export function HomeScreen(): React.JSX.Element {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  // Header Segment Control
  const [headerSegment, setHeaderSegment] = useState<'exchange' | 'wallet'>('exchange');

  // Deposit Flow Modals State
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [isSelectAssetOpen, setIsSelectAssetOpen] = useState(false);
  const [isChooseNetworkOpen, setIsChooseNetworkOpen] = useState(false);
  const [isDepositDetailOpen, setIsDepositDetailOpen] = useState(false);
  const [selectedDepositCoin, setSelectedDepositCoin] = useState<CoinAsset | null>(null);
  const [selectedDepositNetwork, setSelectedDepositNetwork] = useState<CryptoNetwork | null>(null);

  // Watchlist Category Tabs
  const [activeMarketTab, setActiveMarketTab] = useState<'Hot' | 'Favorites' | 'TradFi' | 'Alpha' | 'New' | 'Gainers'>('Hot');
  const [activeSubTab, setActiveSubTab] = useState<'Crypto' | 'Futures' | 'Stocks'>('Crypto');

  // Discover Feed Tabs
  const [activeFeedTab, setActiveFeedTab] = useState<'Discover' | 'Following' | 'Campaign' | 'Smart Money' | 'Announcements'>('Discover');

  // Live Crypto Markets Data
  const { data: marketsList = [] } = useMarkets('usd', 10, 1);

  // Default fallback hot market list if loading
  const hotCoins = marketsList.length > 0 ? marketsList.slice(0, 5) : [
    { id: 'binancecoin', symbol: 'BNB', name: 'BNB', current_price: 661.55, price_change_percentage_24h: 5.77 },
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', current_price: 74778.81, price_change_percentage_24h: 7.36 },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', current_price: 2349.89, price_change_percentage_24h: 3.61 },
    { id: 'solana', symbol: 'SOL', name: 'Solana', current_price: 89.23, price_change_percentage_24h: 4.62 },
    { id: 'ripple', symbol: 'XRP', name: 'XRP', current_price: 1.2863, price_change_percentage_24h: 15.76 },
  ];

  const handleCoinPress = (coinId: string) => {
    navigation.navigate('Markets', {
      screen: 'CoinDetails',
      params: { coinId },
    });
  };

  return (
    <ScreenLayout inTabNavigator>
      <View style={[styles.container, { backgroundColor: '#141921' }]}>
        {/* ================= HEADER BAR ================= */}
        <View style={styles.headerBar}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.iconPadding} activeOpacity={0.7}>
              <Ionicons name="menu-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconPadding} activeOpacity={0.7}>
              <Ionicons name="sparkles" size={18} color="#F0B90B" />
            </TouchableOpacity>
          </View>

          {/* Segmented Control Pill: [ Exchange | Wallet ] */}
          <View style={styles.segmentedPill}>
            <TouchableOpacity
              style={[
                styles.segmentBtn,
                headerSegment === 'exchange' && styles.segmentBtnActive,
              ]}
              onPress={() => setHeaderSegment('exchange')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.segmentText,
                  headerSegment === 'exchange' && styles.segmentTextActive,
                ]}
              >
                Exchange
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.segmentBtn,
                headerSegment === 'wallet' && styles.segmentBtnActive,
              ]}
              onPress={() => setHeaderSegment('wallet')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.segmentText,
                  headerSegment === 'wallet' && styles.segmentTextActive,
                ]}
              >
                Wallet
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconPadding} activeOpacity={0.7}>
              <Ionicons name="scan-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconPadding} activeOpacity={0.7}>
              <View style={styles.badgeWrapper}>
                <Ionicons name="chatbubble-ellipses-outline" size={20} color="#FFFFFF" />
                <View style={styles.badgePill}>
                  <Text style={styles.badgeText}>99+</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* ================= SEARCH BAR ================= */}
          <TouchableOpacity style={styles.searchBarBox} activeOpacity={0.8}>
            <View style={styles.searchLeftRow}>
              <Text style={styles.flameText}>🔥</Text>
              <Text style={styles.searchPlaceholderText}>METAB hot search</Text>
            </View>
            <Ionicons name="search" size={16} color="#848E9C" />
          </TouchableOpacity>

          {/* ================= HOLDINGS VALUE & ADD FUNDS ================= */}
          <View style={styles.balanceHeaderSection}>
            <View style={styles.balanceLeftCol}>
              <TouchableOpacity style={styles.estTitleRow} activeOpacity={0.7}>
                <Text style={styles.estTitleText}>Est. Total Value (USDT)</Text>
                <Ionicons name="chevron-up" size={14} color="#848E9C" style={{ marginLeft: 4 }} />
              </TouchableOpacity>

              <Text style={styles.homeMainBalance}>100.63</Text>
              <Text style={styles.homeUsdApprox}>≈ $100.63</Text>

              <TouchableOpacity style={styles.todayPnlRow} activeOpacity={0.7}>
                <Text style={styles.todayPnlLabel}>Today's PNL</Text>
                <Text style={styles.todayPnlValue}>+0.000027 USDT(+0.00%)</Text>
                <Ionicons name="chevron-down" size={12} color="#0ECB81" style={{ marginLeft: 2 }} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.homeAddFundsBtn}
              onPress={() => setIsAddFundsOpen(true)}
              activeOpacity={0.85}
            >
              <Text style={styles.homeAddFundsText}>Add Funds</Text>
            </TouchableOpacity>
          </View>

          {/* ================= 2-ROW QUICK ACTIONS GRID ================= */}
          <View style={styles.quickActionsGrid}>
            {/* Row 1: Referral, Spot, Rewards Hub, Earn */}
            <View style={styles.quickRow}>
              <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
                <View style={styles.actionIconBox}>
                  <Ionicons name="person-add-outline" size={22} color="#F0B90B" />
                </View>
                <Text style={styles.actionLabel}>Referral</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
                <View style={styles.actionIconBox}>
                  <MaterialCommunityIcons name="target" size={22} color="#F0B90B" />
                </View>
                <Text style={styles.actionLabel}>Spot</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
                <View style={styles.actionIconBox}>
                  <MaterialCommunityIcons name="ticket-percent-outline" size={22} color="#F0B90B" />
                </View>
                <Text style={styles.actionLabel}>Rewards Hub</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
                <View style={styles.actionIconBox}>
                  <MaterialCommunityIcons name="piggy-bank-outline" size={22} color="#F0B90B" />
                </View>
                <Text style={styles.actionLabel}>Earn</Text>
              </TouchableOpacity>
            </View>

            {/* Row 2: P2P, Loans, More */}
            <View style={styles.quickRowLeft}>
              <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
                <View style={styles.actionIconBox}>
                  <MaterialCommunityIcons name="account-switch-outline" size={22} color="#F0B90B" />
                </View>
                <Text style={styles.actionLabel}>P2P</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
                <View style={styles.actionIconBox}>
                  <MaterialCommunityIcons name="hand-coin-outline" size={22} color="#F0B90B" />
                </View>
                <Text style={styles.actionLabel}>Loans</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
                <View style={styles.actionIconBox}>
                  <Ionicons name="grid-outline" size={20} color="#F0B90B" />
                </View>
                <Text style={styles.actionLabel}>More</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ================= ANNOUNCEMENT BANNER CARD ================= */}
          <View style={styles.wotdCard}>
            <View style={styles.wotdHeader}>
              <Text style={styles.wotdTitle}>ETH Option Trading Cup</Text>
              <TouchableOpacity style={{ padding: 2 }} activeOpacity={0.7}>
                <Ionicons name="close" size={16} color="#848E9C" />
              </TouchableOpacity>
            </View>

            <View style={styles.wotdBody}>
              <View style={styles.wotdIconBox}>
                <MaterialCommunityIcons name="trophy-outline" size={20} color="#F0B90B" />
              </View>
              <Text style={styles.wotdDesc}>Share a Prize Pool of 20,000 USDT!</Text>
              <TouchableOpacity style={styles.joinBtn} activeOpacity={0.8}>
                <Text style={styles.joinBtnText}>Join</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.paginationDots}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>

          {/* ================= FEATURED DUAL CARDS ROW ================= */}
          <View style={styles.dualCardsRow}>
            {/* Left Card: Binance Card */}
            <View style={styles.binanceCardWidget}>
              <TouchableOpacity style={styles.widgetTitleRow} activeOpacity={0.7}>
                <Text style={styles.widgetTitle}>Binance Card</Text>
                <Ionicons name="chevron-forward" size={14} color="#848E9C" />
              </TouchableOpacity>

              <View style={styles.miniCardGraphic}>
                <Text style={styles.miniCardLogoText}>BINANCE</Text>
              </View>

              <Text style={styles.cardStatusText}>Your card is ready</Text>

              <TouchableOpacity style={styles.viewCardsBtn} activeOpacity={0.8}>
                <Text style={styles.viewCardsBtnText}>View my cards</Text>
              </TouchableOpacity>
            </View>

            {/* Right Card: BNB Live Price Widget */}
            <TouchableOpacity
              style={styles.bnbWidget}
              onPress={() => handleCoinPress('binancecoin')}
              activeOpacity={0.85}
            >
              <View style={styles.bnbWidgetHeader}>
                <CryptoIcon symbol="BNB" size={22} />
                <Text style={styles.bnbSymbolText}>BNB</Text>
              </View>

              <Text style={styles.bnbPriceText}>661.55</Text>
              <Text style={styles.bnbChangeText}>▲ 5.77%</Text>

              <BnbSparklineChart />
            </TouchableOpacity>
          </View>

          {/* ================= MARKETS & WATCHLIST SECTION ================= */}
          <View style={styles.marketsSection}>
            {/* Main Category Tabs */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.marketTabsRow}>
              {(['Favorites', 'Hot', 'TradFi', 'Alpha', 'New', 'Gainers'] as const).map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={styles.marketTabBtn}
                  onPress={() => setActiveMarketTab(tab)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.marketTabText,
                      activeMarketTab === tab && styles.marketTabTextActive,
                    ]}
                  >
                    {tab}
                  </Text>
                  {activeMarketTab === tab && <View style={styles.marketActiveLine} />}
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Sub Category Tabs */}
            <View style={styles.subTabsRow}>
              {(['Crypto', 'Futures', 'Stocks'] as const).map((sub) => (
                <TouchableOpacity
                  key={sub}
                  onPress={() => setActiveSubTab(sub)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.subTabText,
                      activeSubTab === sub && styles.subTabTextActive,
                    ]}
                  >
                    {sub}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Table Header Row */}
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.colHeader, { flex: 1.4 }]}>Name</Text>
              <Text style={[styles.colHeader, { textAlign: 'right', flex: 1 }]}>Last Price</Text>
              <Text style={[styles.colHeader, { textAlign: 'right', flex: 1 }]}>24h chg%</Text>
            </View>

            {/* Market Coin List Rows */}
            {hotCoins.map((coin) => {
              const symbol = coin.symbol.toUpperCase();
              const price = coin.current_price ?? 0;
              const priceStr = price > 100
                ? price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : price.toString();
              const changeVal = coin.price_change_percentage_24h ?? 5.77;
              const isPositive = changeVal >= 0;
              const isHot = symbol === 'BNB' || symbol === 'BTC' || symbol === 'ETH';

              return (
                <TouchableOpacity
                  key={coin.id}
                  style={styles.coinRow}
                  onPress={() => handleCoinPress(coin.id)}
                  activeOpacity={0.7}
                >
                  {/* Left: Coin Icon & Name */}
                  <View style={styles.coinLeftCol}>
                    <CryptoIcon symbol={symbol} size={28} />
                    <View style={{ marginLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.coinSymbolText}>{symbol}</Text>
                      {isHot && <Text style={styles.flameIcon}>🔥</Text>}
                    </View>
                  </View>

                  {/* Middle: Last Price & USD subtext */}
                  <View style={styles.coinMiddleCol}>
                    <Text style={styles.coinPriceNum}>{priceStr}</Text>
                    <Text style={styles.coinUsdSub}>${priceStr}</Text>
                  </View>

                  {/* Right: 24h Change Pill */}
                  <View style={styles.coinRightCol}>
                    <View
                      style={[
                        styles.changePill,
                        { backgroundColor: isPositive ? '#0ECB81' : '#F6465D' },
                      ]}
                    >
                      <Text style={styles.changePillText}>
                        {isPositive ? '+' : ''}{changeVal.toFixed(2)}%
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* View More Button */}
            <TouchableOpacity style={styles.viewMoreBtn} activeOpacity={0.7}>
              <Text style={styles.viewMoreText}>View more</Text>
            </TouchableOpacity>
          </View>

          {/* ================= DISCOVER / FEED SECTION ================= */}
          <View style={styles.discoverSection}>
            {/* Feed Category Navigation */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.feedTabsRow}>
              {(['Discover', 'Following', 'Campaign', 'Smart Money', 'Announcements'] as const).map((feedTab) => (
                <TouchableOpacity
                  key={feedTab}
                  style={styles.feedTabBtn}
                  onPress={() => setActiveFeedTab(feedTab)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.feedTabText,
                      activeFeedTab === feedTab && styles.feedTabTextActive,
                    ]}
                  >
                    {feedTab}
                  </Text>
                  {activeFeedTab === feedTab && <View style={styles.feedActiveLine} />}
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.feedFilterBtn} activeOpacity={0.7}>
                <Ionicons name="menu-outline" size={16} color="#848E9C" />
              </TouchableOpacity>
            </ScrollView>

            {/* Top Traders / Copy Trading Horizontal Carousel */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tradersCarousel}>
              <TouchableOpacity style={styles.traderCardPurple} activeOpacity={0.8}>
                <View style={styles.traderAvatarCircle}>
                  <Text style={styles.traderAvatarText}>+4062</Text>
                </View>
                <Text style={styles.traderCardText} numberOfLines={1}>
                  $1000 to $100,000 Crypto Trade...
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.traderCardPurple} activeOpacity={0.8}>
                <View style={styles.traderAvatarCircle}>
                  <Text style={styles.traderAvatarText}>+1067</Text>
                </View>
                <Text style={styles.traderCardText} numberOfLines={1}>
                  332 people are trading with...
                </Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Post 1: _Ram */}
            <View style={styles.postCard}>
              <View style={styles.postHeader}>
                <View style={styles.userAvatarCircle}>
                  <Ionicons name="person" size={16} color="#FFFFFF" />
                </View>
                <View style={styles.userInfoCol}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.userNameText}>_Ram</Text>
                    <Ionicons name="checkmark-circle" size={14} color="#F0B90B" style={{ marginLeft: 4 }} />
                    <Text style={styles.postDotSep}>•</Text>
                    <Text style={styles.postTimeText}>29 Mordad</Text>
                  </View>
                </View>
                <TouchableOpacity style={{ padding: 4 }} activeOpacity={0.7}>
                  <Ionicons name="close" size={16} color="#848E9C" />
                </TouchableOpacity>
              </View>

              <Text style={styles.postBodyText}>
                So it's started again ? Just because you missed this pump, then yolo move? All in , lmao{'\n'}
                Your mind will be blown the second that same move correct, even just a little. That dopamine pushing you to go all in anyway will then calm yo...
              </Text>

              {/* Trade PNL & Tag Pills */}
              <View style={styles.pnlBannerRow}>
                <View style={styles.pnlBanner}>
                  <Text style={styles.pnlBannerLabel}>365D Trade PNL</Text>
                  <Text style={styles.pnlBannerValue}>-$1,086.13</Text>
                </View>
                <View style={styles.cryptoTagPill}>
                  <Text style={styles.cryptoTagText}>BTC <Text style={{ color: '#0ECB81' }}>+7.33%</Text></Text>
                </View>
              </View>

              {/* Post Interaction Footer */}
              <View style={styles.postFooterActions}>
                <TouchableOpacity style={styles.actionBtnRow} activeOpacity={0.7}>
                  <Ionicons name="chatbox-outline" size={15} color="#848E9C" />
                  <Text style={styles.actionCountText}>5</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionBtnRow} activeOpacity={0.7}>
                  <Ionicons name="repeat-outline" size={16} color="#848E9C" />
                  <Text style={styles.actionCountText}>2</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionBtnRow} activeOpacity={0.7}>
                  <Ionicons name="thumbs-up-outline" size={15} color="#848E9C" />
                  <Text style={styles.actionCountText}>25</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionBtnRow} activeOpacity={0.7}>
                  <Ionicons name="bar-chart-outline" size={15} color="#848E9C" />
                  <Text style={styles.actionCountText}>36.6K</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ padding: 2 }} activeOpacity={0.7}>
                  <Feather name="share" size={15} color="#848E9C" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Post 2: Paxton_ */}
            <View style={styles.postCard}>
              <View style={styles.postHeader}>
                <View style={[styles.userAvatarCircle, { backgroundColor: '#3A4454' }]}>
                  <Ionicons name="person" size={16} color="#FFFFFF" />
                </View>
                <View style={styles.userInfoCol}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.userNameText}>Paxton_</Text>
                    <Ionicons name="checkmark-circle" size={14} color="#F0B90B" style={{ marginLeft: 4 }} />
                    <Text style={styles.postDotSep}>•</Text>
                    <Text style={styles.postTimeText}>28 Mordad</Text>
                  </View>
                </View>
                <TouchableOpacity style={{ padding: 4 }} activeOpacity={0.7}>
                  <Ionicons name="close" size={16} color="#848E9C" />
                </TouchableOpacity>
              </View>

              <Text style={styles.postBodyText}>
                Prediction markets are becoming an interesting way to measure public expectations.{'\n'}
                <Text style={{ color: '#F0B90B' }}>@Polymarket</Text> has grown to around 250K to 500K monthly active traders, with 17M+ monthly visits and roughly $18B in projected 2025 trading ...
              </Text>

              {/* Embedded Polymarket Card */}
              <View style={styles.polymarketCard}>
                <Text style={styles.polymarketTitle}>Polymarket</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* ================= FLOATING ACTION BUTTON (FAB) ================= */}
        <TouchableOpacity style={styles.fabBtn} activeOpacity={0.85}>
          <Ionicons name="add" size={28} color="#0B0F14" />
        </TouchableOpacity>

        {/* ================= DEPOSIT FLOW MODALS ================= */}
        <AddFundsSheet
          visible={isAddFundsOpen}
          onClose={() => setIsAddFundsOpen(false)}
          onSelectMethod={(method) => {
            if (method === 'deposit') {
              setIsSelectAssetOpen(true);
            }
          }}
        />

        <SelectAssetSheet
          visible={isSelectAssetOpen}
          onClose={() => setIsSelectAssetOpen(false)}
          onSelectCoin={(coin) => {
            setSelectedDepositCoin(coin);
            setIsSelectAssetOpen(false);
            setIsChooseNetworkOpen(true);
          }}
        />

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
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 48,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 14,
  },
  iconPadding: {
    padding: 2,
  },
  segmentedPill: {
    flexDirection: 'row',
    backgroundColor: '#212A34',
    borderRadius: 16,
    padding: 2,
  },
  segmentBtn: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
  },
  segmentBtnActive: {
    backgroundColor: '#2B3543',
  },
  segmentText: {
    color: '#848E9C',
    fontSize: 13,
    fontWeight: '500',
  },
  segmentTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  badgeWrapper: {
    position: 'relative',
  },
  badgePill: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: '#F0B90B',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  badgeText: {
    color: '#0B0F14',
    fontSize: 9,
    fontWeight: '800',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#212A34',
    height: 38,
    borderRadius: 19,
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 16,
    paddingHorizontal: 14,
  },
  searchLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flameText: {
    fontSize: 14,
  },
  searchPlaceholderText: {
    color: '#848E9C',
    fontSize: 13,
    fontWeight: '500',
  },
  balanceHeaderSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  balanceLeftCol: {
    flex: 1,
  },
  estTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  estTitleText: {
    color: '#848E9C',
    fontSize: 13,
    fontWeight: '500',
  },
  homeMainBalance: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  homeUsdApprox: {
    color: '#848E9C',
    fontSize: 13,
    marginTop: 2,
    marginBottom: 6,
  },
  todayPnlRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  todayPnlLabel: {
    color: '#848E9C',
    fontSize: 12,
    marginRight: 6,
  },
  todayPnlValue: {
    color: '#0ECB81',
    fontSize: 12,
    fontWeight: '600',
  },
  homeAddFundsBtn: {
    backgroundColor: '#F0B90B',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  homeAddFundsText: {
    color: '#0B0F14',
    fontSize: 14,
    fontWeight: '700',
  },
  quickActionsGrid: {
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 16,
  },
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickRowLeft: {
    flexDirection: 'row',
    gap: 32,
  },
  actionItem: {
    alignItems: 'center',
    width: 68,
  },
  actionIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#212A34',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  actionLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  wotdCard: {
    backgroundColor: '#1E2630',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  wotdHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  wotdTitle: {
    color: '#848E9C',
    fontSize: 12,
    fontWeight: '500',
  },
  wotdBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  wotdIconBox: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#2B3543',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  wotdDesc: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  joinBtn: {
    backgroundColor: '#2B3543',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  joinBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3A4454',
  },
  dotActive: {
    width: 12,
    backgroundColor: '#848E9C',
  },
  dualCardsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 20,
  },
  binanceCardWidget: {
    flex: 1,
    backgroundColor: '#1E2630',
    borderRadius: 12,
    padding: 14,
    justifyContent: 'space-between',
  },
  widgetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  widgetTitle: {
    color: '#848E9C',
    fontSize: 12,
    fontWeight: '600',
  },
  miniCardGraphic: {
    height: 36,
    backgroundColor: '#0B0F14',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  miniCardLogoText: {
    color: '#F0B90B',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  cardStatusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 12,
  },
  viewCardsBtn: {
    backgroundColor: '#2B3543',
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  viewCardsBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  bnbWidget: {
    flex: 1,
    backgroundColor: '#1E2630',
    borderRadius: 12,
    padding: 14,
  },
  bnbWidgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  bnbSymbolText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  bnbPriceText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 2,
  },
  bnbChangeText: {
    color: '#0ECB81',
    fontSize: 12,
    fontWeight: '600',
  },
  marketsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  marketTabsRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 12,
  },
  marketTabBtn: {
    position: 'relative',
    paddingBottom: 6,
  },
  marketTabText: {
    color: '#848E9C',
    fontSize: 15,
    fontWeight: '500',
  },
  marketTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  marketActiveLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#F0B90B',
    borderRadius: 2,
  },
  subTabsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  subTabText: {
    color: '#848E9C',
    fontSize: 13,
    fontWeight: '500',
  },
  subTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  colHeader: {
    color: '#848E9C',
    fontSize: 12,
  },
  coinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  coinLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1.4,
  },
  coinSymbolText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  flameIcon: {
    fontSize: 12,
    marginLeft: 4,
  },
  coinMiddleCol: {
    flex: 1,
    alignItems: 'flex-end',
  },
  coinPriceNum: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  coinUsdSub: {
    color: '#848E9C',
    fontSize: 11,
    marginTop: 2,
  },
  coinRightCol: {
    flex: 1,
    alignItems: 'flex-end',
  },
  changePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center',
  },
  changePillText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  viewMoreBtn: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  viewMoreText: {
    color: '#848E9C',
    fontSize: 13,
    fontWeight: '500',
  },
  discoverSection: {
    paddingHorizontal: 16,
  },
  feedTabsRow: {
    flexDirection: 'row',
    gap: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  feedTabBtn: {
    position: 'relative',
    paddingBottom: 6,
  },
  feedTabText: {
    color: '#848E9C',
    fontSize: 15,
    fontWeight: '500',
  },
  feedTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  feedActiveLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#F0B90B',
    borderRadius: 2,
  },
  feedFilterBtn: {
    paddingLeft: 8,
  },
  tradersCarousel: {
    gap: 12,
    marginBottom: 20,
  },
  traderCardPurple: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#351F65',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 10,
  },
  traderAvatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#5C38B8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  traderAvatarText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  traderCardText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  postCard: {
    backgroundColor: '#1E2630',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userAvatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2B3543',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userInfoCol: {
    flex: 1,
  },
  userNameText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  postDotSep: {
    color: '#848E9C',
    marginHorizontal: 6,
    fontSize: 12,
  },
  postTimeText: {
    color: '#848E9C',
    fontSize: 12,
  },
  postBodyText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },
  pnlBannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  pnlBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#281E26',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 8,
  },
  pnlBannerLabel: {
    color: '#848E9C',
    fontSize: 12,
  },
  pnlBannerValue: {
    color: '#F6465D',
    fontSize: 12,
    fontWeight: '700',
  },
  cryptoTagPill: {
    backgroundColor: '#2B3543',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  cryptoTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  postFooterActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  actionBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionCountText: {
    color: '#848E9C',
    fontSize: 12,
  },
  polymarketCard: {
    height: 120,
    backgroundColor: '#000000',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2B3543',
    marginTop: 8,
  },
  polymarketTitle: {
    color: '#3B82F6',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },
  fabBtn: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F0B90B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
});
