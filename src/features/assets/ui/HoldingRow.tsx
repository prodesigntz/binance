import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../app/providers/ThemeProvider';
import type { UserHolding } from '../model/usePortfolioStore';

interface HoldingRowProps {
  holding: UserHolding;
  unitPrice: number;
  change24h?: number;
  imageUrl?: string;
  hideBalance: boolean;
  onPress: () => void;
  onEarnPress?: () => void;
  onTradePress?: () => void;
}

export function HoldingRow({
  holding,
  unitPrice,
  change24h = 0.2,
  imageUrl,
  hideBalance,
  onPress,
  onEarnPress,
  onTradePress,
}: HoldingRowProps): React.JSX.Element {
  const { colors } = useTheme();

  const totalValueUsd = holding.amount * unitPrice;

  // Format amount with full precision for small balances or standard formatting
  const formattedAmount = hideBalance
    ? '••••••••'
    : holding.amount >= 1
    ? holding.amount.toFixed(8)
    : holding.amount.toFixed(8);

  const formattedEquivalent = hideBalance
    ? '••••••'
    : totalValueUsd >= 0.00001
    ? `${totalValueUsd.toFixed(6)} USDT`
    : totalValueUsd > 0
    ? `${totalValueUsd.toFixed(8)} USDT`
    : '';

  const isPnlPositive = change24h >= 0;

  return (
    <TouchableOpacity
      style={[styles.container, { borderBottomColor: 'rgba(255,255,255,0.03)' }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Top Part: Info & Amounts */}
      <View style={styles.topRow}>
        {/* Left: Logo & Names */}
        <View style={styles.leftCol}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.coinLogo} />
          ) : (
            <View style={[styles.avatarFallback, { backgroundColor: holding.color }]}>
              <Text style={styles.avatarText}>{holding.symbol.slice(0, 2)}</Text>
            </View>
          )}
          <View style={styles.nameBlock}>
            <Text style={[styles.symbol, { color: colors.text }]}>{holding.symbol}</Text>
            <Text style={[styles.name, { color: colors.text2 }]}>{holding.name}</Text>
          </View>
        </View>

        {/* Right: Balance & Value */}
        <View style={styles.rightCol}>
          <Text style={[styles.amountText, { color: colors.text }]}>{formattedAmount}</Text>
          {formattedEquivalent ? (
            <Text style={[styles.equivalentText, { color: colors.text2 }]}>
              {formattedEquivalent}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Middle/Bottom Part: Today's PNL & Action Pills (Earn / Trade) */}
      <View style={styles.bottomRow}>
        {holding.symbol !== 'USDT' ? (
          <View style={styles.pnlContainer}>
            <Text style={[styles.pnlLabel, { color: colors.text2 }]}>Today's PNL</Text>
            <Text style={[styles.pnlValue, { color: isPnlPositive ? '#0ecb81' : '#f6465d' }]}>
              {hideBalance
                ? '••••'
                : `${isPnlPositive ? '+' : ''}0 USDT(${isPnlPositive ? '+' : ''}${change24h.toFixed(2)}%)`}
            </Text>
          </View>
        ) : (
          <View />
        )}

        {/* Action Pills: Earn & Trade */}
        <View style={styles.actionPills}>
          <TouchableOpacity
            style={styles.pillBtn}
            onPress={onEarnPress ?? onPress}
            activeOpacity={0.7}
          >
            <Text style={styles.pillText}>Earn</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.pillBtn}
            onPress={onTradePress ?? onPress}
            activeOpacity={0.7}
          >
            <Text style={styles.pillText}>Trade</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  coinLogo: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 10,
  },
  avatarFallback: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 11,
  },
  nameBlock: {
    justifyContent: 'center',
  },
  symbol: {
    fontSize: 16,
    fontWeight: '700',
  },
  name: {
    fontSize: 12,
    marginTop: 1,
  },
  rightCol: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  equivalentText: {
    fontSize: 12,
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  pnlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pnlLabel: {
    fontSize: 11,
  },
  pnlValue: {
    fontSize: 11,
    fontWeight: '600',
  },
  actionPills: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 'auto',
  },
  pillBtn: {
    backgroundColor: '#2B313A',
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 6,
  },
  pillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
