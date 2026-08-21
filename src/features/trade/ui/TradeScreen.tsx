import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import Svg, { Path, Rect, Line, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { ScreenLayout } from '../../../shared/layout';
import { CryptoIcon } from '../../../components/CryptoIcon';
import { usePortfolioStore } from '../../assets/model/usePortfolioStore';

const { width } = Dimensions.get('window');

export type TradeTabId = 'buysell' | 'spot' | 'stocks' | 'p2p' | 'alpha';

// Interactive Candlestick Chart Component for Spot Trading
function CandlestickChart(): React.JSX.Element {
  // Sample candles (open, high, low, close)
  const candles = [
    { x: 10, o: 62000, h: 64000, l: 61000, c: 63500 },
    { x: 30, o: 63500, h: 66000, l: 63000, c: 65800 },
    { x: 50, o: 65800, h: 68000, l: 65000, c: 67200 },
    { x: 70, o: 67200, h: 72000, l: 66500, c: 71500 },
    { x: 90, o: 71500, h: 74000, l: 70000, c: 73800 },
    { x: 110, o: 73800, h: 82850, l: 73000, c: 81200 },
    { x: 130, o: 81200, h: 82000, l: 62000, c: 64000 },
    { x: 150, o: 64000, h: 66000, l: 57800, c: 59000 },
    { x: 170, o: 59000, h: 63000, l: 58500, c: 62500 },
    { x: 190, o: 62500, h: 67000, l: 62000, c: 66800 },
    { x: 210, o: 66800, h: 71000, l: 66000, c: 70200 },
    { x: 230, o: 70200, h: 75000, l: 69500, c: 74818.54 },
  ];

  const minP = 56000;
  const maxP = 85000;
  const chartH = 140;

  const getY = (price: number) => {
    return chartH - ((price - minP) / (maxP - minP)) * chartH;
  };

  return (
    <View style={chartStyles.container}>
      <Svg width={width - 40} height={160} viewBox="0 0 250 160">
        {/* Grid lines */}
        <Line x1="0" y1="40" x2="250" y2="40" stroke="rgba(255,255,255,0.06)" strokeDasharray="3,3" />
        <Line x1="0" y1="80" x2="250" y2="80" stroke="rgba(255,255,255,0.06)" strokeDasharray="3,3" />
        <Line x1="0" y1="120" x2="250" y2="120" stroke="rgba(255,255,255,0.06)" strokeDasharray="3,3" />

        {/* MA Lines */}
        <Path d="M 10 110 Q 70 80, 110 30 T 170 120 T 230 45" fill="none" stroke="#F0B90B" strokeWidth="1.5" />
        <Path d="M 10 120 Q 70 100, 110 50 T 170 130 T 230 65" fill="none" stroke="#E6007A" strokeWidth="1.5" />
        <Path d="M 10 130 Q 70 110, 110 70 T 170 125 T 230 85" fill="none" stroke="#8A2BE2" strokeWidth="1.5" />

        {/* Candles */}
        {candles.map((c, idx) => {
          const isBull = c.c >= c.o;
          const color = isBull ? '#0ECB81' : '#F6465D';
          const topY = getY(Math.max(c.o, c.c));
          const botY = getY(Math.min(c.o, c.c));
          const height = Math.max(2, botY - topY);
          const highY = getY(c.h);
          const lowY = getY(c.l);

          return (
            <React.Fragment key={idx}>
              {/* Wick */}
              <Line x1={c.x} y1={highY} x2={c.x} y2={lowY} stroke={color} strokeWidth="1.2" />
              {/* Candle Body */}
              <Rect x={c.x - 3.5} y={topY} width="7" height={height} fill={color} rx="1" />
            </React.Fragment>
          );
        })}
      </Svg>

      <View style={chartStyles.priceLabelsCol}>
        <Text style={chartStyles.priceLabel}>84,102.50</Text>
        <Text style={chartStyles.priceLabel}>78,591.53</Text>
        <Text style={[chartStyles.priceLabel, { color: '#0ECB81', fontWeight: '700' }]}>74,818.54</Text>
        <Text style={chartStyles.priceLabel}>67,569.62</Text>
        <Text style={chartStyles.priceLabel}>56,547.69</Text>
      </View>
    </View>
  );
}

const chartStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  priceLabelsCol: {
    justifyContent: 'space-between',
    height: 140,
    paddingLeft: 4,
  },
  priceLabel: {
    color: '#848E9C',
    fontSize: 10,
  },
});

