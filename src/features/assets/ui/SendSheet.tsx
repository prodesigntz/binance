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
import { Ionicons, Feather, Octicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../app/providers/ThemeProvider';

export interface SendSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelectMethod?: (method: 'internal' | 'withdraw' | 'p2p' | 'sell_fiat') => void;
}

export function SendSheet({
  visible,
  onClose,
  onSelectMethod,
}: SendSheetProps): React.JSX.Element | null {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  if (!visible) return null;

  const handleSelect = (method: 'internal' | 'withdraw' | 'p2p' | 'sell_fiat') => {
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
                paddingBottom: Math.max(insets.bottom + 12, 20),
                maxHeight: '85%',
              },
            ]}
          >
            {/* Top Handle Bar */}
            <View style={styles.handleBar} />

            {/* Sheet Title */}
            <Text style={styles.title}>Select Withdraw Method</Text>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollList}>
              {/* Option 1: Send to Binance users */}
              <TouchableOpacity
                style={styles.optionCard}
                onPress={() => handleSelect('internal')}
                activeOpacity={0.7}
              >
                <View style={styles.iconBox}>
                  <Ionicons name="qr-code-outline" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.textBox}>
                  <Text style={styles.optionTitle}>Send to Binance users</Text>
                  <Text style={styles.optionSubtitle}>
                    Binance internal transfer, send via Email/Phone/ID
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Option 2: Withdraw Asset */}
              <TouchableOpacity
                style={styles.optionCard}
                onPress={() => handleSelect('withdraw')}
                activeOpacity={0.7}
              >
                <View style={styles.iconBox}>
                  <Feather name="upload" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.textBox}>
                  <Text style={styles.optionTitle}>Withdraw Asset</Text>
                  <Text style={styles.optionSubtitle}>
                    Withdraw Crypto from Binance to other exchanges/wallets
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
                    Sell directly to users. Competitive pricing. Local payments
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Option 4: Sell to TZS */}
              <TouchableOpacity
                style={styles.optionCard}
                onPress={() => handleSelect('sell_fiat')}
                activeOpacity={0.7}
              >
                <View style={styles.iconBox}>
                  <Ionicons name="wallet-outline" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.textBox}>
                  <Text style={styles.optionTitle}>Sell to TZS</Text>
                  <Text style={styles.optionSubtitle}>
                    Sell crypto easily to your account.
                  </Text>
                </View>
              </TouchableOpacity>
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
    marginBottom: 16,
  },
  scrollList: {
    paddingBottom: 12,
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#171F28',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 16,
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
