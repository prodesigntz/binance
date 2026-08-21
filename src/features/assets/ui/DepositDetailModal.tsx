import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Rect, Path } from 'react-native-svg';
import { useTheme } from '../../../app/providers/ThemeProvider';
import type { CryptoNetwork } from './ChooseNetworkSheet';
import type { CoinAsset } from './SelectAssetSheet';

export interface DepositDetailModalProps {
  visible: boolean;
  coin: CoinAsset | null;
  network: CryptoNetwork | null;
  onClose: () => void;
  onSwitchNetwork: () => void;
}

// Generate realistic QR code SVG pattern blocks
function DepositQrCode({ size = 200 }: { size?: number }): React.JSX.Element {
  return (
    <View style={[styles.qrWrapper, { width: size, height: size }]}>
      <Svg width={size - 24} height={size - 24} viewBox="0 0 100 100">
        {/* Outer Corner Finder Patterns */}
        {/* Top-Left Finder */}
        <Rect x="5" y="5" width="26" height="26" fill="#000000" rx="3" />
        <Rect x="9" y="9" width="18" height="18" fill="#FFFFFF" rx="2" />
        <Rect x="13" y="13" width="10" height="10" fill="#000000" rx="1.5" />

        {/* Top-Right Finder */}
        <Rect x="69" y="5" width="26" height="26" fill="#000000" rx="3" />
        <Rect x="73" y="9" width="18" height="18" fill="#FFFFFF" rx="2" />
        <Rect x="77" y="13" width="10" height="10" fill="#000000" rx="1.5" />

        {/* Bottom-Left Finder */}
        <Rect x="5" y="69" width="26" height="26" fill="#000000" rx="3" />
        <Rect x="9" y="73" width="18" height="18" fill="#FFFFFF" rx="2" />
        <Rect x="13" y="77" width="10" height="10" fill="#000000" rx="1.5" />

        {/* Data Module Matrix */}
        <Path
          d="M36 5h4v4h-4z M44 5h4v4h-4z M56 5h4v4h-4z M36 13h8v4h-8z M52 13h8v4h-8z M36 21h4v4h-4z M48 21h4v4h-4z M60 21h4v4h-4z M5 36h4v4h-4z M13 36h8v4h-8z M29 36h4v4h-4z M36 36h12v4h-12z M56 36h4v4h-4z M69 36h4v4h-4z M81 36h8v4h-8z M93 36h4v4h-4z M5 44h8v4h-8z M21 44h4v4h-4z M36 44h4v4h-4z M48 44h12v4h-12z M69 44h12v4h-12z M93 44h4v4h-4z M13 52h4v4h-4z M25 52h8v4h-8z M40 52h4v4h-4z M52 52h4v4h-4z M64 52h8v4h-8z M85 52h4v4h-4z M36 60h8v4h-8z M48 60h4v4h-4z M60 60h12v4h-12z M81 60h4v4h-4z M36 69h4v4h-4z M44 69h8v4h-8z M60 69h4v4h-4z M69 69h8v4h-8z M85 69h4v4h-4z M36 77h12v4h-12z M56 77h4v4h-4z M64 77h8v4h-8z M81 77h4v4h-4z M36 85h4v4h-4z M48 85h8v4h-8z M69 85h4v4h-4z M81 85h12v4h-12z M36 93h8v4h-8z M52 93h12v4h-12z M73 93h8v4h-8z"
          fill="#000000"
        />
      </Svg>

      {/* Center Badge Logo */}
      <View style={styles.qrCenterBadge}>
        <Text style={styles.qrBadgeText}>₮</Text>
      </View>
    </View>
  );
}

