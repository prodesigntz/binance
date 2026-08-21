import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../app/providers/ThemeProvider';
import type { CoinAsset } from './SelectAssetSheet';

export interface WithdrawProcessingModalProps {
  visible: boolean;
  coin: CoinAsset | null;
  amount: number;
  onClose: () => void;
  onViewHistory: () => void;
}

export function WithdrawProcessingModal({
  visible,
  coin,
  amount,
  onClose,
  onViewHistory,
}: WithdrawProcessingModalProps): React.JSX.Element | null {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  if (!visible || !coin) return null;

  // Format estimated completion time 2 mins in future
  const now = new Date();
  now.setMinutes(now.getMinutes() + 2);
  const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Hourglass Icon */}
          <View style={styles.iconContainer}>
            <Ionicons name="hourglass-outline" size={72} color="#F0B90B" />
          </View>

          {/* Title & Amount */}
          <Text style={styles.title}>Withdrawal Processing</Text>
          <Text style={styles.amountText}>{amount.toFixed(6)} {coin.symbol}</Text>

          {/* Subtitles */}
          <Text style={styles.estTimeText}>
            Estimated completion time: <Text style={styles.boldTime}>{formattedTime}</Text>
          </Text>
          <Text style={styles.emailNoteText}>
            You will receive an email once withdrawal is completed.
          </Text>
        </ScrollView>

        {/* Sticky Footer: View History Button */}
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom + 8, 16) }]}>
          <TouchableOpacity
            style={styles.historyBtn}
            onPress={onViewHistory}
            activeOpacity={0.8}
          >
            <Text style={styles.historyBtnText}>View History</Text>
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
    paddingHorizontal: 16,
    height: 48,
  },
  backBtn: {
    padding: 4,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 48,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 32,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(240, 185, 11, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  amountText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  estTimeText: {
    color: '#848E9C',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 8,
  },
  boldTime: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emailNoteText: {
    color: '#848E9C',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#171E26',
  },
  historyBtn: {
    height: 48,
    backgroundColor: '#F0B90B',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyBtnText: {
    color: '#0B0F14',
    fontSize: 16,
    fontWeight: '700',
  },
});
