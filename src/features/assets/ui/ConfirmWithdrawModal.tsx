import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  PanResponder,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { CryptoIcon } from '../../../components/CryptoIcon';
import type { CoinAsset } from './SelectAssetSheet';
import type { WithdrawNetwork } from './ChooseWithdrawNetworkSheet';

export interface ConfirmWithdrawModalProps {
  visible: boolean;
  coin: CoinAsset | null;
  network: WithdrawNetwork | null;
  address: string;
  amount: number;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmWithdrawModal({
  visible,
  coin,
  network,
  address,
  amount,
  onClose,
  onConfirm,
}: ConfirmWithdrawModalProps): React.JSX.Element | null {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [slideAnim] = useState(new Animated.Value(0));

  if (!visible || !coin) return null;

  const rawFee = network?.fee ?? 1.5;
  const networkFee = typeof rawFee === 'number' ? rawFee : parseFloat(rawFee) || 1.5;
  const receiveAmount = Math.max(0, amount - networkFee);
  const usdVal = (receiveAmount * (coin.symbol === 'BTC' ? 96000 : 1)).toFixed(6);

  // Address prefix/suffix formatting (gold highlights for start & end)
  const renderAddressFormatted = () => {
    if (!address) return <Text style={{ color: '#FFFFFF' }}>--</Text>;
    if (address.length <= 12) {
      return <Text style={styles.addressHighlightText}>{address}</Text>;
    }
    const prefix = address.slice(0, 6);
    const middle = address.slice(6, -6);
    const suffix = address.slice(-6);
    return (
      <Text style={styles.addressDisplayContainer}>
        <Text style={styles.addressHighlightText}>{prefix}</Text>
        <Text style={styles.addressMiddleText}>{middle}</Text>
        <Text style={styles.addressHighlightText}>{suffix}</Text>
      </Text>
    );
  };

  const handleSlideComplete = () => {
    onConfirm();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Confirm order</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Large Center Icon */}
          <View style={styles.centerIconWrapper}>
            <CryptoIcon symbol={coin.symbol} size={56} iconUrl={coin.imageUrl} />
          </View>

          {/* Headline Amount */}
          <Text style={styles.headlineText}>Receive {receiveAmount.toFixed(6)} {coin.symbol}</Text>
          <Text style={styles.subheadUsd}>≈ ${usdVal}</Text>

          {/* Dark Card Container */}
          <View style={styles.detailsCard}>
            {/* Network Row */}
            <View style={styles.cardRow}>
              <View style={styles.cardIconCol}>
                <Ionicons name="globe-outline" size={18} color="#848E9C" />
              </View>
              <View style={styles.cardTextCol}>
                <Text style={styles.cardLabel}>Network</Text>
                <Text style={styles.cardValue}>{network?.name ?? 'Tron (TRC20)'}</Text>
              </View>
            </View>

            <View style={styles.cardDivider} />

            {/* Address Row */}
            <View style={styles.cardRow}>
              <View style={styles.cardIconCol}>
                <Ionicons name="person-outline" size={18} color="#848E9C" />
              </View>
              <View style={styles.cardTextCol}>
                <Text style={styles.cardLabel}>Address</Text>
                <View style={styles.addressWrap}>{renderAddressFormatted()}</View>
              </View>
            </View>
          </View>

          {/* Key Details List */}
          <View style={styles.metaList}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Withdrawal Amount</Text>
              <Text style={styles.metaValue}>{amount.toFixed(6)} {coin.symbol}</Text>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Network fee</Text>
              <Text style={styles.metaValue}>{networkFee.toFixed(2)} {coin.symbol}</Text>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Wallet</Text>
              <Text style={styles.metaValue}>Spot Account</Text>
            </View>
          </View>
        </ScrollView>

        {/* Footer Warning & Slide to Confirm */}
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom + 8, 16) }]}>
          <Text style={styles.footerNote}>
            Ensure that the address is correct and on the same network. Transactions cannot be cancelled.
          </Text>

          {/* Slide to Confirm / Tap to Confirm Button */}
          <TouchableOpacity
            style={styles.slideTrack}
            onPress={handleSlideComplete}
            activeOpacity={0.85}
          >
            <View style={styles.slideHandle}>
              <Ionicons name="arrow-forward" size={20} color="#0B0F14" />
            </View>
            <Text style={styles.slideTrackText}>Slide to Confirm</Text>
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
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
    alignItems: 'center',
  },
  centerIconWrapper: {
    marginBottom: 16,
  },
  headlineText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subheadUsd: {
    fontSize: 14,
    color: '#848E9C',
    marginBottom: 24,
  },
  detailsCard: {
    width: '100%',
    backgroundColor: '#212A34',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cardIconCol: {
    marginRight: 12,
    marginTop: 2,
  },
  cardTextCol: {
    flex: 1,
  },
  cardLabel: {
    color: '#848E9C',
    fontSize: 12,
    marginBottom: 4,
  },
  cardValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: 12,
  },
  addressWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  addressDisplayContainer: {
    fontSize: 14,
    lineHeight: 20,
  },
  addressHighlightText: {
    color: '#F0B90B',
    fontWeight: '700',
  },
  addressMiddleText: {
    color: '#FFFFFF',
    fontWeight: '400',
  },
  metaList: {
    width: '100%',
    gap: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLabel: {
    color: '#848E9C',
    fontSize: 13,
  },
  metaValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#171E26',
  },
  footerNote: {
    color: '#848E9C',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 16,
  },
  slideTrack: {
    height: 48,
    backgroundColor: '#3D3B2B',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    position: 'relative',
    justifyContent: 'center',
  },
  slideHandle: {
    position: 'absolute',
    left: 4,
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#F0B90B',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  slideTrackText: {
    color: '#848E9C',
    fontSize: 15,
    fontWeight: '700',
  },
});
