import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { CryptoIcon } from '../../../components/CryptoIcon';
import { usePortfolioStore, type WithdrawalRecord } from '../model/usePortfolioStore';

export interface WithdrawHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectWithdrawal: (record: WithdrawalRecord) => void;
}

export function WithdrawHistoryModal({
  visible,
  onClose,
  onSelectWithdrawal,
}: WithdrawHistoryModalProps): React.JSX.Element | null {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const history = usePortfolioStore((state) => state.withdrawalHistory);

  if (!visible) return null;

  const renderStatusBadge = (status: WithdrawalRecord['status']) => {
    let bg = '#2B2719';
    let textCol = '#F0B90B';
    if (status === 'Completed') {
      bg = 'rgba(14, 203, 129, 0.15)';
      textCol = '#0ECB81';
    } else if (status === 'Failed') {
      bg = 'rgba(246, 70, 93, 0.15)';
      textCol = '#F6465D';
    }
    return (
      <View style={[styles.statusBadge, { backgroundColor: bg }]}>
        <Text style={[styles.statusBadgeText, { color: textCol }]}>{status}</Text>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Withdraw History</Text>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.7}>
            <Ionicons name="filter-outline" size={20} color={colors.text2} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.historyCard}
              onPress={() => onSelectWithdrawal(item)}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeaderRow}>
                <View style={styles.coinLeft}>
                  <CryptoIcon symbol={item.symbol} size={28} />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.coinSymbolText}>{item.symbol}</Text>
                    <Text style={styles.networkText}>{item.network}</Text>
                  </View>
                </View>

                <View style={styles.amountRight}>
                  <Text style={styles.amountNumText}>-{item.amount.toFixed(6)}</Text>
                  {renderStatusBadge(item.status)}
                </View>
              </View>

              <View style={styles.cardFooterRow}>
                <Text style={styles.dateText}>{item.createdAt}</Text>
                <Ionicons name="chevron-forward" size={14} color="#848E9C" />
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={44} color="#848E9C" />
              <Text style={styles.emptyText}>No withdrawal history found</Text>
            </View>
          }
        />
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
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: 12,
  },
  historyCard: {
    paddingVertical: 4,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  coinLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinSymbolText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  networkText: {
    color: '#848E9C',
    fontSize: 12,
    marginTop: 2,
  },
  amountRight: {
    alignItems: 'flex-end',
  },
  amountNumText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    color: '#848E9C',
    fontSize: 12,
  },
  emptyState: {
    padding: 48,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyText: {
    color: '#848E9C',
    fontSize: 14,
  },
});
