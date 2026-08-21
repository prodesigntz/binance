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
  { id: 'funding', label: 'Funding' },
  { id: 'earn', label: 'Earn' },
  { id: 'spot', label: 'Spot' },
  { id: 'futures', label: 'Futures' },
];

export function AssetsTabStrip({ activeTab, onTabChange }: AssetsTabStripProps): React.JSX.Element {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
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
                    color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.45)',
                    fontWeight: isActive ? '700' : '600',
                    fontSize: 18,
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 20,
  },
  tabBtn: {
    paddingVertical: 6,
    alignItems: 'center',
  },
  tabLabel: {},
});
