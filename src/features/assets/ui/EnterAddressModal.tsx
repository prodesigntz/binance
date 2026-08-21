import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { ChooseWithdrawNetworkSheet, type WithdrawNetwork } from './ChooseWithdrawNetworkSheet';
import type { CoinAsset } from './SelectAssetSheet';

export interface EnterAddressModalProps {
  visible: boolean;
  coin: CoinAsset | null;
  selectedNetwork: WithdrawNetwork | null;
  onSelectNetwork: (network: WithdrawNetwork) => void;
  onClose: () => void;
  onProceedNext: (address: string, network: WithdrawNetwork) => void;
}

const RECENT_ADDRESS = 'TVDDGNna9L3d7Ki7ZN8gZAizK3KdzxvD17';

export function EnterAddressModal({
  visible,
  coin,
  selectedNetwork,
  onSelectNetwork,
  onClose,
  onProceedNext,
}: EnterAddressModalProps): React.JSX.Element | null {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [address, setAddress] = useState('');
  const [isNetworkSheetOpen, setIsNetworkSheetOpen] = useState(false);

  if (!visible) return null;

  const isReady = address.trim().length >= 10 && selectedNetwork !== null;

  const handlePaste = () => {
    setAddress(RECENT_ADDRESS);
  };

  const handleClear = () => {
    setAddress('');
  };

  const handleSelectRecent = () => {
    setAddress(RECENT_ADDRESS);
  };

  // Address Prefix/Suffix Highlighting
  const renderAddressFormatted = () => {
    if (!address) return null;
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
          <Text style={[styles.title, { color: colors.text }]}>Enter address</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
              <Ionicons name="help-circle-outline" size={20} color={colors.text2} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
              <Ionicons name="document-text-outline" size={19} color={colors.text2} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Top Network Selector Pill / Badge */}
          <TouchableOpacity
            style={[styles.networkPill, { backgroundColor: '#212A34' }]}
            onPress={() => setIsNetworkSheetOpen(true)}
            activeOpacity={0.7}
          >
            {selectedNetwork ? (
              <View style={styles.selectedNetBadge}>
                <View style={[styles.redDot, { backgroundColor: selectedNetwork.color ?? '#ef0027' }]} />
                <Text style={styles.selectedNetName}>{selectedNetwork.name}</Text>
              </View>
            ) : (
              <View style={styles.unselectedNetBadge}>
                <Ionicons name="globe-outline" size={15} color={colors.text2} style={{ marginRight: 6 }} />
                <Text style={[styles.networkPillText, { color: colors.text2 }]}>
                  Select Network
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Large Address Input & Formatted Overlay */}
          <View style={styles.addressBox}>
            <TextInput
              style={[
                styles.addressInput,
                { color: address ? 'transparent' : colors.text },
              ]}
              placeholder="Address"
              placeholderTextColor="rgba(255,255,255,0.25)"
              value={address}
              onChangeText={setAddress}
              multiline
            />
            {/* Highlighting Overlay when address is filled */}
            {address ? (
              <View style={styles.addressOverlay} pointerEvents="none">
                {renderAddressFormatted()}
              </View>
            ) : null}
          </View>

          {/* Quick Action Pills (Address Book, Paste, Scan, Clear) */}
          <View style={styles.actionPillsRow}>
            <TouchableOpacity style={styles.actionPill} activeOpacity={0.7}>
              <Ionicons name="person-outline" size={14} color={colors.text} style={{ marginRight: 4 }} />
              <Text style={styles.actionPillText}>Address Book</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionPill} onPress={handlePaste} activeOpacity={0.7}>
              <Ionicons name="clipboard-outline" size={14} color={colors.text} style={{ marginRight: 4 }} />
              <Text style={styles.actionPillText}>Paste</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionPill} activeOpacity={0.7}>
              <MaterialCommunityIcons name="qrcode-scan" size={14} color={colors.text} style={{ marginRight: 4 }} />
              <Text style={styles.actionPillText}>Scan</Text>
            </TouchableOpacity>

            {address.length > 0 && (
              <TouchableOpacity style={styles.actionPill} onPress={handleClear} activeOpacity={0.7}>
                <Ionicons name="close" size={14} color={colors.text} style={{ marginRight: 2 }} />
                <Text style={styles.actionPillText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Info Note Banner */}
          <View style={styles.infoBanner}>
            <Ionicons name="information-circle-outline" size={16} color="rgba(255,255,255,0.6)" style={{ marginRight: 8 }} />
            <Text style={styles.infoBannerText}>
              Note: USDT withdrawals on BSC are now on the lowest fees!
            </Text>
          </View>

          {/* Recent Withdrawals Section (Only if no address is entered) */}
          {!address && (
            <>
              <View style={styles.divider} />
              <View style={styles.recentSection}>
                <TouchableOpacity style={styles.recentHeader} activeOpacity={0.7}>
                  <Text style={[styles.recentTitle, { color: colors.text }]}>Recent Withdrawals</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.text2} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.recentItemCard}
                  onPress={handleSelectRecent}
                  activeOpacity={0.7}
                >
                  <Text style={styles.recentAddressText} numberOfLines={1}>
                    {RECENT_ADDRESS}
                  </Text>
                  <View style={styles.networkBadge}>
                    <Text style={styles.networkBadgeText}>TRX</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>

        {/* Sticky Footer: Next Button */}
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom + 8, 16) }]}>
          <TouchableOpacity
            style={[
              styles.nextBtn,
              { backgroundColor: isReady ? '#F0B90B' : '#3d3b2b' },
            ]}
            disabled={!isReady}
            onPress={() => isReady && selectedNetwork && onProceedNext(address, selectedNetwork)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.nextText,
                { color: isReady ? '#0B0F14' : 'rgba(255,255,255,0.35)' },
              ]}
            >
              Next
            </Text>
          </TouchableOpacity>
        </View>

        {/* Choose Network Bottom Sheet embedded directly inside EnterAddressModal */}
        <ChooseWithdrawNetworkSheet
          visible={isNetworkSheetOpen}
          selectedNetworkId={selectedNetwork?.id}
          onClose={() => setIsNetworkSheetOpen(false)}
          onSelectNetwork={(net) => {
            onSelectNetwork(net);
            setIsNetworkSheetOpen(false);
          }}
        />
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
    paddingTop: 14,
    paddingBottom: 24,
  },
  networkPill: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    marginBottom: 16,
  },
  unselectedNetBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  networkPillText: {
    fontSize: 13,
    fontWeight: '500',
  },
  selectedNetBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 6,
  },
  redDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  selectedNetName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  addressBox: {
    minHeight: 80,
    position: 'relative',
    marginBottom: 16,
  },
  addressInput: {
    fontSize: 32,
    fontWeight: '600',
    padding: 0,
    textAlignVertical: 'top',
  },
  addressOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  addressDisplayContainer: {
    fontSize: 32,
    fontWeight: '600',
    lineHeight: 40,
  },
  addressHighlightText: {
    color: '#F0B90B',
    fontWeight: '700',
  },
  addressMiddleText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  actionPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#212A34',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  actionPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#242219',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginBottom: 20,
  },
  recentSection: {},
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  recentTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  recentItemCard: {
    marginBottom: 8,
  },
  recentAddressText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
    marginBottom: 4,
  },
  networkBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#2b2719',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  networkBadgeText: {
    color: '#F0B90B',
    fontSize: 11,
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  nextBtn: {
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
