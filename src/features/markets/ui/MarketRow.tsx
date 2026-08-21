import React from 'react';
import { Pressable, Text, View, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { PercentBadge } from '../../../shared/ui/PercentBadge';

import { CryptoIcon } from '../../../components/CryptoIcon';

const COIN_LOGO_SIZE = 40;

export type MarketRowPropsBase = {
  lastPriceLabel: string;
  approxUsdLabel: string;
  changePct: number;
  onPress: () => void;
};

export type MarketRowPropsCrypto = MarketRowPropsBase & {
  variant: 'crypto';
  image: string;
  symbol: string;
  name: string;
};

export type MarketRowPropsSpot = MarketRowPropsBase & {
  variant: 'spot';
  base: string;
  quote: string;
  name?: string;
  image?: string;
  volumeLabel: string;
  leverageLabel?: string;
};

/** USDⓈ-M: symbol (e.g. BTCUSDT), "Perp" pill, volume in USDT. */
export type MarketRowPropsUsdm = MarketRowPropsBase & {
  variant: 'usdm';
  symbol: string;
  volumeLabel: string;
  isFavorite?: boolean;
};

/** COIN-M: symbol (e.g. BTCUSD CM), contract label "Perp" or "Qtly 0327", volume in Cont. */
export type MarketRowPropsCoinm = MarketRowPropsBase & {
  variant: 'coinm';
  symbol: string;
  contractLabel: string;
  volumeLabel: string;
};

/** Options (images 1–2): contract name + volume USDT | last price + $ | 24h chg% pill. */
export type MarketRowPropsOptions = MarketRowPropsBase & {
  variant: 'options';
  name: string;
  volumeLabel: string;
};

export type MarketRowProps =
  | MarketRowPropsCrypto
  | MarketRowPropsSpot
  | MarketRowPropsUsdm
  | MarketRowPropsCoinm
  | MarketRowPropsOptions;

function CryptoRowContent({
  image,
  symbol,
  name,
  lastPriceLabel,
  approxUsdLabel,
  changePct,
  onPress,
}: MarketRowPropsCrypto): React.JSX.Element {
  const { colors, spacing, typography } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 66,
        paddingVertical: 12,
        paddingHorizontal: spacing.sm,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1.2, minWidth: 0 }}>
        <CryptoIcon symbol={symbol} size={COIN_LOGO_SIZE} iconUrl={image} />
        <View style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
          <Text style={[typography.h2, { color: colors.text }]} numberOfLines={1}>{symbol}</Text>
          <Text style={[typography.sub, { marginTop: 2, color: colors.text3 }]} numberOfLines={1}>{name}</Text>
        </View>
      </View>
      <View style={{ flex: 1, alignItems: 'flex-end' }}>
        <Text style={[typography.h2, { color: colors.text }]}>{lastPriceLabel}</Text>
        <Text style={[typography.sub, { marginTop: 4, color: colors.text3 }]}>
          {approxUsdLabel}
        </Text>
      </View>
      <View style={{ minWidth: 88, alignItems: 'flex-end', marginLeft: spacing.sm }}>
        <PercentBadge value={changePct} />
      </View>
    </Pressable>
  );
}

function SpotRowContent({
  base,
  quote,
  name,
  image,
  volumeLabel,
  leverageLabel,
  lastPriceLabel,
  approxUsdLabel,
  changePct,
  onPress,
}: MarketRowPropsSpot): React.JSX.Element {
  const { colors, spacing, typography } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 64,
        paddingVertical: 10,
        paddingHorizontal: spacing.md,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1.4, minWidth: 0 }}>
        <CryptoIcon symbol={base} size={32} iconUrl={image} />
        <View style={{ marginLeft: 10, flex: 1, minWidth: 0 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={[typography.h2, { color: colors.text }]}>
              {base}
              <Text style={{ color: colors.text3, fontWeight: '500', fontSize: 13 }}> /{quote}</Text>
            </Text>
            {leverageLabel != null && (
              <View
                style={{
                  backgroundColor: '#212A34',
                  paddingHorizontal: 4,
                  paddingVertical: 1,
                  borderRadius: 4,
                }}
              >
                <Text style={{ color: colors.text2, fontSize: 10, fontWeight: '700' }}>
                  {leverageLabel}
                </Text>
              </View>
            )}
          </View>
          <Text style={[typography.sub, { marginTop: 2, color: colors.text3, fontSize: 12 }]} numberOfLines={1}>
            {name ? `${name}  ${volumeLabel}` : volumeLabel}
          </Text>
        </View>
      </View>
      <View style={{ flex: 1, alignItems: 'flex-end' }}>
        <Text style={[typography.h2, { color: colors.text }]}>{lastPriceLabel}</Text>
        <Text style={[typography.sub, { marginTop: 2, color: colors.text3 }]}>
          {approxUsdLabel}
        </Text>
      </View>
      <View style={{ minWidth: 80, alignItems: 'flex-end', marginLeft: spacing.sm }}>
        <PercentBadge value={changePct} />
      </View>
    </Pressable>
  );
}

