import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../app/providers/ThemeProvider';
import type { WithdrawalRecord } from '../model/usePortfolioStore';

export interface WithdrawDetailModalProps {
  visible: boolean;
  record: WithdrawalRecord | null;
  onClose: () => void;
  onWithdrawAgain?: () => void;
}

export function WithdrawDetailModal({
  visible,
  record,
  onClose,
  onWithdrawAgain,
}: WithdrawDetailModalProps): React.JSX.Element | null {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!visible || !record) return null;

  const handleCopy = (field: string, text: string) => {
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const isCompleted = record.status === 'Completed';

  // Format network code e.g. TRX or TRC20
  const shortNetwork = record.network.includes('Tron')
    ? 'TRX'
    : record.network.includes('BEP20')
    ? 'BSC'
    : record.network.includes('ERC20')
    ? 'ETH'
    : record.network;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Withdrawal Details</Text>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.7}>
            <Ionicons name="headset-outline" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Top Hero Section */}
          <View style={styles.heroSection}>
            <Text style={styles.amountDisplay}>
              -{record.amount.toFixed(6)} {record.symbol}
            </Text>

            {/* Status Pill */}
            <View style={styles.statusRow}>
              <Ionicons
                name={isCompleted ? 'checkmark-circle' : 'time-outline'}
                size={18}
                color={isCompleted ? '#0ECB81' : '#F0B90B'}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: isCompleted ? '#0ECB81' : '#F0B90B' },
                ]}
              >
                {record.status}
              </Text>
            </View>

            {/* Info Subtext */}
            <Text style={styles.subtextNotice}>
              Crypto transferred out of Binance. Please contact the recipient platform for your transaction receipt.
            </Text>

            {/* Yellow Help Link */}
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.whyLinkText}>Why hasn't my withdrawal arrived?</Text>
            </TouchableOpacity>
          </View>

          {/* Copy Toast Alert */}
          {copiedField && (
            <View style={styles.toastBox}>
              <Ionicons name="checkmark-circle-outline" size={16} color="#0ECB81" style={{ marginRight: 6 }} />
              <Text style={styles.toastText}>Copied {copiedField} to clipboard!</Text>
            </View>
          )}

          {/* Key/Value Details Section */}
          <View style={styles.detailsList}>
            {/* Network Row */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Network</Text>
              <Text style={styles.detailValue}>{shortNetwork}</Text>
            </View>

            {/* Address Row */}
            <View style={styles.detailRowVertical}>
              <View style={styles.detailRowHeader}>
                <Text style={styles.detailLabel}>Address</Text>
                <View style={styles.addressRightBlock}>
                  <Text style={styles.addressText}>{record.address}</Text>
                  <TouchableOpacity
                    onPress={() => handleCopy('Address', record.address)}
                    style={styles.copyIconBtn}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="copy-outline" size={16} color="#848E9C" />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.saveAddressAlign} activeOpacity={0.7}>
                <Text style={styles.saveAddressText}>Save Address</Text>
              </TouchableOpacity>
            </View>

            {/* Txid Row */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Txid</Text>
              <View style={styles.valueWithCopy}>
                <Text style={styles.detailValue} numberOfLines={1} ellipsizeMode="middle">
                  {record.txId.length > 20
                    ? `Off-chain Transfer ${record.txId.slice(0, 12)}`
                    : record.txId}
                </Text>
                <TouchableOpacity
                  onPress={() => handleCopy('Txid', record.txId)}
                  style={styles.copyIconBtn}
                  activeOpacity={0.7}
                >
                  <Ionicons name="copy-outline" size={16} color="#848E9C" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Amount Row */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount</Text>
              <Text style={styles.detailValue}>{record.amount.toFixed(6)} {record.symbol}</Text>
            </View>

            {/* Network Fee Row */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Network fee</Text>
              <Text style={styles.detailValue}>{record.fee.toFixed(2)} {record.symbol}</Text>
            </View>

            {/* Withdrawal Wallet Row */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Withdrawal Wallet</Text>
              <Text style={styles.detailValue}>{record.wallet}</Text>
            </View>

            {/* Date Row */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{record.createdAt}</Text>
            </View>
          </View>

          {/* Scam Report Button */}
          <TouchableOpacity style={styles.scamReportBtn} activeOpacity={0.7}>
            <Ionicons name="chatbox-ellipses-outline" size={16} color="#848E9C" style={{ marginRight: 6 }} />
            <Text style={styles.scamReportText}>Scam Report</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Bottom CTA Button: Withdraw Again */}
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom + 8, 16) }]}>
          <TouchableOpacity
            style={styles.withdrawAgainBtn}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.withdrawAgainBtnText}>Withdraw Again</Text>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  amountDisplay: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '700',
  },
  subtextNotice: {
    color: '#848E9C',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  whyLinkText: {
    color: '#F0B90B',
    fontSize: 13,
    fontWeight: '600',
  },
  toastBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#212A34',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 16,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  detailsList: {
    gap: 20,
    marginBottom: 32,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailRowVertical: {
    gap: 4,
  },
  detailRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  addressRightBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    marginLeft: 20,
  },
  addressText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'right',
    flexShrink: 1,
  },
  saveAddressAlign: {
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  saveAddressText: {
    color: '#F0B90B',
    fontSize: 13,
    fontWeight: '600',
  },
  detailLabel: {
    color: '#848E9C',
    fontSize: 14,
  },
  detailValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  valueWithCopy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  copyIconBtn: {
    padding: 2,
    marginLeft: 4,
  },
  scamReportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  scamReportText: {
    color: '#848E9C',
    fontSize: 14,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#171E26',
  },
  withdrawAgainBtn: {
    height: 48,
    backgroundColor: '#F0B90B',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  withdrawAgainBtnText: {
    color: '#0B0F14',
    fontSize: 16,
    fontWeight: '700',
  },
});