export function DepositDetailModal({
  visible,
  coin,
  network,
  onClose,
  onSwitchNetwork,
}: DepositDetailModalProps): React.JSX.Element | null {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [copied, setCopied] = useState(false);
  const [showMoreDetails, setShowMoreDetails] = useState(false);

  if (!visible || !coin || !network) return null;

  const depositAddress = 'TMrGBFdGnKUgLhbhf2qcXc7pp5qADDjMXg';
  const prefix = depositAddress.slice(0, 6);
  const middle = depositAddress.slice(6, -6);
  const suffix = depositAddress.slice(-6);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: '#171E26',
            paddingTop: insets.top,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>
            Deposit {coin.symbol}
          </Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
              <Ionicons name="help-circle-outline" size={20} color={colors.text2} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
              <Feather name="share-2" size={18} color={colors.text2} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* QR Code Section */}
          <View style={styles.qrContainer}>
            <DepositQrCode size={210} />
          </View>

          {/* Network Info Row */}
          <View style={styles.sectionBlock}>
            <Text style={[styles.sectionLabel, { color: colors.text2 }]}>Network</Text>
            <View style={styles.networkSelectRow}>
              <View style={styles.networkInfo}>
                <Text style={styles.networkTitle}>
                  {network.name}{' '}
                  <Text style={styles.networkChain}>{network.chain}</Text>
                </Text>
                <Text style={styles.contractText}>Contract Information ***jLj6t</Text>
              </View>

              <TouchableOpacity
                style={styles.switchNetBtn}
                onPress={onSwitchNetwork}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons name="swap-vertical" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Deposit Address Box */}
          <View style={styles.sectionBlock}>
            <Text style={[styles.sectionLabel, { color: colors.text2 }]}>Deposit Address</Text>
            <View style={styles.addressRow}>
              <Text style={styles.addressText}>
                <Text style={styles.highlightText}>{prefix}</Text>
                <Text style={{ color: colors.text }}>{middle}</Text>
                <Text style={styles.highlightText}>{suffix}</Text>
              </Text>

              <TouchableOpacity style={styles.copyBtn} onPress={handleCopy} activeOpacity={0.7}>
                <Ionicons
                  name={copied ? 'checkmark-circle' : 'copy-outline'}
                  size={18}
                  color={copied ? '#0ecb81' : colors.text}
                />
              </TouchableOpacity>
            </View>
            {copied && <Text style={styles.copiedToast}>Address copied to clipboard!</Text>}
          </View>

          {/* Collapsible Details */}
          <TouchableOpacity
            style={styles.moreDetailsBtn}
            onPress={() => setShowMoreDetails(!showMoreDetails)}
            activeOpacity={0.7}
          >
            <Text style={styles.moreDetailsText}>More Details</Text>
            <Ionicons
              name={showMoreDetails ? 'chevron-up' : 'chevron-down'}
              size={14}
              color={colors.text2}
            />
          </TouchableOpacity>

          {showMoreDetails && (
            <View style={styles.detailsContent}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Minimum Deposit</Text>
                <Text style={styles.detailVal}>0.01 {coin.symbol}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Expected Arrival</Text>
                <Text style={styles.detailVal}>1 network confirmations</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Expected Unlock</Text>
                <Text style={styles.detailVal}>1 network confirmations</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom Save & Share Address Button */}
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom + 8, 16) }]}>
          <TouchableOpacity style={styles.saveShareBtn} activeOpacity={0.8}>
            <Text style={styles.saveShareText}>Save and Share Address</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBtn: {
    padding: 2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  qrWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  qrCenterBadge: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#26a17b',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  qrBadgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  sectionBlock: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 6,
  },
  networkSelectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  networkInfo: {
    flex: 1,
  },
  networkTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  networkChain: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  contractText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 3,
  },
  switchNetBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#2B313A',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 16,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addressText: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    marginRight: 10,
  },
  highlightText: {
    color: '#F0B90B',
    fontWeight: '700',
  },
  copyBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#2B313A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  copiedToast: {
    fontSize: 12,
    color: '#0ecb81',
    marginTop: 6,
    fontWeight: '600',
  },
  moreDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 4,
  },
  moreDetailsText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  detailsContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  detailVal: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  saveShareBtn: {
    height: 44,
    backgroundColor: '#F0B90B',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveShareText: {
    color: '#0B0F14',
    fontSize: 15,
    fontWeight: '700',
  },
});
