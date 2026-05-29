import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { CurrentWeather } from '@/lib/weatherbit';

import { getLocationBadgeText, getWeatherSymbol } from '../utils';
import { weatherScreenStyles as styles } from '../weather-screen.styles';

export function WeatherHero(props: {
  status: 'loading' | 'error' | 'ready';
  heroColor: string;
  badgeColor: string;
  weather?: CurrentWeather;
  subtitle: string;
  source?: 'location' | 'manual';
  isInUkraine?: boolean;
}) {
  const theme = useTheme();
  const isWarning = props.status === 'ready' && !props.isInUkraine;

  return (
    <ThemedView style={[styles.heroCard, { backgroundColor: props.heroColor }]}>
      <ThemedText themeColor="heroTextMuted" style={styles.eyebrow}>
        CURRENT WEATHER
      </ThemedText>
      <ThemedText themeColor="heroText" style={styles.heroSymbol}>
        {props.status === 'ready' && props.weather
          ? getWeatherSymbol(props.weather.weather.code, props.weather.pod)
          : '📍'}
      </ThemedText>
      <ThemedText themeColor="heroText" style={styles.heroTitle}>
        {props.status === 'ready' && props.weather ? props.weather.city_name : 'Finding your location'}
      </ThemedText>
      <ThemedText themeColor="heroTextSecondary" style={styles.heroSubtitle}>
        {props.subtitle}
      </ThemedText>

      <ThemedView
        style={[
          styles.statusBadge,
          { backgroundColor: props.badgeColor },
          isWarning && { backgroundColor: theme.warningBadge },
        ]}>
        <ThemedText
          themeColor={isWarning ? 'warningTitle' : 'heroText'}
          style={[
            styles.statusBadgeText,
          ]}>
          {getLocationBadgeText({
            status: props.status,
            source: props.source,
            cityName: props.weather?.city_name,
            isInUkraine: props.isInUkraine,
          })}
        </ThemedText>
      </ThemedView>

      {props.status === 'ready' && props.weather ? (
        <View style={styles.temperatureRow}>
          <ThemedText themeColor="heroText" style={styles.temperatureValue}>
            {Math.round(props.weather.temp)}°
          </ThemedText>
          <ThemedText themeColor="heroTextSecondary" style={styles.temperatureMeta}>
            Feels like {Math.round(props.weather.app_temp)}°C
          </ThemedText>
        </View>
      ) : (
        <ActivityIndicator color={theme.heroText} size="large" style={styles.loader} />
      )}
    </ThemedView>
  );
}