// Stock Area Chart Component
function StockAreaChart(): React.JSX.Element {
  return (
    <View style={stockChartStyles.container}>
      <Svg width={width - 40} height={130} viewBox="0 0 260 130">
        <Defs>
          <LinearGradient id="stockGlow" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#0ECB81" stopOpacity={0.35} />
            <Stop offset="100%" stopColor="#0ECB81" stopOpacity={0.0} />
          </LinearGradient>
        </Defs>
        <Path
          d="M 0 60 Q 30 100, 60 110 T 120 70 T 180 20 T 260 25 L 260 130 L 0 130 Z"
          fill="url(#stockGlow)"
        />
        <Path
          d="M 0 60 Q 30 100, 60 110 T 120 70 T 180 20 T 260 25"
          fill="none"
          stroke="#0ECB81"
          strokeWidth="2"
        />
      </Svg>

      <View style={stockChartStyles.labelsCol}>
        <Text style={stockChartStyles.label}>976.66</Text>
        <Text style={stockChartStyles.label}>965.13</Text>
        <Text style={stockChartStyles.label}>942.07</Text>
        <Text style={stockChartStyles.label}>919.01</Text>
      </View>
    </View>
  );
}

const stockChartStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  labelsCol: {
    justifyContent: 'space-between',
    height: 120,
    paddingLeft: 4,
  },
  label: {
    color: '#848E9C',
    fontSize: 10,
  },
});

