import React, { useState } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { SvgUri } from 'react-native-svg';

export interface CryptoIconProps {
  symbol: string;
  size?: number;
  iconUrl?: string;
}

export function CryptoIcon({ symbol, size = 28, iconUrl }: CryptoIconProps): React.JSX.Element {
  const [hasSvgError, setHasSvgError] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);

  const cleanSymbol = (symbol || 'usdt').trim().toLowerCase();
  const cdnSvgUrl = `https://cdn.jsdelivr.net/gh/vadimmalykhin/binance-icons/crypto/${cleanSymbol}.svg`;

  if (!hasSvgError) {
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          overflow: 'hidden',
          backgroundColor: 'transparent',
        }}
      >
        <SvgUri
          width={size}
          height={size}
          uri={cdnSvgUrl}
          onError={() => setHasSvgError(true)}
        />
      </View>
    );
  }

  // Fallback 1: CoinGecko image URL (PNG/JPG)
  if (iconUrl && !hasImageError) {
    return (
      <Image
        source={{ uri: iconUrl }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        onError={() => setHasImageError(true)}
      />
    );
  }

  // Fallback 2: Letter Avatar Circle
  return (
    <View
      style={[
        styles.fallbackAvatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: getSymbolColor(cleanSymbol),
        },
      ]}
    >
      <Text style={[styles.fallbackText, { fontSize: Math.max(10, size * 0.38) }]}>
        {cleanSymbol.slice(0, 3).toUpperCase()}
      </Text>
    </View>
  );
}

function getSymbolColor(symbol: string): string {
  switch (symbol) {
    case 'btc':
      return '#F7931A';
    case 'eth':
      return '#627EEA';
    case 'usdt':
      return '#26A17B';
    case 'bnb':
      return '#F3BA2F';
    case 'sol':
      return '#14F195';
    case 'trx':
      return '#EF0027';
    case 'usdc':
      return '#2775CA';
    case 'doge':
      return '#C2A633';
    case 'xrp':
      return '#23292F';
    case 'ada':
      return '#0033AD';
    case 'avax':
      return '#E84142';
    default:
      return '#F0B90B';
  }
}

const styles = StyleSheet.create({
  fallbackAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    color: '#0B0F14',
    fontWeight: '800',
  },
});
