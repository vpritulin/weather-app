import React from 'react';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CurrentWeather } from '@/lib/weatherbit';

import { weatherScreenStyles as styles } from '../weather-screen.styles';

export function WeatherMetricsGrid(props: {
  weather: CurrentWeather;
  backgroundColor: string;
}) {
  return (
    <View style={styles.metricsGrid}>
      <MetricCard
        label="Humidity"
        value={`${props.weather.rh}%`}
        backgroundColor={props.backgroundColor}
      />
      <MetricCard
        label="Wind"
        value={`${props.weather.wind_spd.toFixed(1)} m/s`}
        caption={props.weather.wind_cdir.toUpperCase()}
        backgroundColor={props.backgroundColor}
      />
      <MetricCard
        label="Visibility"
        value={`${props.weather.vis.toFixed(1)} km`}
        backgroundColor={props.backgroundColor}
      />
      <MetricCard
        label="Clouds"
        value={`${props.weather.clouds}%`}
        backgroundColor={props.backgroundColor}
      />
    </View>
  );
}

function MetricCard(props: {
  label: string;
  value: string;
  caption?: string;
  backgroundColor: string;
}) {
  return (
    <ThemedView style={[styles.metricCard, { backgroundColor: props.backgroundColor }]}>
      <ThemedText type="smallBold">{props.label}</ThemedText>
      <ThemedText type="subtitle">{props.value}</ThemedText>
      {props.caption ? (
        <ThemedText themeColor="textSecondary" type="small">
          {props.caption}
        </ThemedText>
      ) : null}
    </ThemedView>
  );
}