export function TradeScreen(): React.JSX.Element {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const holdings = usePortfolioStore((state) => state.holdings);

  // Active Trade Tab (Buy/Sell, Spot, Stocks, P2P, Alpha)
  const [activeTab, setActiveTab] = useState<TradeTabId>('buysell');

  // Convert (Buy/Sell) State
  const [convertFromCoin, setConvertFromCoin] = useState('USDT');
  const [convertToCoin, setConvertToCoin] = useState('TRX');
  const [convertAmount, setConvertAmount] = useState('');

  // Spot State
  const [spotTradeMode, setSpotTradeMode] = useState<'buy' | 'sell'>('buy');
  const [spotOrderType, setSpotOrderType] = useState<'Market' | 'Limit'>('Market');
  const [spotAmount, setSpotAmount] = useState('');

  // Stocks State
  const [stockTradeMode, setStockTradeMode] = useState<'buy' | 'sell'>('buy');
  const [stockAmount, setStockAmount] = useState('');

  // Find user balance for USDT
  const usdtHolding = holdings.find((h) => h.symbol === 'USDT');
  const availableUsdt = usdtHolding?.amount ?? 100.62976261;

  const handleMaxConvert = () => {
    setConvertAmount(availableUsdt.toString());
  };

  return (
    <ScreenLayout inTabNavigator>
      <View style={[styles.container, { backgroundColor: '#141921' }]}>
        {/* ================= PRIMARY NAVIGATION TABS ================= */}
        <View style={styles.topTabsBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScrollRow}>
            {(
              [
                { id: 'buysell', label: 'Buy/Sell' },
                { id: 'spot', label: 'Spot' },
                { id: 'stocks', label: 'Stocks' },
                { id: 'p2p', label: 'P2P' },
                { id: 'alpha', label: 'Alpha' },
              ] as const
            ).map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id)}
                  style={styles.tabBtn}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.tabText,
                      isActive && styles.tabTextActive,
                    ]}
                  >
                    {tab.label}
                  </Text>
                  {isActive && <View style={styles.tabActiveIndicator} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity style={styles.topRightMenuBtn} activeOpacity={0.7}>
            <Ionicons name="menu-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* ================= TAB CONTENT ================= */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* ================= 1. BUY / SELL (INSTANT CONVERT) ================= */}
          {activeTab === 'buysell' && (
            <View style={styles.convertContainer}>
              {/* Sub Header Bar */}
              <View style={styles.convertSubHeader}>
                <TouchableOpacity style={styles.instantPill} activeOpacity={0.7}>
                  <Text style={styles.instantText}>Instant</Text>
                  <Ionicons name="caret-down" size={12} color="#FFFFFF" style={{ marginLeft: 4 }} />
                </TouchableOpacity>

                <TouchableOpacity style={{ padding: 4 }} activeOpacity={0.7}>
                  <Ionicons name="document-text-outline" size={20} color="#848E9C" />
                </TouchableOpacity>
              </View>

              {/* From Card Box */}
              <View style={styles.convertCard}>
                <View style={styles.convertCardHeader}>
                  <Text style={styles.convertCardLabel}>From</Text>
                  <View style={styles.walletBalanceRow}>
                    <Ionicons name="wallet-outline" size={14} color="#848E9C" style={{ marginRight: 4 }} />
                    <Text style={styles.balanceText}>{availableUsdt.toFixed(8)} USDT</Text>
                    <TouchableOpacity activeOpacity={0.7} style={{ marginLeft: 4 }}>
                      <Ionicons name="add-circle-outline" size={16} color="#848E9C" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.convertInputRow}>
                  <TouchableOpacity style={styles.coinSelectPill} activeOpacity={0.7}>
                    <CryptoIcon symbol={convertFromCoin} size={26} />
                    <Text style={styles.coinSelectText}>{convertFromCoin}</Text>
                    <Ionicons name="caret-down" size={12} color="#FFFFFF" />
                  </TouchableOpacity>

                  <View style={styles.inputMaxCol}>
                    <TextInput
                      style={styles.convertTextInput}
                      placeholder="> 0.01"
                      placeholderTextColor="#848E9C"
                      keyboardType="decimal-pad"
                      value={convertAmount}
                      onChangeText={setConvertAmount}
                    />
                    <TouchableOpacity onPress={handleMaxConvert} activeOpacity={0.8} style={{ alignSelf: 'flex-end', marginTop: 4 }}>
                      <Text style={styles.convertMaxText}>Max</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Swap Button Divider */}
              <View style={styles.swapBtnWrapper}>
                <TouchableOpacity style={styles.swapCircleBtn} activeOpacity={0.8}>
                  <Ionicons name="swap-vertical" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* To Card Box */}
              <View style={styles.convertCard}>
                <View style={styles.convertCardHeader}>
                  <Text style={styles.convertCardLabel}>To</Text>
                </View>

                <View style={styles.convertInputRow}>
                  <TouchableOpacity style={styles.coinSelectPill} activeOpacity={0.7}>
                    <CryptoIcon symbol={convertToCoin} size={26} />
                    <Text style={styles.coinSelectText}>{convertToCoin}</Text>
                    <Ionicons name="caret-down" size={12} color="#FFFFFF" />
                  </TouchableOpacity>

                  <Text style={styles.convertPlaceholderTo}>&gt; 0.03</Text>
                </View>
              </View>

              {/* Rewards Banner */}
              <View style={styles.convertRewardCard}>
                <Ionicons name="gift-outline" size={18} color="#F0B90B" style={{ marginRight: 8 }} />
                <Text style={styles.convertRewardText}>
                  16,000 USDC Rewards for New Convert & Earn Users
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#848E9C" />
              </View>

              {/* Preview Order Button */}
              <TouchableOpacity
                style={[
                  styles.previewOrderBtn,
                  { backgroundColor: convertAmount ? '#F0B90B' : '#3D3B2B' },
                ]}
                disabled={!convertAmount}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.previewOrderBtnText,
                    { color: convertAmount ? '#0B0F14' : 'rgba(255,255,255,0.35)' },
                  ]}
                >
                  Preview Order
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ================= 2. SPOT TRADING ================= */}
          {activeTab === 'spot' && (
            <View style={styles.spotContainer}>
              {/* Spot Pair Sub-Header */}
              <View style={styles.spotHeaderRow}>
                <TouchableOpacity style={styles.spotPairTitleRow} activeOpacity={0.7}>
                  <Text style={styles.spotPairTitle}>BTC/USDT</Text>
                  <Ionicons name="caret-down" size={14} color="#FFFFFF" style={{ marginLeft: 4 }} />
                  <Text style={styles.spotPairChange}>+7.89%</Text>
                </TouchableOpacity>

                <View style={styles.spotHeaderIcons}>
                  <TouchableOpacity style={styles.iconPadding} activeOpacity={0.7}>
                    <Ionicons name="bar-chart-outline" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconPadding} activeOpacity={0.7}>
                    <Ionicons name="ellipsis-horizontal" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Main Split: Order Book (Left) & Order Form (Right) */}
              <View style={styles.spotSplitRow}>
                {/* Left Side: Order Book */}
                <View style={styles.orderBookCol}>
                  <View style={styles.marginRow}>
                    <Text style={styles.marginText}>Margin</Text>
                    <View style={styles.toggleSwitchOff} />
                  </View>

                  <View style={styles.obHeaderRow}>
                    <Text style={styles.obColTitle}>Price{"\n"}(USDT)</Text>
                    <Text style={[styles.obColTitle, { textAlign: 'right' }]}>Amount{"\n"}(BTC)</Text>
                  </View>

                  {/* Ask Prices (Red) */}
                  {[
                    { p: '74,820.15', a: '0.00007' },
                    { p: '74,819.72', a: '0.00022' },
                    { p: '74,818.56', a: '0.00014' },
                    { p: '74,818.55', a: '0.00049' },
                    { p: '74,818.54', a: '0.02971' },
                  ].map((row, idx) => (
                    <View key={idx} style={styles.obRow}>
                      <Text style={styles.askPriceText}>{row.p}</Text>
                      <Text style={styles.obAmountText}>{row.a}</Text>
                    </View>
                  ))}

                  {/* Big Price Display */}
                  <View style={styles.bigPriceBox}>
                    <Text style={styles.bigPriceNum}>74,818.54</Text>
                    <Text style={styles.bigPriceSub}>≈ $74,818.54</Text>
                  </View>

                  {/* Bid Prices (Green) */}
                  {[
                    { p: '74,818.53', a: '4.80224' },
                    { p: '74,818.52', a: '0.00030' },
                    { p: '74,818.51', a: '0.00014' },
                    { p: '74,817.64', a: '0.00668' },
                    { p: '74,817.63', a: '0.00016' },
                  ].map((row, idx) => (
                    <View key={idx} style={styles.obRow}>
                      <Text style={styles.bidPriceText}>{row.p}</Text>
                      <Text style={styles.obAmountText}>{row.a}</Text>
                    </View>
                  ))}

                  {/* Buy/Sell Depth Ratio Bar */}
                  <View style={styles.depthRatioRow}>
                    <Text style={{ color: '#0ECB81', fontSize: 10 }}>96.97%</Text>
                    <View style={styles.depthTrack}>
                      <View style={{ flex: 97, backgroundColor: '#0ECB81', height: 4, borderRadius: 2 }} />
                      <View style={{ flex: 3, backgroundColor: '#F6465D', height: 4, borderRadius: 2 }} />
                    </View>
                    <Text style={{ color: '#F6465D', fontSize: 10 }}>3.03%</Text>
                  </View>

                  {/* Precision Dropdown */}
                  <TouchableOpacity style={styles.precisionBtn} activeOpacity={0.7}>
                    <Text style={styles.precisionText}>0.01</Text>
                    <Ionicons name="caret-down" size={10} color="#848E9C" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                </View>

                {/* Right Side: Order Execution Form */}
                <View style={styles.orderFormCol}>
                  {/* Buy / Sell Tab Switcher */}
                  <View style={styles.buySellSwitch}>
                    <TouchableOpacity
                      style={[
                        styles.buyTabBtn,
                        spotTradeMode === 'buy' && styles.buyTabBtnActive,
                      ]}
                      onPress={() => setSpotTradeMode('buy')}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.buyTabText, spotTradeMode === 'buy' && { color: '#FFFFFF' }]}>
                        Buy
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.sellTabBtn,
                        spotTradeMode === 'sell' && styles.sellTabBtnActive,
                      ]}
                      onPress={() => setSpotTradeMode('sell')}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.sellTabText, spotTradeMode === 'sell' && { color: '#FFFFFF' }]}>
                        Sell
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Order Type Dropdown */}
                  <TouchableOpacity style={styles.orderTypeDropdown} activeOpacity={0.7}>
                    <Ionicons name="information-circle-outline" size={14} color="#848E9C" style={{ marginRight: 4 }} />
                    <Text style={styles.orderTypeText}>{spotOrderType}</Text>
                    <Ionicons name="caret-down" size={12} color="#848E9C" style={{ marginLeft: 'auto' }} />
                  </TouchableOpacity>

                  {/* Total Input */}
                  <View style={styles.totalInputBox}>
                    <TextInput
                      style={styles.totalTextInput}
                      placeholder="Total"
                      placeholderTextColor="#848E9C"
                      keyboardType="decimal-pad"
                      value={spotAmount}
                      onChangeText={setSpotAmount}
                    />
                    <TouchableOpacity style={styles.usdtPill} activeOpacity={0.7}>
                      <Text style={styles.usdtPillText}>USDT</Text>
                      <Ionicons name="caret-down" size={10} color="#FFFFFF" style={{ marginLeft: 2 }} />
                    </TouchableOpacity>
                  </View>

                  {/* Percentage Slider Track */}
                  <View style={styles.sliderTrackRow}>
                    <View style={styles.sliderNode} />
                    <View style={styles.sliderNode} />
                    <View style={styles.sliderNode} />
                    <View style={styles.sliderNode} />
                    <View style={styles.sliderNode} />
                  </View>

                  {/* Slippage Checkbox */}
                  <View style={styles.slippageRow}>
                    <View style={styles.checkboxSquare} />
                    <Text style={styles.slippageText}>Slippage Tolerance</Text>
                  </View>

                  {/* Available Balance */}
                  <View style={styles.availBalanceRow}>
                    <Text style={styles.availLabel}>Avbl ▾</Text>
                    <Text style={styles.availVal}>{availableUsdt.toFixed(8)} USDT</Text>
                    <Ionicons name="add-circle" size={14} color="#F0B90B" style={{ marginLeft: 2 }} />
                  </View>

                  {/* Max Buy & Fee */}
                  <View style={styles.infoMetaRow}>
                    <Text style={styles.metaLabel}>Max Buy</Text>
                    <Text style={styles.metaVal}>0.00133 BTC</Text>
                  </View>
                  <View style={styles.infoMetaRow}>
                    <Text style={styles.metaLabel}>Est. Fee</Text>
                    <Text style={styles.metaVal}>-- BTC</Text>
                  </View>

                  {/* Submit CTA Button */}
                  <TouchableOpacity
                    style={[
                      styles.submitSpotBtn,
                      { backgroundColor: spotTradeMode === 'buy' ? '#0ECB81' : '#F6465D' },
                    ]}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.submitSpotText}>
                      {spotTradeMode === 'buy' ? 'Buy BTC' : 'Sell BTC'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Copy Trading Section */}
              <View style={styles.copyTradingSection}>
                <View style={styles.ordersTabRow}>
                  <Text style={styles.ordersTabActive}>Open Orders (0)</Text>
                  <Text style={styles.ordersTabInactive}>Holdings</Text>
                  <Text style={styles.ordersTabInactive}>Bots</Text>
                  <TouchableOpacity style={{ marginLeft: 'auto' }}>
                    <Ionicons name="document-text-outline" size={18} color="#848E9C" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.copyTraderHeader} activeOpacity={0.7}>
                  <Text style={styles.copyTraderTitle}>You may be interested in - Copy</Text>
                  <Ionicons name="chevron-forward" size={14} color="#848E9C" />
                </TouchableOpacity>

                {/* Copy Trader Card */}
                <View style={styles.traderCardBox}>
                  <View style={styles.traderAvatarWrapper}>
                    <View style={styles.traderAvatarCircle} />
                    <View style={{ marginLeft: 10 }}>
                      <Text style={styles.traderName}>48Clublan</Text>
                      <Text style={styles.traderStats}>92/2000</Text>
                    </View>
                  </View>

                  <TouchableOpacity style={styles.copyBtnYellow} activeOpacity={0.8}>
                    <Text style={styles.copyBtnText}>Copy</Text>
                  </TouchableOpacity>
                </View>

                {/* Live Candlestick Chart */}
                <View style={styles.chartSectionWrapper}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.timeframesRow}>
                    {['1h', '2h', '4h', '6h', '8h', '12h', '1d', '1w', '1M'].map((tf) => (
                      <TouchableOpacity key={tf} style={styles.tfBtn} activeOpacity={0.7}>
                        <Text style={[styles.tfText, tf === '1d' && styles.tfTextActive]}>{tf}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <View style={styles.maIndicatorsRow}>
                    <Text style={{ color: '#F0B90B', fontSize: 11 }}>MA(7): 67,488.86</Text>
                    <Text style={{ color: '#E6007A', fontSize: 11 }}>MA(25): 64,934.80</Text>
                    <Text style={{ color: '#8A2BE2', fontSize: 11 }}>MA(99): 66,026.61</Text>
                  </View>

                  <CandlestickChart />
                </View>
              </View>
            </View>
          )}

          {/* ================= 3. STOCKS TRADING ================= */}
          {activeTab === 'stocks' && (
            <View style={styles.stocksContainer}>
              {/* Stocks Header */}
              <View style={styles.spotHeaderRow}>
                <TouchableOpacity style={styles.spotPairTitleRow} activeOpacity={0.7}>
                  <CryptoIcon symbol="MU" size={24} />
                  <Text style={[styles.spotPairTitle, { marginLeft: 6 }]}>MU</Text>
                  <Ionicons name="caret-down" size={14} color="#FFFFFF" style={{ marginLeft: 4 }} />
                </TouchableOpacity>

                <View style={styles.spotHeaderIcons}>
                  <TouchableOpacity style={styles.iconPadding} activeOpacity={0.7}>
                    <Ionicons name="bar-chart-outline" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconPadding} activeOpacity={0.7}>
                    <Ionicons name="ellipsis-horizontal" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.stockPriceSub}>
                $972.69 <Text style={{ color: '#F6465D' }}>-0.07%</Text> Overnight
              </Text>

              {/* Order Form */}
              <View style={styles.stockFormCard}>
                <View style={styles.buySellSwitchRow}>
                  <View style={styles.buySellSwitchMini}>
                    <TouchableOpacity
                      style={[styles.buyTabBtn, stockTradeMode === 'buy' && styles.buyTabBtnActive]}
                      onPress={() => setStockTradeMode('buy')}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.buyTabText, stockTradeMode === 'buy' && { color: '#FFFFFF' }]}>Buy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.sellTabBtn, stockTradeMode === 'sell' && styles.sellTabBtnActive]}
                      onPress={() => setStockTradeMode('sell')}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.sellTabText, stockTradeMode === 'sell' && { color: '#FFFFFF' }]}>Sell</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity style={styles.marketDropdownMini} activeOpacity={0.7}>
                    <Text style={styles.orderTypeText}>Market</Text>
                    <Ionicons name="caret-down" size={12} color="#848E9C" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                </View>

                {/* Big Input Display */}
                <View style={styles.stockAmountInputBox}>
                  <TextInput
                    style={styles.stockAmountInput}
                    placeholder="0"
                    placeholderTextColor="#848E9C"
                    keyboardType="decimal-pad"
                    value={stockAmount}
                    onChangeText={setStockAmount}
                  />
                  <Text style={styles.stockSymbolLabel}>USDT</Text>
                </View>

                <View style={styles.availBalanceRow}>
                  <Text style={styles.availLabel}>Avbl</Text>
                  <Text style={styles.availVal}>{availableUsdt.toFixed(8)} USDT</Text>
                  <Ionicons name="add-circle" size={14} color="#F0B90B" style={{ marginLeft: 2 }} />
                </View>

                {/* Pay From Card */}
                <TouchableOpacity style={styles.payFromCard} activeOpacity={0.7}>
                  <View>
                    <Text style={styles.payFromLabel}>Pay From</Text>
                    <Text style={styles.payFromValue}>Funding + Spot ▾</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <CryptoIcon symbol="USDT" size={18} />
                    <Text style={{ color: '#FFFFFF', marginLeft: 4, fontWeight: '600' }}>USDT &gt;</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.stockPreviewBtn} activeOpacity={0.8}>
                  <Text style={styles.stockPreviewBtnText}>Preview</Text>
                </TouchableOpacity>
              </View>

              {/* Stocks Promo Banner */}
              <View style={styles.convertRewardCard}>
                <Ionicons name="gift-outline" size={18} color="#F0B90B" style={{ marginRight: 8 }} />
                <Text style={styles.convertRewardText}>
                  Binance Stocks: Earn Up to 12,000 USDC for Your First Stocks Transfer-in! <Text style={{ color: '#F0B90B' }}>More Details</Text>
                </Text>
                <Ionicons name="close" size={16} color="#848E9C" />
              </View>

              {/* Open Orders Section */}
              <View style={styles.ordersTabRow}>
                <Text style={styles.ordersTabActive}>Open Orders (0)</Text>
                <Text style={styles.ordersTabInactive}>Holdings (0)</Text>
                <TouchableOpacity style={{ marginLeft: 'auto' }}>
                  <Ionicons name="document-text-outline" size={18} color="#848E9C" />
                </TouchableOpacity>
              </View>

              <View style={styles.noOrdersEmptyState}>
                <MaterialCommunityIcons name="file-document-outline" size={40} color="#848E9C" />
                <Text style={styles.noOrdersText}>No open orders</Text>
              </View>

              {/* Stock Chart Section */}
              <View style={styles.chartSectionWrapper}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.timeframesRow}>
                  {['1D', '1W', '1M', '6M', '1Y', '5Y', 'Max'].map((tf) => (
                    <TouchableOpacity key={tf} style={styles.tfBtn} activeOpacity={0.7}>
                      <Text style={[styles.tfText, tf === '1D' && styles.tfTextActive]}>{tf}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <StockAreaChart />
              </View>
            </View>
          )}

          {/* ================= 4. P2P TRADING ================= */}
          {activeTab === 'p2p' && (
            <View style={styles.p2pContainer}>
              <MaterialCommunityIcons name="account-switch-outline" size={48} color="#F0B90B" />
              <Text style={styles.placeholderTitle}>P2P Express Trading</Text>
              <Text style={styles.placeholderSub}>Buy & Sell Crypto with 0 Fee via Local Bank & Mobile Money</Text>
            </View>
          )}

          {/* ================= 5. ALPHA TRADING ================= */}
          {activeTab === 'alpha' && (
            <View style={styles.p2pContainer}>
              <Ionicons name="sparkles-outline" size={48} color="#F0B90B" />
              <Text style={styles.placeholderTitle}>Alpha DEX Trading</Text>
              <Text style={styles.placeholderSub}>Trade On-Chain Tokens & Pre-Market Assets directly on Binance</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topTabsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  tabsScrollRow: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  tabBtn: {
    position: 'relative',
    paddingBottom: 6,
  },
  tabText: {
    color: '#848E9C',
    fontSize: 16,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  tabActiveIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#F0B90B',
    borderRadius: 2,
  },
  topRightMenuBtn: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  convertContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  convertSubHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  instantPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#212A34',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  instantText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  convertCard: {
    backgroundColor: '#212A34',
    borderRadius: 12,
    padding: 16,
  },
  convertCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  convertCardLabel: {
    color: '#848E9C',
    fontSize: 13,
  },
  walletBalanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceText: {
    color: '#848E9C',
    fontSize: 12,
    fontWeight: '600',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
    borderStyle: 'dashed',
  },
  convertInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coinSelectPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  coinSelectText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  inputMaxCol: {
    alignItems: 'flex-end',
  },
  convertTextInput: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'right',
    padding: 0,
  },
  convertMaxText: {
    color: '#F0B90B',
    fontSize: 13,
    fontWeight: '700',
  },
  convertPlaceholderTo: {
    color: '#848E9C',
    fontSize: 24,
    fontWeight: '600',
  },
  swapBtnWrapper: {
    alignItems: 'center',
    marginVertical: -14,
    zIndex: 10,
  },
  swapCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2B3543',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#141921',
  },
  convertRewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E2630',
    borderRadius: 10,
    padding: 12,
    marginVertical: 16,
  },
  convertRewardText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 16,
  },
  previewOrderBtn: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewOrderBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  spotContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  spotHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  spotPairTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spotPairTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  spotPairChange: {
    color: '#0ECB81',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
  },
  spotHeaderIcons: {
    flexDirection: 'row',
    gap: 14,
  },
  iconPadding: {
    padding: 2,
  },
  spotSplitRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  orderBookCol: {
    flex: 1,
  },
  marginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  marginText: {
    color: '#848E9C',
    fontSize: 12,
  },
  toggleSwitchOff: {
    width: 24,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2B3543',
  },
  obHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  obColTitle: {
    color: '#848E9C',
    fontSize: 10,
  },
  obRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  askPriceText: {
    color: '#F6465D',
    fontSize: 11,
    fontWeight: '600',
  },
  bidPriceText: {
    color: '#0ECB81',
    fontSize: 11,
    fontWeight: '600',
  },
  obAmountText: {
    color: '#848E9C',
    fontSize: 11,
  },
  bigPriceBox: {
    marginVertical: 6,
  },
  bigPriceNum: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  bigPriceSub: {
    color: '#848E9C',
    fontSize: 10,
  },
  depthRatioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginVertical: 6,
  },
  depthTrack: {
    flex: 1,
    flexDirection: 'row',
    height: 4,
    gap: 2,
  },
  precisionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#212A34',
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 4,
  },
  precisionText: {
    color: '#848E9C',
    fontSize: 11,
  },
  orderFormCol: {
    flex: 1.1,
  },
  buySellSwitch: {
    flexDirection: 'row',
    backgroundColor: '#212A34',
    borderRadius: 6,
    padding: 2,
    marginBottom: 10,
  },
  buyTabBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 4,
    alignItems: 'center',
  },
  buyTabBtnActive: {
    backgroundColor: '#0ECB81',
  },
  buyTabText: {
    color: '#848E9C',
    fontSize: 13,
    fontWeight: '700',
  },
  sellTabBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 4,
    alignItems: 'center',
  },
  sellTabBtnActive: {
    backgroundColor: '#F6465D',
  },
  sellTabText: {
    color: '#848E9C',
    fontSize: 13,
    fontWeight: '700',
  },
  orderTypeDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#212A34',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 10,
  },
  orderTypeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  totalInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#212A34',
    paddingHorizontal: 8,
    height: 38,
    borderRadius: 6,
    marginBottom: 10,
  },
  totalTextInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
    padding: 0,
  },
  usdtPill: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usdtPillText: {
    color: '#848E9C',
    fontSize: 11,
    fontWeight: '600',
  },
  sliderTrackRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  sliderNode: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2B3543',
  },
  slippageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  checkboxSquare: {
    width: 12,
    height: 12,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#848E9C',
  },
  slippageText: {
    color: '#848E9C',
    fontSize: 11,
  },
  availBalanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  availLabel: {
    color: '#848E9C',
    fontSize: 11,
  },
  availVal: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  infoMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  metaLabel: {
    color: '#848E9C',
    fontSize: 11,
  },
  metaVal: {
    color: '#FFFFFF',
    fontSize: 11,
  },
  submitSpotBtn: {
    height: 38,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  submitSpotText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  copyTradingSection: {
    marginTop: 12,
  },
  ordersTabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    paddingBottom: 8,
  },
  ordersTabActive: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  ordersTabInactive: {
    color: '#848E9C',
    fontSize: 14,
  },
  copyTraderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  copyTraderTitle: {
    color: '#848E9C',
    fontSize: 13,
  },
  traderCardBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E2630',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  traderAvatarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  traderAvatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3A4454',
  },
  traderName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  traderStats: {
    color: '#848E9C',
    fontSize: 11,
    marginTop: 2,
  },
  copyBtnYellow: {
    backgroundColor: '#F0B90B',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  copyBtnText: {
    color: '#0B0F14',
    fontSize: 13,
    fontWeight: '700',
  },
  chartSectionWrapper: {
    marginTop: 8,
  },
  timeframesRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  tfBtn: {
    paddingVertical: 2,
  },
  tfText: {
    color: '#848E9C',
    fontSize: 12,
  },
  tfTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  maIndicatorsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  stocksContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  stockPriceSub: {
    color: '#FFFFFF',
    fontSize: 13,
    marginBottom: 16,
  },
  stockFormCard: {
    backgroundColor: '#1E2630',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  buySellSwitchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  buySellSwitchMini: {
    flexDirection: 'row',
    backgroundColor: '#212A34',
    borderRadius: 6,
    padding: 2,
    width: 140,
  },
  marketDropdownMini: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#212A34',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  stockAmountInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  stockAmountInput: {
    fontSize: 48,
    fontWeight: '600',
    color: '#848E9C',
    marginRight: 8,
  },
  stockSymbolLabel: {
    fontSize: 28,
    fontWeight: '600',
    color: '#848E9C',
  },
  payFromCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#212A34',
    borderRadius: 8,
    padding: 12,
    marginVertical: 12,
  },
  payFromLabel: {
    color: '#848E9C',
    fontSize: 11,
  },
  payFromValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  stockPreviewBtn: {
    height: 44,
    backgroundColor: '#2B3543',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stockPreviewBtnText: {
    color: '#848E9C',
    fontSize: 15,
    fontWeight: '700',
  },
  noOrdersEmptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  noOrdersText: {
    color: '#848E9C',
    fontSize: 13,
  },
  p2pContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  placeholderTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  placeholderSub: {
    color: '#848E9C',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});
