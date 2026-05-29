import React from 'react';
import { Pressable } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';

import { weatherScreenStyles as styles } from '../weather-screen.styles';

export function WeatherRefreshCard(props: {
  backgroundColor: string;
  refreshedAt: string;
  onRefresh: () => void;
}) {
  const theme = useTheme();

  return (
    <ThemedView style={[styles.card, { backgroundColor: props.backgroundColor }]}>
      <ThemedText type="smallBold">Last refresh</ThemedText>
      <ThemedText themeColor="textSecondary">
        {new Intl.DateTimeFormat('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(new Date(props.refreshedAt))}
      </ThemedText>
      <Pressable
        onPress={props.onRefresh}
        style={[styles.secondaryButton, { borderColor: theme.border }]}>
        <ThemedText style={styles.secondaryButtonLabel}>Refresh weather</ThemedText>
      </Pressable>
    </ThemedView>
  );
}
