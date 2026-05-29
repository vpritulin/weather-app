import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ExternalLink } from '@/components/external-link';
import { ThemeToggle } from '@/components/theme-toggle';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { WeatherObservationForm } from '@/features/weather/components/weather-observation-form';

const WEATHERBIT_API_KEY = process.env.EXPO_PUBLIC_WEATHERBIT_API_KEY?.trim() ?? '';

export default function SetupScreen() {
  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedView style={styles.container}>
            <ThemedView style={styles.headerCard}>
              <View style={styles.headerTop}>
                <View style={styles.headerTitleGroup}>
                  <ThemedText type="title" style={styles.title}>
                    Ukraine weather setup
                  </ThemedText>
                  <ThemedText themeColor="textSecondary">Configuration and data source</ThemedText>
                </View>
                <ThemeToggle variant="header" />
              </View>
              <ThemedText themeColor="textSecondary">
                The app requests your current location or lets you search a Ukrainian city, then
                loads current weather and a 7-day forecast from Weatherbit in English.
              </ThemedText>
            </ThemedView>

            <ThemedView type="backgroundElement" style={styles.sectionCard}>
              <ThemedText type="subtitle">Configuration</ThemedText>
              <ThemedText>
                1. Copy <ThemedText type="code">.env.example</ThemedText> to{' '}
                <ThemedText type="code">.env</ThemedText>
              </ThemedText>
              <ThemedText>
                2. Add <ThemedText type="code">EXPO_PUBLIC_WEATHERBIT_API_KEY</ThemedText>
              </ThemedText>
              <ThemedText>
                3. Restart Expo after changing environment variables
              </ThemedText>
              <ThemedText themeColor="textSecondary">
                API key status: {WEATHERBIT_API_KEY ? 'configured' : 'missing'}
              </ThemedText>
            </ThemedView>

            <ThemedView type="backgroundElement" style={styles.sectionCard}>
              <ThemedText type="subtitle">What the app does</ThemedText>
              <ThemedText>Uses foreground location permission on iOS.</ThemedText>
              <ThemedText>Requests current weather from Weatherbit using lat/lon.</ThemedText>
              <ThemedText>Loads daily forecast data and renders a 7-day chart.</ThemedText>
              <ThemedText>Supports autocomplete for Ukrainian city search.</ThemedText>
              <ThemedText>Highlights whether the detected location is inside Ukraine.</ThemedText>
              <ThemedText>Supports pull to refresh and manual refresh.</ThemedText>
            </ThemedView>

            <WeatherObservationForm />

            <ThemedView type="backgroundElement" style={styles.sectionCard}>
              <ThemedText type="subtitle">Weatherbit endpoints</ThemedText>
              <ThemedText type="code" style={styles.endpoint}>
                https://api.weatherbit.io/v2.0/current?lat=...&lon=...&lang=en&units=M
              </ThemedText>
              <ThemedText type="code" style={styles.endpoint}>
                https://api.weatherbit.io/v2.0/forecast/daily?lat=...&lon=...&lang=en&units=M
              </ThemedText>
              <ExternalLink href="https://www.weatherbit.io/api/weather-current">
                <ThemedText type="linkPrimary">Open Weatherbit current weather docs</ThemedText>
              </ExternalLink>
              <ExternalLink href="https://www.weatherbit.io/api/weather-forecast-16-day">
                <ThemedText type="linkPrimary">Open Weatherbit daily forecast docs</ThemedText>
              </ExternalLink>
            </ThemedView>
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.four,
    gap: Spacing.three,
  },
  headerCard: {
    gap: Spacing.three,
    paddingVertical: Spacing.two,
  },
  headerTop: {
    alignItems: 'stretch',
    gap: Spacing.three,
  },
  headerTitleGroup: {
    gap: Spacing.one,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
  },
  sectionCard: {
    borderRadius: 28,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  endpoint: {
    lineHeight: 18,
  },
});
