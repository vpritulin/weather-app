import React from 'react';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CurrentWeather } from '@/lib/weatherbit';

import { formatCoordinates, formatObservationTime } from '../utils';
import { weatherScreenStyles as styles } from '../weather-screen.styles';

export function WeatherDetailsCard(props: {
  weather: CurrentWeather;
  backgroundColor: string;
  requestedCoordinates?: {
    latitude: number;
    longitude: number;
  };
}) {
  return (
    <ThemedView style={[styles.detailsCard, { backgroundColor: props.backgroundColor }]}>
      <DetailRow label="Observed" value={formatObservationTime(props.weather)} />
      <DetailRow label="Timezone" value={props.weather.timezone} />
      {props.requestedCoordinates ? (
        <DetailRow
          label="Coordinates"
          value={formatCoordinates(
            props.requestedCoordinates.latitude,
            props.requestedCoordinates.longitude,
          )}
        />
      ) : (
        <DetailRow label="Source" value="Manual city search in Ukraine" />
      )}
      <DetailRow label="Precipitation" value={`${props.weather.precip} mm/hr`} />
      <DetailRow
        label="UV index"
        value={props.weather.uv != null ? `${props.weather.uv}` : 'Unavailable'}
      />
    </ThemedView>
  );
}

function DetailRow(props: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <ThemedText themeColor="textSecondary">{props.label}</ThemedText>
      <ThemedText style={styles.detailValue}>{props.value}</ThemedText>
    </View>
  );
}
