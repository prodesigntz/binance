import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../app/providers/ThemeProvider';

export interface WithdrawNetwork {
  id: string;
  name: string;
  chain: string;
  fee: string;
  feeUsd: string;
  minWithdraw: string;
  arrivalTime: string;
  color?: string;
}

const WITHDRAW_NETWORKS: WithdrawNetwork[] = [
  {
    id: 'trx',
    name: 'TRX',
    chain: 'Tron (TRC20)',
    fee: '1.50 USDT',
    feeUsd: '$1.49',
    minWithdraw: '5 USDT',
    arrivalTime: '≈ 1 mins',
    color: '#ef0027',
  },
  {
    id: 'sol',
    name: 'SOL',
    chain: 'Solana',
    fee: '0.30 USDT',
    feeUsd: '$0.299999',
    minWithdraw: '5 USDT',
    arrivalTime: '≈ 1 mins',
    color: '#14f195',
  },
  {
    id: 'bsc',
    name: 'BSC',
    chain: 'BNB Smart Chain (BEP20)',
    fee: '0.01 USDT',
    feeUsd: '$0.009999',
    minWithdraw: '3 USDT',
    arrivalTime: '≈ 1 mins',
    color: '#f3ba2f',
  },
  {
    id: 'opbnb',
    name: 'OPBNB',
    chain: 'opBNB',
    fee: '0.015 USDT',
    feeUsd: '$0.014999',
    minWithdraw: '5 USDT',
    arrivalTime: '≈ 2 mins',
    color: '#f3ba2f',
  },
  {
    id: 'eth',
    name: 'ETH',
    chain: 'Ethereum (ERC20)',
    fee: '0.30 USDT',
    feeUsd: '$0.299999',
    minWithdraw: '5 USDT',
    arrivalTime: '≈ 2 mins',
    color: '#627eea',
  },
  {
    id: 'plasma',
    name: 'PLASMA',
    chain: 'Plasma',
    fee: '0.012 USDT',
    feeUsd: '$0.011999',
    minWithdraw: '5 USDT',
    arrivalTime: '≈ 1 mins',
    color: '#02a47e',
  },
];

export interface ChooseWithdrawNetworkSheetProps {
  visible: boolean;
  selectedNetworkId?: string;
  onClose: () => void;
  onSelectNetwork: (network: WithdrawNetwork) => void;
}

export function ChooseWithdrawNetworkSheet({
  visible,
  selectedNetworkId,
  onClose,
  onSelectNetwork,
}: ChooseWithdrawNetworkSheetProps): React.JSX.Element | null {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <TouchableWithoutFeedback>
          <View
            style={[
              styles.sheetContainer,
              {
                backgroundColor: '#1E2630',
                paddingBottom: Math.max(insets.bottom + 12, 20),
                maxHeight: '88%',
              },
            ]}
          >
            {/* Top Bar */}
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.backBtn} activeOpacity={0.7}>
                <Ionicons name="arrow-back" size={20} color={colors.text} />
              </TouchableOpacity>
              <Text style={styles.title}>Choose Network</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Ionicons name="information-circle-outline" size={20} color={colors.text2} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollList}>
              {WITHDRAW_NETWORKS.map((net) => {
                const isSelected = selectedNetworkId === net.id;
                return (
                  <TouchableOpacity
                    key={net.id}
                    style={[
                      styles.netCard,
                      isSelected && styles.netCardSelected,
                    ]}
                    onPress={() => onSelectNetwork(net)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.cardHeader}>
                      <View style={[styles.avatar, { backgroundColor: net.color ?? '#F0B90B' }]}>
                        <Text style={styles.avatarText}>{net.name.slice(0, 2)}</Text>
                      </View>
                      <Text style={styles.netName}>
                        {net.name}{' '}
                        <Text style={styles.netChain}>{net.chain}</Text>
                      </Text>
                    </View>

                    <Text style={styles.specText}>
                      Fee {net.fee} ≈ {net.feeUsd}
                    </Text>
                    <Text style={styles.specText}>Minimum withdrawal {net.minWithdraw}</Text>
                    <Text style={styles.specText}>Arrival time {net.arrivalTime}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backBtn: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scrollList: {
    paddingBottom: 16,
    gap: 12,
  },
  netCard: {
    backgroundColor: '#171F28',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 14,
  },
  netCardSelected: {
    borderColor: '#FFFFFF',
    backgroundColor: '#1F2936',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: '#0B0F14',
    fontWeight: '700',
    fontSize: 10,
  },
  netName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  netChain: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  specText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 3,
  },
});