function UsdmRowContent({
  symbol,
  volumeLabel,
  isFavorite,
  lastPriceLabel,
  approxUsdLabel,
  changePct,
  onPress,
}: MarketRowPropsUsdm): React.JSX.Element {
  const { colors, spacing, typography, radii } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 66,
        paddingVertical: 12,
        paddingHorizontal: spacing.md,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View style={{ flex: 1.2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={[typography.h2, { color: colors.text }]}>{symbol}</Text>
          <View
            style={{
              backgroundColor: colors.surface,
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: radii.sm,
            }}
          >
            <Text style={[typography.tiny, { color: colors.text2 }]}>Perp</Text>
          </View>
          {isFavorite && (
            <Ionicons name="star" size={14} color={colors.primary} />
          )}
        </View>
        <Text style={[typography.sub, { marginTop: 4, color: colors.text3 }]}>
          {volumeLabel}
        </Text>
      </View>
      <View style={{ flex: 1, alignItems: 'flex-end' }}>
        <Text style={[typography.h2, { color: colors.text }]}>{lastPriceLabel}</Text>
        <Text style={[typography.sub, { marginTop: 4, color: colors.text3 }]}>
          {approxUsdLabel}
        </Text>
      </View>
      <View style={{ minWidth: 88, alignItems: 'flex-end', marginLeft: spacing.sm }}>
        <PercentBadge value={changePct} />
      </View>
    </Pressable>
  );
}

function CoinmRowContent({
  symbol,
  contractLabel,
  volumeLabel,
  lastPriceLabel,
  approxUsdLabel,
  changePct,
  onPress,
}: MarketRowPropsCoinm): React.JSX.Element {
  const { colors, spacing, typography, radii } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 66,
        paddingVertical: 12,
        paddingHorizontal: spacing.md,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View style={{ flex: 1.2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={[typography.h2, { color: colors.text }]}>{symbol}</Text>
          <View
            style={{
              backgroundColor: colors.surface,
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: radii.sm,
            }}
          >
            <Text style={[typography.tiny, { color: colors.text2 }]}>
              {contractLabel}
            </Text>
          </View>
        </View>
        <Text style={[typography.sub, { marginTop: 4, color: colors.text3 }]}>
          {volumeLabel}
        </Text>
      </View>
      <View style={{ flex: 1, alignItems: 'flex-end' }}>
        <Text style={[typography.h2, { color: colors.text }]}>{lastPriceLabel}</Text>
        <Text style={[typography.sub, { marginTop: 4, color: colors.text3 }]}>
          {approxUsdLabel}
        </Text>
      </View>
      <View style={{ minWidth: 88, alignItems: 'flex-end', marginLeft: spacing.sm }}>
        <PercentBadge value={changePct} />
      </View>
    </Pressable>
  );
}

function OptionsRowContent({
  name,
  volumeLabel,
  lastPriceLabel,
  approxUsdLabel,
  changePct,
  onPress,
}: MarketRowPropsOptions): React.JSX.Element {
  const { colors, spacing, typography } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 66,
        paddingVertical: 12,
        paddingHorizontal: spacing.md,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View style={{ flex: 1.2 }}>
        <Text style={[typography.h2, { color: colors.text }]} numberOfLines={1}>
          {name}
        </Text>
        <Text style={[typography.sub, { marginTop: 4, color: colors.text3 }]}>
          {volumeLabel}
        </Text>
      </View>
      <View style={{ flex: 1, alignItems: 'flex-end' }}>
        <Text style={[typography.h2, { color: colors.text }]}>
          {lastPriceLabel}
        </Text>
        <Text style={[typography.sub, { marginTop: 4, color: colors.text3 }]}>
          {approxUsdLabel}
        </Text>
      </View>
      <View style={{ minWidth: 88, alignItems: 'flex-end', marginLeft: spacing.sm }}>
        <PercentBadge value={changePct} />
      </View>
    </Pressable>
  );
}

/** Row variants: crypto, spot, usdm, coinm, options. */
export function MarketRow(props: MarketRowProps): React.JSX.Element {
  if (props.variant === 'crypto') return <CryptoRowContent {...props} />;
  if (props.variant === 'spot') return <SpotRowContent {...props} />;
  if (props.variant === 'usdm') return <UsdmRowContent {...props} />;
  if (props.variant === 'coinm') return <CoinmRowContent {...props} />;
  return <OptionsRowContent {...props} />;
}
