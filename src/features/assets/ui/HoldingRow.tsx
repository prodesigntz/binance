import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { PercentBadge } from '../../../shared/ui/PercentBadge';
import type { UserHolding } from '../model/usePortfolioStore';

interface HoldingRowProps {
  holding: UserHolding;
  unitPrice: number;
  change24h?: number;
  imageUrl?: string;
  hideBalance: boolean;
  onPress: () => void;
}

export function HoldingRow({
  holding,
  unitPrice,
  change24h = 0,
  imageUrl,
  hideBalance,
  onPress,
}: HoldingRowProps): React.JSX.Element {
  const { colors } = useTheme();

  const totalValueUsd = holding.amount * unitPrice;
  const formattedAmount =
    holding.amount >= 1000
      ? holding.amount.toLocaleString('en-US', { maximumFractionDigits: 2 })
      : holding.amount < 0.01
      ? holding.amount.toFixed(6)
      : holding.amount.toFixed(4);

  const formattedUsd = `$${totalValueUsd.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  return (
    <TouchableOpacity
      style={[styles.container, { borderBottomColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Coin Icon & Name */}
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

      {/* Amount & Valuation */}
      <View style={styles.rightCol}>
        <Text style={[styles.usdValue, { color: colors.text }]}>
          {hideBalance ? '••••••' : formattedUsd}
        </Text>
        <View style={styles.subRightRow}>
          <Text style={[styles.holdingAmount, { color: colors.text2 }]}>
            {hideBalance ? '••••' : `${formattedAmount} ${holding.symbol}`}
          </Text>
          <View style={styles.badgeWrapper}>
            <PercentBadge value={change24h} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  coinLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  avatarFallback: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
  nameBlock: {
    justifyContent: 'center',
  },
  symbol: {
    fontSize: 15,
    fontWeight: '700',
  },
  name: {
    fontSize: 12,
    marginTop: 2,
  },
  rightCol: {
    alignItems: 'flex-end',
  },
  usdValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  subRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    gap: 6,
  },
  holdingAmount: {
    fontSize: 12,
  },
  badgeWrapper: {
    marginLeft: 2,
  },
});
