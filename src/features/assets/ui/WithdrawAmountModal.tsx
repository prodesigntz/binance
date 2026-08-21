import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { CryptoIcon } from '../../../components/CryptoIcon';
import type { CoinAsset } from './SelectAssetSheet';
import type { WithdrawNetwork } from './ChooseWithdrawNetworkSheet';
import { usePortfolioStore } from '../model/usePortfolioStore';

export interface WithdrawAmountModalProps {
  visible: boolean;
  coin: CoinAsset | null;
  network: WithdrawNetwork | null;
  address: string;
  onClose: () => void;
  onProceedWithdraw: (amount: number) => void;
}

export function WithdrawAmountModal({
  visible,
  coin,
  network,
  address,
  onClose,
  onProceedWithdraw,
}: WithdrawAmountModalProps): React.JSX.Element | null {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const holdings = usePortfolioStore((state) => state.holdings);

  const [amountStr, setAmountStr] = useState('');
  const [showCaution, setShowCaution] = useState(false);

  if (!visible || !coin) return null;

  // Find user's available holding for this coin
  const coinHolding = holdings.find(
    (h) => h.symbol.toUpperCase() === coin.symbol.toUpperCase()
  );
  const availableBalance = coinHolding?.amount ?? 0.01049329;

  const numericAmount = parseFloat(amountStr) || 0;
  const rawFee = network?.fee ?? 1.5;
  const networkFee = typeof rawFee === 'number' ? rawFee : parseFloat(rawFee) || 1.5;
  const receiveAmount = Math.max(0, numericAmount - networkFee);

  // Price conversion (assume 1 USDT = $1, BTC ~ $96,000, BNB ~ $600)
  const coinPriceUsd =
    coin.symbol === 'BTC' ? 96000 : coin.symbol === 'BNB' ? 600 : 1;
  const usdValue = (numericAmount * coinPriceUsd).toFixed(6);

  const handleMaxPress = () => {
    setAmountStr(availableBalance.toString());
  };

  const handleWithdrawPress = () => {
    if (numericAmount > 0) {
      onProceedWithdraw(numericAmount);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <CryptoIcon symbol={coin.symbol} size={22} iconUrl={coin.imageUrl} />
            <Text style={[styles.titleText, { color: colors.text }]}>Send {coin.symbol}</Text>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
              <Ionicons name="help-circle-outline" size={20} color={colors.text2} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
              <Ionicons name="document-text-outline" size={19} color={colors.text2} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Mode Selector Pill */}
          <TouchableOpacity style={styles.modePill} activeOpacity={0.7}>
            <Text style={styles.modePillText}>One Time</Text>
            <Ionicons name="caret-down" size={12} color="#FFFFFF" style={{ marginLeft: 4 }} />
          </TouchableOpacity>

          {/* Amount Display & Input Row */}
          <View style={styles.amountInputRow}>
            <View style={styles.amountInputWrapper}>
              <TextInput
                style={[styles.amountInput, { color: amountStr ? '#FFFFFF' : 'rgba(255,255,255,0.3)' }]}
                placeholder="0"
                placeholderTextColor="rgba(255,255,255,0.3)"
                keyboardType="decimal-pad"
                value={amountStr}
                onChangeText={setAmountStr}
              />
              <Text style={styles.symbolLabel}>{coin.symbol}</Text>
            </View>

            <TouchableOpacity style={styles.maxBtn} onPress={handleMaxPress} activeOpacity={0.8}>
              <Text style={styles.maxBtnText}>Max</Text>
            </TouchableOpacity>
          </View>

          {/* USD Equivalence */}
          <View style={styles.usdEquivRow}>
            <Text style={styles.usdEquivText}>≈ ${usdValue}</Text>
            <TouchableOpacity style={{ padding: 2 }} activeOpacity={0.7}>
              <Feather name="edit-2" size={12} color={colors.text2} />
            </TouchableOpacity>
          </View>

          {/* Available Balance Line */}
          <Text style={styles.availableText}>
            Available <Text style={styles.availableNum}>{availableBalance} {coin.symbol}</Text>
          </Text>

          {/* Warning Banner */}
          <View style={styles.warningBanner}>
            <Ionicons name="information-circle-outline" size={18} color="#F0B90B" style={{ marginTop: 2, marginRight: 8 }} />
            <Text style={styles.warningBannerText}>
              You haven't withdrawn funds from this address recently. Please try withdrawing a small amount first to verify that the address information is correct. <Text style={styles.warningLink}>Minimum Amount</Text>
            </Text>
          </View>

          {/* Caution Info Dropdown */}
          <TouchableOpacity
            style={styles.cautionToggle}
            onPress={() => setShowCaution(!showCaution)}
            activeOpacity={0.7}
          >
            <Text style={styles.cautionToggleText}>Caution Info</Text>
            <Ionicons
              name={showCaution ? 'chevron-up' : 'chevron-down'}
              size={14}
              color={colors.text2}
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>

          {showCaution && (
            <View style={styles.cautionBox}>
              <Text style={styles.cautionBoxText}>
                • Verify destination network matches recipient blockchain ({network?.name ?? 'Tron TRC20'}).
              </Text>
              <Text style={styles.cautionBoxText}>
                • Double check recipient address before confirming.
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Bottom Bar: Receive Amount & Withdraw Button */}
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom + 8, 16) }]}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Receive amount</Text>
            <Text style={styles.summaryValue}>{receiveAmount.toFixed(6)} {coin.symbol}</Text>
          </View>

          <View style={styles.summaryRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="pricetag-outline" size={14} color={colors.text2} style={{ marginRight: 4 }} />
              <Text style={styles.summaryLabel}>Network fee</Text>
            </View>
            <Text style={styles.summaryValue}>{networkFee.toFixed(2)} {coin.symbol}</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.withdrawBtn,
              { backgroundColor: numericAmount > 0 ? '#F0B90B' : '#3D3B2B' },
            ]}
            disabled={numericAmount <= 0}
            onPress={handleWithdrawPress}
            activeOpacity={0.8}
          >
            <Text style={[styles.withdrawBtnText, { color: numericAmount > 0 ? '#0B0F14' : 'rgba(255,255,255,0.35)' }]}>
              Withdraw
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171E26',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 48,
  },
  backBtn: {
    padding: 4,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleText: {
    fontSize: 17,
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconBtn: {
    padding: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  modePill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#212A34',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 24,
  },
  modePillText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  amountInputWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flex: 1,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: '600',
    padding: 0,
    marginRight: 8,
  },
  symbolLabel: {
    fontSize: 28,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  maxBtn: {
    backgroundColor: '#212A34',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  maxBtnText: {
    color: '#848E9C',
    fontSize: 13,
    fontWeight: '700',
  },
  usdEquivRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  usdEquivText: {
    color: '#848E9C',
    fontSize: 14,
  },
  availableText: {
    color: '#848E9C',
    fontSize: 13,
    marginBottom: 20,
  },
  availableNum: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#2B2719',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  warningBannerText: {
    flex: 1,
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    lineHeight: 18,
  },
  warningLink: {
    color: '#F0B90B',
    fontWeight: '600',
  },
  cautionToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cautionToggleText: {
    color: '#848E9C',
    fontSize: 13,
  },
  cautionBox: {
    backgroundColor: '#1E2630',
    padding: 12,
    borderRadius: 8,
    gap: 6,
  },
  cautionBoxText: {
    color: '#848E9C',
    fontSize: 12,
    lineHeight: 16,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    backgroundColor: '#171E26',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    color: '#848E9C',
    fontSize: 13,
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  withdrawBtn: {
    height: 46,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  withdrawBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
