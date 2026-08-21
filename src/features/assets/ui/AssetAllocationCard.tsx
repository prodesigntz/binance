import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../app/providers/ThemeProvider';

export interface AllocationItem {
  symbol: string;
  color: string;
  valueUsd: number;
  percent: number;
}

interface AssetAllocationCardProps {
  allocations: AllocationItem[];
  hideBalance: boolean;
}

export function AssetAllocationCard({
  allocations,
  hideBalance,
}: AssetAllocationCardProps): React.JSX.Element {
  const { colors } = useTheme();

  if (!allocations.length) return <View />;

  return (
    <View style={[styles.card, { backgroundColor: colors.card2 }]}>
      <Text style={[styles.title, { color: colors.text2 }]}>Portfolio Allocation</Text>

      {/* Proportional Multi-Color Progress Bar */}
      <View style={styles.barContainer}>
        {allocations.map((item, idx) => (
          <View
            key={item.symbol}
            style={[
              styles.barSegment,
              {
                backgroundColor: item.color,
                flex: Math.max(item.percent, 1),
                borderTopLeftRadius: idx === 0 ? 4 : 0,
                borderBottomLeftRadius: idx === 0 ? 4 : 0,
                borderTopRightRadius: idx === allocations.length - 1 ? 4 : 0,
                borderBottomRightRadius: idx === allocations.length - 1 ? 4 : 0,
              },
            ]}
          />
        ))}
      </View>

      {/* Legend Row */}
      <View style={styles.legendGrid}>
        {allocations.map((item) => (
          <View key={item.symbol} style={styles.legendItem}>
            <View style={[styles.colorDot, { backgroundColor: item.color }]} />
            <Text style={[styles.legendSymbol, { color: colors.text }]}>{item.symbol}</Text>
            <Text style={[styles.legendPercent, { color: colors.text2 }]}>
              {hideBalance ? '•••' : `${item.percent.toFixed(1)}%`}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 12,
    padding: 14,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  barContainer: {
    height: 8,
    flexDirection: 'row',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  barSegment: {
    height: '100%',
    marginRight: 1,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendSymbol: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
  },
  legendPercent: {
    fontSize: 11,
  },
});
