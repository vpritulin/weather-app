import React from 'react';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';

import { weatherScreenStyles as styles } from '../weather-screen.styles';

export function WeatherWarningCard(props: { cityName: string; countryCode: string }) {
  const theme = useTheme();

  return (
    <ThemedView style={[styles.warningCard, { backgroundColor: theme.warningBackground }]}>
      <ThemedText themeColor="warningTitle" style={styles.warningTitle}>
        Ukraine mode
      </ThemedText>
      <ThemedText themeColor="warningText" style={styles.warningText}>
        This app is configured for Ukraine. Right now your coordinates resolve to {props.cityName},{' '}
        {props.countryCode}.
      </ThemedText>
    </ThemedView>
  );
}
