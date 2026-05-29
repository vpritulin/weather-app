import React from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ForecastChart } from '@/components/forecast-chart';
import { ThemeToggle } from '@/components/theme-toggle';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';

import { CitySearchCard } from '@/features/weather/components/city-search-card';
import { WeatherDetailsCard } from '@/features/weather/components/weather-details-card';
import { WeatherErrorCard } from '@/features/weather/components/weather-error-card';
import { WeatherHero } from '@/features/weather/components/weather-hero';
import { WeatherMetricsGrid } from '@/features/weather/components/weather-metrics-grid';
import { WeatherRefreshCard } from '@/features/weather/components/weather-refresh-card';
import { WeatherWarningCard } from '@/features/weather/components/weather-warning-card';
import { useWeatherScreen } from '@/features/weather/use-weather-screen';
import { getWeatherSubtitle } from '@/features/weather/utils';
import { weatherScreenStyles as styles } from '@/features/weather/weather-screen.styles';

export default function WeatherScreen() {
  const theme = useTheme();
  const {
    state,
    isRefreshing,
    manualCity,
    isManualLoading,
    showSuggestions,
    citySuggestions,
    setManualCity,
    setShowSuggestions,
    loadWeatherByLocation,
    loadWeatherByCity,
  } = useWeatherScreen();

  const surfaceColor = theme.backgroundElement;
  const heroColor =
    state.status === 'ready' && state.weather.pod === 'n' ? theme.heroNight : theme.heroDay;
  const badgeColor =
    state.status === 'ready' && state.isInUkraine ? theme.heroBadge : theme.warningBadge;
  const subtitle = getWeatherSubtitle({
    status: state.status,
    source: state.status === 'ready' ? state.source : undefined,
    weather: state.status === 'ready' ? state.weather : undefined,
  });

  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => void loadWeatherByLocation(true)}
              tintColor={theme.primary}
              colors={[theme.primary]}
              progressBackgroundColor={theme.backgroundElement}
            />
          }>
          <ThemedView style={[styles.container, { backgroundColor: theme.background }]}>
            <ThemedView style={styles.pageHeader}>
              <ThemedView style={styles.headerTitleGroup}>
                <ThemedText type="subtitle" style={styles.appTitle}>
                  Ukraine Weather
                </ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.appSubtitle}>
                  Current conditions and forecast
                </ThemedText>
              </ThemedView>
              <ThemeToggle variant="header" />
            </ThemedView>

            <WeatherHero
              status={state.status}
              heroColor={heroColor}
              badgeColor={badgeColor}
              weather={state.status === 'ready' ? state.weather : undefined}
              subtitle={subtitle}
              source={state.status === 'ready' ? state.source : undefined}
              isInUkraine={state.status === 'ready' ? state.isInUkraine : undefined}
            />

            {state.status === 'error' ? (
              <WeatherErrorCard
                title={state.title}
                message={state.message}
                backgroundColor={surfaceColor}
                onRetry={() => void loadWeatherByLocation()}
              />
            ) : null}

            <CitySearchCard
              backgroundColor={surfaceColor}
              inputBackgroundColor={theme.background}
              inputTextColor={theme.text}
              inputBorderColor={theme.border}
              placeholderColor={theme.textSecondary}
              manualCity={manualCity}
              suggestions={citySuggestions}
              showSuggestions={showSuggestions}
              isManualLoading={isManualLoading}
              onChangeCity={(value) => {
                setManualCity(value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onSelectSuggestion={(city) => {
                setManualCity(city);
                setShowSuggestions(false);
              }}
              onSearch={() => void loadWeatherByCity()}
              onUseCurrentLocation={() => void loadWeatherByLocation()}
            />

            {state.status === 'ready' ? (
              <>
                {!state.isInUkraine && state.source === 'location' ? (
                  <WeatherWarningCard
                    cityName={state.weather.city_name}
                    countryCode={state.weather.country_code}
                  />
                ) : null}

                <WeatherMetricsGrid weather={state.weather} backgroundColor={surfaceColor} />

                <WeatherDetailsCard
                  weather={state.weather}
                  backgroundColor={surfaceColor}
                  requestedCoordinates={state.requestedCoordinates}
                />

                <ForecastChart
                  points={state.forecastPoints}
                  summary="Daily highs, lows, and precipitation chance for the next 7 days."
                />

                <WeatherRefreshCard
                  backgroundColor={surfaceColor}
                  refreshedAt={state.refreshedAt}
                  onRefresh={() =>
                    void (state.source === 'manual'
                      ? loadWeatherByCity()
                      : loadWeatherByLocation(true))
                  }
                />
              </>
            ) : null}
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}
