import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, Feather, Octicons } from '@expo/vector-icons';
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
  todayPnlUsd = 0.00000982,
  todayPnlPercent = 0.0,
  hideBalance,
  onToggleHideBalance,
  onQuickAction,
}: AssetsHeaderProps): React.JSX.Element {
  const { colors } = useTheme();

  const formattedUsd = totalUsd.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <View style={styles.container}>
      {/* Top Title & Header Icons */}
      <View style={styles.topRow}>
        <View style={styles.titleWithEye}>
          <Text style={[styles.headerLabel, { color: colors.text2 }]}>Est. Total Value</Text>
          <TouchableOpacity onPress={onToggleHideBalance} style={styles.eyeBtn} activeOpacity={0.7}>
            <Ionicons
              name={hideBalance ? 'eye-off-outline' : 'eye-outline'}
              size={15}
              color={colors.text2}
            />
          </TouchableOpacity>
        </View>

        {/* Top Right Action Icons: Chart Analytics & Statement */}
        <View style={styles.headerRightIcons}>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
            <Feather name="trending-up" size={18} color={colors.text2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
            <Octicons name="file" size={17} color={colors.text2} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Balance Display with Currency Dropdown */}
      <View style={styles.balanceSection}>
        <View style={styles.balanceRow}>
          <Text style={[styles.mainBalance, { color: colors.text }]}>
            {hideBalance ? '••••••••' : formattedUsd}
          </Text>
          <TouchableOpacity style={styles.currencyDropdown} activeOpacity={0.7}>
            <Text style={[styles.currencyText, { color: colors.text }]}>USDT</Text>
            <Ionicons name="caret-down" size={11} color={colors.text2} style={{ marginLeft: 2 }} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.fiatApprox, { color: colors.text2 }]}>
          ≈ ${hideBalance ? '••••••' : formattedUsd}
        </Text>
      </View>

      {/* Today's PNL Row */}
      <TouchableOpacity style={styles.pnlRow} activeOpacity={0.7}>
        <Text style={[styles.pnlLabel, { color: colors.text2 }]}>Today's PNL</Text>
        <View style={styles.pnlValueContainer}>
          <Text style={styles.pnlPositiveText}>
            {hideBalance
              ? '••••'
              : `+${todayPnlUsd.toFixed(8)} USDT(+${todayPnlPercent.toFixed(2)}%)`}
          </Text>
          <Ionicons name="chevron-forward" size={13} color="#0ecb81" />
        </View>
      </TouchableOpacity>

      {/* Quick Action Buttons (3 buttons: Add Funds, Send, Transfer) */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.addFundsBtn}
          onPress={() => onQuickAction?.('deposit')}
          activeOpacity={0.8}
        >
          <Text style={styles.addFundsText}>Add Funds</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.darkActionBtn}
          onPress={() => onQuickAction?.('send')}
          activeOpacity={0.8}
        >
          <Text style={styles.darkActionText}>Send</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.darkActionBtn}
          onPress={() => onQuickAction?.('transfer')}
          activeOpacity={0.8}
        >
          <Text style={styles.darkActionText}>Transfer</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications / Activity Card */}
      <View style={[styles.activityCard, { backgroundColor: '#18212a' }]}>
        <TouchableOpacity style={styles.activityItem} activeOpacity={0.7}>
          <View style={styles.activityLeft}>
            <Ionicons name="notifications-outline" size={15} color={colors.text2} style={{ marginRight: 8 }} />
            <Text style={[styles.activityTitle, { color: colors.text }]}>Crypto deposit 100 USDT</Text>
          </View>
          <View style={styles.activityRight}>
            <Text style={styles.completedText}>Completed</Text>
            <Ionicons name="chevron-forward" size={13} color="#0ecb81" />
          </View>
        </TouchableOpacity>

        <View style={[styles.activityDivider, { backgroundColor: 'rgba(255,255,255,0.05)' }]} />

        <TouchableOpacity style={styles.activityItem} activeOpacity={0.7}>
          <View style={styles.activityLeft}>
            <Ionicons name="notifications-outline" size={15} color={colors.text2} style={{ marginRight: 8 }} />
            <Text style={[styles.activityTitle, { color: colors.text }]}>P2P sell 146.36 USDT</Text>
          </View>
          <View style={styles.activityRight}>
            <Text style={styles.completedText}>Completed</Text>
            <Ionicons name="chevron-forward" size={13} color="#0ecb81" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
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
    marginLeft: 6,
    padding: 2,
  },
  headerRightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBtn: {
    padding: 2,
  },
  balanceSection: {
    marginBottom: 6,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  mainBalance: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  currencyDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyText: {
    fontSize: 14,
    fontWeight: '700',
  },
  fiatApprox: {
    fontSize: 13,
    marginTop: 2,
  },
  pnlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 18,
  },
  pnlLabel: {
    fontSize: 12,
    marginRight: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
    borderStyle: 'dashed',
  },
  pnlValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  pnlPositiveText: {
    fontSize: 12,
    color: '#0ecb81',
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  addFundsBtn: {
    flex: 1,
    height: 40,
    backgroundColor: '#F0B90B',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addFundsText: {
    color: '#0B0F14',
    fontWeight: '700',
    fontSize: 14,
  },
  darkActionBtn: {
    flex: 1,
    height: 40,
    backgroundColor: '#2B313A',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkActionText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  activityCard: {
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  activityRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  completedText: {
    fontSize: 12,
    color: '#0ecb81',
    fontWeight: '500',
  },
  activityDivider: {
    height: 1,
  },
});
