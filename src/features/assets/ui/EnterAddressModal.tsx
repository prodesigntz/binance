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
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../app/providers/ThemeProvider';
import type { WithdrawNetwork } from './ChooseWithdrawNetworkSheet';
import type { CoinAsset } from './SelectAssetSheet';

export interface EnterAddressModalProps {
  visible: boolean;
  coin: CoinAsset | null;
  selectedNetwork: WithdrawNetwork | null;
  onClose: () => void;
  onOpenNetworkSheet: () => void;
  onProceedNext: (address: string, network: WithdrawNetwork) => void;
}

const RECENT_ADDRESS = 'TVDDGNnA9L3d7Ki7ZN8gZAizK3KdzxvD17';

export function EnterAddressModal({
  visible,
  coin,
  selectedNetwork,
  onClose,
  onOpenNetworkSheet,
  onProceedNext,
}: EnterAddressModalProps): React.JSX.Element | null {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [address, setAddress] = useState('');

  if (!visible) return null;

  const isReady = address.trim().length >= 10 && selectedNetwork !== null;

  const handlePaste = () => {
    setAddress(RECENT_ADDRESS);
  };

  const handleSelectRecent = () => {
    setAddress(RECENT_ADDRESS);
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
          {/* Top Network Selector Pill Button */}
          <TouchableOpacity
            style={[styles.networkPill, { backgroundColor: '#212A34' }]}
            onPress={onOpenNetworkSheet}
            activeOpacity={0.7}
          >
            <Ionicons name="globe-outline" size={15} color={colors.text2} style={{ marginRight: 6 }} />
            <Text style={[styles.networkPillText, { color: selectedNetwork ? colors.text : colors.text2 }]}>
              {selectedNetwork ? `${selectedNetwork.name} ${selectedNetwork.chain}` : 'Select Network'}
            </Text>
          </TouchableOpacity>

          {/* Large Address Input Box */}
          <View style={styles.addressBox}>
            <TextInput
              style={[styles.addressInput, { color: colors.text }]}
              placeholder="Address"
              placeholderTextColor="rgba(255,255,255,0.25)"
              value={address}
              onChangeText={setAddress}
              multiline
            />
          </View>

          {/* Quick Action Pills (Address Book, Paste, Scan) */}
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
          </View>

          <View style={styles.divider} />

          {/* Recent Withdrawals Section */}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 20,
  },
  networkPillText: {
    fontSize: 13,
    fontWeight: '500',
  },
  addressBox: {
    minHeight: 100,
    marginBottom: 16,
  },
  addressInput: {
    fontSize: 32,
    fontWeight: '600',
    padding: 0,
    textAlignVertical: 'top',
  },
  actionPillsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
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
