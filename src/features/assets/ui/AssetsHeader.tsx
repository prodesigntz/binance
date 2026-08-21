import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../../app/providers/ThemeProvider';

interface AssetsHeaderProps {
  totalUsd: number;
  btcPrice: number;
  todayPnlUsd?: number;
  todayPnlPercent?: number;
  hideBalance: boolean;
  onToggleHideBalance: () => void;
  onQuickAction?: (action: string) => void;
}

export function AssetsHeader({
  totalUsd,
  btcPrice,
  todayPnlUsd = 342.5,
  todayPnlPercent = 2.83,
  hideBalance,
  onToggleHideBalance,
  onQuickAction,
}: AssetsHeaderProps): React.JSX.Element {
  const { colors } = useTheme();

  const btcEquivalent = btcPrice > 0 ? (totalUsd / btcPrice).toFixed(5) : '0.00000';
  const formattedUsd = `$${totalUsd.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
  const isPnlPositive = todayPnlPercent >= 0;

  return (
    <View style={styles.container}>
      {/* Top Title & Privacy Eye */}
      <View style={styles.topRow}>
        <View style={styles.titleWithEye}>
          <Text style={[styles.headerLabel, { color: colors.text2 }]}>
            Total Balance
          </Text>
          <TouchableOpacity onPress={onToggleHideBalance} style={styles.eyeBtn} activeOpacity={0.7}>
            <Ionicons
              name={hideBalance ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color={colors.iconMuted}
            />
          </TouchableOpacity>
        </View>

        {/* Small Notifications/History icon */}
        <TouchableOpacity style={styles.historyBtn} activeOpacity={0.7}>
          <Ionicons name="document-text-outline" size={18} color={colors.iconMuted} />
        </TouchableOpacity>
      </View>

      {/* Main Balance Display */}
      <View style={styles.balanceSection}>
        <Text style={[styles.usdBalance, { color: colors.text }]}>
          {hideBalance ? '••••••••' : formattedUsd}
        </Text>
        <Text style={[styles.btcEquivalent, { color: colors.text2 }]}>
          ≈ {hideBalance ? '••••••' : `${btcEquivalent} BTC`}
        </Text>
      </View>

      {/* Today's PnL Badge */}
      <View style={styles.pnlRow}>
        <Text style={[styles.pnlLabel, { color: colors.text2 }]}>Today's PnL</Text>
        <View
          style={[
            styles.pnlBadge,
            { backgroundColor: isPnlPositive ? 'rgba(31, 199, 126, 0.18)' : 'rgba(255, 77, 87, 0.18)' },
          ]}
        >
          <Ionicons
            name={isPnlPositive ? 'caret-up' : 'caret-down'}
            size={12}
            color={isPnlPositive ? '#1FC77E' : '#FF4D57'}
          />
          <Text
            style={[
              styles.pnlText,
              { color: isPnlPositive ? '#1FC77E' : '#FF4D57' },
            ]}
          >
            {hideBalance
              ? '••••'
              : `${isPnlPositive ? '+' : ''}$${todayPnlUsd.toFixed(2)} (${isPnlPositive ? '+' : ''}${todayPnlPercent.toFixed(2)}%)`}
          </Text>
        </View>
      </View>

      {/* Quick Action Buttons: Deposit, Withdraw, Transfer, Convert */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.primaryActionBtn, { backgroundColor: '#F9B600' }]}
          onPress={() => onQuickAction?.('deposit')}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={18} color="#0B0F14" />
          <Text style={styles.primaryActionText}>Deposit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryActionBtn, { backgroundColor: colors.card2 }]}
          onPress={() => onQuickAction?.('withdraw')}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-up-outline" size={16} color={colors.text} />
          <Text style={[styles.secondaryActionText, { color: colors.text }]}>Withdraw</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryActionBtn, { backgroundColor: colors.card2 }]}
          onPress={() => onQuickAction?.('transfer')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="swap-horizontal" size={18} color={colors.text} />
          <Text style={[styles.secondaryActionText, { color: colors.text }]}>Transfer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryActionBtn, { backgroundColor: colors.card2 }]}
          onPress={() => onQuickAction?.('convert')}
          activeOpacity={0.8}
        >
          <Ionicons name="sync-outline" size={16} color={colors.text} />
          <Text style={[styles.secondaryActionText, { color: colors.text }]}>Convert</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  titleWithEye: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  eyeBtn: {
    marginLeft: 8,
    padding: 2,
  },
  historyBtn: {
    padding: 4,
  },
  balanceSection: {
    marginBottom: 8,
  },
  usdBalance: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  btcEquivalent: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: '400',
  },
  pnlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  pnlLabel: {
    fontSize: 12,
    marginRight: 6,
  },
  pnlBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 3,
  },
  pnlText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  primaryActionBtn: {
    flex: 1.2,
    flexDirection: 'row',
    height: 38,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  primaryActionText: {
    color: '#0B0F14',
    fontWeight: '700',
    fontSize: 13,
  },
  secondaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    height: 38,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  secondaryActionText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
