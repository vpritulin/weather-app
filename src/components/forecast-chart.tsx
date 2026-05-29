import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { ForecastPoint } from '@/features/weather/utils';
import { useTheme } from '@/hooks/use-theme';

export function ForecastChart(props: {
  points: ForecastPoint[];
  summary: string;
}) {
  const theme = useTheme();
  const max = Math.max(...props.points.map((point) => point.maxTemp), 1);

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText type="subtitle">7-day forecast</ThemedText>
      <ThemedText themeColor="textSecondary">{props.summary}</ThemedText>

      <View style={styles.chart}>
        {props.points.map((point) => {
          const heightPercent = Math.max((point.maxTemp / max) * 100, 12);

          return (
            <View key={point.label} style={styles.column}>
              <ThemedText type="small" themeColor="textSecondary">
                {Math.round(point.maxTemp)}°
              </ThemedText>
              <View style={[styles.track, { backgroundColor: theme.chartTrack }]}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${heightPercent}%`,
                      backgroundColor: theme.primary,
                    },
                  ]}
                />
              </View>
              <ThemedText type="small" themeColor="textSecondary">
                {point.label}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {Math.round(point.minTemp)}° / {point.precipitationChance}%
              </ThemedText>
            </View>
          );
        })}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: Spacing.one,
    minHeight: 220,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.one,
  },
  track: {
    width: '100%',
    maxWidth: 28,
    height: 120,
    borderRadius: 999,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    borderRadius: 999,
  },
});
