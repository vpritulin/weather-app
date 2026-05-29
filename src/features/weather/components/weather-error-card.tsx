import React from 'react';
import { Pressable } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';

import { weatherScreenStyles as styles } from '../weather-screen.styles';

export function WeatherErrorCard(props: {
  title: string;
  message: string;
  backgroundColor: string;
  onRetry: () => void;
}) {
  const theme = useTheme();

  return (
    <ThemedView style={[styles.card, { backgroundColor: props.backgroundColor }]}>
      <ThemedText type="subtitle">{props.title}</ThemedText>
      <ThemedText themeColor="textSecondary">{props.message}</ThemedText>
      <Pressable
        onPress={props.onRetry}
        style={[styles.primaryButton, { backgroundColor: theme.primary }]}>
        <ThemedText themeColor="primaryText" style={styles.primaryButtonLabel}>
          Try again
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}
