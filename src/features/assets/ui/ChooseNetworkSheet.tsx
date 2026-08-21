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

export interface CryptoNetwork {
  id: string;
  name: string;
  chain: string;
  confirmations: string;
  minDeposit: string;
  estArrival: string;
}

const NETWORK_PRESETS: Record<string, CryptoNetwork[]> = {
  USDT: [
    {
      id: 'bsc',
      name: 'BSC',
      chain: 'BNB Smart Chain (BEP20)',
      confirmations: '1 block confirmation/s',
      minDeposit: 'Min. deposit >0.01 USDT',
      estArrival: 'Est. arrival ≈ 1 mins',
    },
    {
      id: 'trx',
      name: 'TRX',
      chain: 'Tron (TRC20)',
      confirmations: '1 block confirmation/s',
      minDeposit: 'Min. deposit >0.01 USDT',
      estArrival: 'Est. arrival ≈ 1 mins',
    },
    {
      id: 'eth',
      name: 'ETH',
      chain: 'Ethereum (ERC20)',
      confirmations: '6 block confirmation/s',
      minDeposit: 'Min. deposit >0.001 USDT',
      estArrival: 'Est. arrival ≈ 2 mins',
    },
    {
      id: 'plasma',
      name: 'PLASMA',
      chain: 'Plasma',
      confirmations: '1 block confirmation/s',
      minDeposit: 'Min. deposit >0.000001 USDT',
      estArrival: 'Est. arrival ≈ 1 mins',
    },
    {
      id: 'apt',
      name: 'APT',
      chain: 'Aptos',
      confirmations: '1 block confirmation/s',
      minDeposit: 'Min. deposit >0.00001 USDT',
      estArrival: 'Est. arrival ≈ 1 mins',
    },
  ],
  DEFAULT: [
    {
      id: 'bsc',
      name: 'BSC',
      chain: 'BNB Smart Chain (BEP20)',
      confirmations: '1 block confirmation/s',
      minDeposit: 'Min. deposit >0.01',
      estArrival: 'Est. arrival ≈ 1 mins',
    },
    {
      id: 'mainnet',
      name: 'Native Mainnet',
      chain: 'Mainnet',
      confirmations: '2 block confirmation/s',
      minDeposit: 'Min. deposit >0.001',
      estArrival: 'Est. arrival ≈ 3 mins',
    },
  ],
};

export interface ChooseNetworkSheetProps {
  visible: boolean;
  coinSymbol: string;
  onClose: () => void;
  onSelectNetwork: (network: CryptoNetwork) => void;
}

export function ChooseNetworkSheet({
  visible,
  coinSymbol,
  onClose,
  onSelectNetwork,
}: ChooseNetworkSheetProps): React.JSX.Element | null {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  if (!visible) return null;

  const networks = NETWORK_PRESETS[coinSymbol.toUpperCase()] ?? NETWORK_PRESETS.DEFAULT;

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
                maxHeight: '82%',
              },
            ]}
          >
            {/* Top Handle Indicator */}
            <View style={styles.handleBar} />

            {/* Sheet Title */}
            <Text style={styles.title}>Choose Network</Text>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollList}>
              {networks.map((net) => (
                <TouchableOpacity
                  key={net.id}
                  style={styles.netCard}
                  onPress={() => onSelectNetwork(net)}
                  activeOpacity={0.7}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.netName}>
                      {net.name}{' '}
                      <Text style={styles.netChain}>{net.chain}</Text>
                    </Text>
                  </View>
                  <View style={styles.divider} />
                  <Text style={styles.specText}>{net.confirmations}</Text>
                  <Text style={styles.specText}>{net.minDeposit}</Text>
                  <Text style={styles.specText}>{net.estArrival}</Text>
                </TouchableOpacity>
              ))}

              {/* Bottom Warning Box */}
              <View style={styles.warningBox}>
                <Ionicons name="information-circle-outline" size={16} color="rgba(255,255,255,0.5)" style={{ marginRight: 6 }} />
                <Text style={styles.warningText}>
                  Please note that only supported networks on Binance platform are shown, if you deposit via another network your assets may be lost.
                </Text>
              </View>
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
    paddingTop: 10,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#384250',
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 14,
  },
  scrollList: {
    paddingBottom: 16,
    gap: 12,
  },
  netCard: {
    backgroundColor: '#171F28',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 14,
  },
  cardHeader: {
    marginBottom: 8,
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
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 8,
  },
  specText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 2,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    lineHeight: 16,
  },
});
