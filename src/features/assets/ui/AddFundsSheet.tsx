import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons, Feather, Octicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../app/providers/ThemeProvider';

export interface AddFundsSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelectMethod?: (method: 'deposit' | 'pay' | 'p2p') => void;
}

export function AddFundsSheet({
  visible,
  onClose,
  onSelectMethod,
}: AddFundsSheetProps): React.JSX.Element | null {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  if (!visible) return null;

  const handleSelect = (method: 'deposit' | 'pay' | 'p2p') => {
    onSelectMethod?.(method);
    onClose();
  };

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
                paddingBottom: Math.max(insets.bottom + 16, 24),
              },
            ]}
          >
            {/* Top Handle Indicator */}
            <View style={styles.handleBar} />

            {/* Sheet Title */}
            <Text style={styles.title}>Select Deposit Method</Text>

            {/* Option 1: Deposit Asset */}
            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => handleSelect('deposit')}
              activeOpacity={0.7}
            >
              <View style={styles.iconBox}>
                <Feather name="download" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.textBox}>
                <Text style={styles.optionTitle}>Deposit Asset</Text>
                <Text style={styles.optionSubtitle}>
                  Deposit Crypto from other exchanges/wallets to Binance
                </Text>
              </View>
            </TouchableOpacity>

            {/* Option 2: Receive Via Binance Pay */}
            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => handleSelect('pay')}
              activeOpacity={0.7}
            >
              <View style={styles.iconBox}>
                <Ionicons name="qr-code-outline" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.textBox}>
                <Text style={styles.optionTitle}>Receive Via Binance Pay</Text>
                <Text style={styles.optionSubtitle}>
                  Receive crypto from other Binance users
                </Text>
              </View>
            </TouchableOpacity>

            {/* Option 3: P2P Trading */}
            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => handleSelect('p2p')}
              activeOpacity={0.7}
            >
              <View style={styles.iconBox}>
                <Octicons name="people" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.textBox}>
                <Text style={styles.optionTitle}>P2P Trading</Text>
                <Text style={styles.optionSubtitle}>
                  Buy crypto via Bank Transfer, Mobile Payment and more
                </Text>
              </View>
            </TouchableOpacity>
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
    marginBottom: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#171F28',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 16,
    marginBottom: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  textBox: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  optionSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 3,
    lineHeight: 16,
  },
});
