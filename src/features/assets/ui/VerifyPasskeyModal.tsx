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

export interface VerifyPasskeyModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function VerifyPasskeyModal({
  visible,
  onClose,
  onSuccess,
}: VerifyPasskeyModalProps): React.JSX.Element | null {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.iconBtn} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <TouchableOpacity onPress={onClose} style={styles.iconBtn} activeOpacity={0.7}>
            <Ionicons name="close" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Verify with passkey</Text>
          <Text style={styles.subtitle}>
            Your device will ask your fingerprint, face, or screen lock.
          </Text>

          {/* Center Graphic */}
          <View style={styles.centerGraphicContainer}>
            <View style={styles.graphicCircle}>
              <MaterialCommunityIcons name="account-key-outline" size={54} color="#F0B90B" />
              <View style={styles.dotsBadge}>
                <Text style={styles.dotsText}>***_</Text>
              </View>
            </View>
          </View>

          {/* Error / Status Text */}
          <Text style={styles.statusErrorText}>
            Verification cancelled. Please try again or switch to another verification method.(608003)
          </Text>

          {/* Warning Box */}
          <View style={styles.warningBox}>
            <Ionicons name="information-circle-outline" size={18} color="#F0B90B" style={{ marginTop: 2, marginRight: 8 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.warningText}>
                Please make sure you have the 'Passwords' app on your iPhone and try again.
              </Text>
              <TouchableOpacity activeOpacity={0.7} style={{ marginTop: 4 }}>
                <Text style={styles.warningLink}>Download Passwords App</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Primary Action Button */}
          <TouchableOpacity
            style={styles.verifyBtn}
            onPress={onSuccess}
            activeOpacity={0.8}
          >
            <Text style={styles.verifyBtnText}>Verify Again</Text>
          </TouchableOpacity>

          {/* Secondary Action Link */}
          <TouchableOpacity onPress={onSuccess} style={styles.altMethodBtn} activeOpacity={0.7}>
            <Text style={styles.altMethodText}>My Passkeys Are Not Available</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom + 8, 16) }]}>
          <View style={styles.riskShieldRow}>
            <Ionicons name="shield-checkmark-outline" size={14} color="#848E9C" style={{ marginRight: 6 }} />
            <Text style={styles.riskShieldText}>Protected by Binance Risk</Text>
          </View>
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
  iconBtn: {
    padding: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#848E9C',
    lineHeight: 20,
    marginBottom: 32,
  },
  centerGraphicContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  graphicCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#F0B90B',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#212A34',
    position: 'relative',
  },
  dotsBadge: {
    position: 'absolute',
    bottom: -10,
    backgroundColor: '#171E26',
    borderWidth: 1,
    borderColor: '#F0B90B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  dotsText: {
    color: '#F0B90B',
    fontWeight: '700',
    fontSize: 12,
  },
  statusErrorText: {
    color: '#848E9C',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#2B2719',
    borderRadius: 10,
    padding: 14,
    marginBottom: 28,
  },
  warningText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    lineHeight: 16,
  },
  warningLink: {
    color: '#F0B90B',
    fontSize: 12,
    fontWeight: '700',
  },
  verifyBtn: {
    height: 48,
    backgroundColor: '#F0B90B',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  verifyBtnText: {
    color: '#0B0F14',
    fontSize: 16,
    fontWeight: '700',
  },
  altMethodBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  altMethodText: {
    color: '#F0B90B',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 12,
  },
  riskShieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riskShieldText: {
    color: '#848E9C',
    fontSize: 12,
  },
});
