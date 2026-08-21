import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../app/providers/ThemeProvider';
import type { AssetsTabId } from '../model/usePortfolioStore';

interface AssetsTabStripProps {
  activeTab: AssetsTabId;
  onTabChange: (tab: AssetsTabId) => void;
}

const ASSETS_TABS: { id: AssetsTabId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'spot', label: 'Spot' },
  { id: 'futures', label: 'Futures' },
  { id: 'funding', label: 'Funding' },
  { id: 'earn', label: 'Earn' },
];

export function AssetsTabStrip({ activeTab, onTabChange }: AssetsTabStripProps): React.JSX.Element {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {ASSETS_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabBtn}
              onPress={() => onTabChange(tab.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive ? colors.text : colors.text2,
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}
              >
                {tab.label}
              </Text>
              {isActive && <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingTop: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 24,
  },
  tabBtn: {
    paddingVertical: 10,
    position: 'relative',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 14,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: '100%',
    borderRadius: 2,
  },
});
