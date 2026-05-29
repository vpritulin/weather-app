import * as Location from 'expo-location';
import { startTransition, useCallback, useEffect, useMemo, useState } from 'react';

import { UKRAINE_CITIES } from '@/constants/ukraine-cities';
import { CurrentWeather } from '@/lib/weatherbit';

import { WeatherScreenState, WeatherSource } from './types';
import {
  ForecastPoint,
  WeatherScreenError,
  formatWeatherError,
} from './utils';
import {
  fetchWeatherBundleByCity,
  fetchWeatherBundleByCoordinates,
} from './weather-service';

const WEATHERBIT_API_KEY = process.env.EXPO_PUBLIC_WEATHERBIT_API_KEY?.trim() ?? '';

export function useWeatherScreen() {
  const [state, setState] = useState<WeatherScreenState>({ status: 'loading' });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [manualCity, setManualCity] = useState('Kyiv');
  const [isManualLoading, setIsManualLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const citySuggestions = useMemo(
    () =>
      UKRAINE_CITIES.filter((city) =>
        city.toLowerCase().includes(manualCity.trim().toLowerCase()),
      ).slice(0, 6),
    [manualCity],
  );

  function setReadyState(params: {
    weather: CurrentWeather;
    forecastPoints: ForecastPoint[];
    source: WeatherSource;
    requestedCoordinates?: {
      latitude: number;
      longitude: number;
    };
  }) {
    startTransition(() => {
      setState({
        status: 'ready',
        weather: params.weather,
        forecastPoints: params.forecastPoints,
        source: params.source,
        isInUkraine: params.weather.country_code === 'UA',
        requestedCoordinates: params.requestedCoordinates,
        refreshedAt: new Date().toISOString(),
      });
    });
  }

  const setMissingApiKeyError = useCallback(() => {
    startTransition(() => {
      setState({
        status: 'error',
        title: 'Missing Weatherbit API key',
        message:
          'Create a .env file with EXPO_PUBLIC_WEATHERBIT_API_KEY and restart Expo to fetch current weather and forecast.',
      });
    });
  }, []);

  const loadWeatherByLocation = useCallback(
    async (refresh = false) => {
      if (!WEATHERBIT_API_KEY) {
        setIsRefreshing(false);
        setMissingApiKeyError();
        return;
      }

      try {
        if (refresh) {
          setIsRefreshing(true);
        } else {
          startTransition(() => setState({ status: 'loading' }));
        }

        const servicesEnabled = await Location.hasServicesEnabledAsync();

        if (!servicesEnabled) {
          throw new WeatherScreenError(
            'Location services are disabled',
            'Turn on Location Services in iPhone Settings and try again.',
          );
        }

        const permission = await Location.requestForegroundPermissionsAsync();

        if (!permission.granted) {
          throw new WeatherScreenError(
            'Location access is required',
            'Allow location access so the app can load weather for your current position in Ukraine.',
          );
        }

        const lastKnownPosition = await Location.getLastKnownPositionAsync({
          maxAge: 300000,
          requiredAccuracy: 1000,
        });
        const position =
          lastKnownPosition ??
          (await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          }));

        if (!position) {
          throw new WeatherScreenError(
            'Current position unavailable',
            'The device could not determine your current location.',
          );
        }

        const { weather, forecastPoints } = await fetchWeatherBundleByCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          apiKey: WEATHERBIT_API_KEY,
        });

        setReadyState({
          weather,
          forecastPoints,
          source: 'location',
          requestedCoordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });
      } catch (error) {
        startTransition(() => {
          setState({
            status: 'error',
            ...formatWeatherError(error),
          });
        });
      } finally {
        setIsRefreshing(false);
      }
    },
    [setMissingApiKeyError],
  );

  const loadWeatherByCity = useCallback(async () => {
    const city = manualCity.trim();

    if (!city) {
      startTransition(() => {
        setState({
          status: 'error',
          title: 'Enter a city',
          message: 'Type a Ukrainian city name such as Kyiv, Lviv, Odesa, or Kharkiv.',
        });
      });
      return;
    }

    if (!WEATHERBIT_API_KEY) {
      setMissingApiKeyError();
      return;
    }

    try {
      setIsManualLoading(true);
      startTransition(() => setState({ status: 'loading' }));

      const { weather, forecastPoints } = await fetchWeatherBundleByCity({
        city,
        countryCode: 'UA',
        apiKey: WEATHERBIT_API_KEY,
      });

      setReadyState({
        weather,
        forecastPoints,
        source: 'manual',
      });
      setShowSuggestions(false);
    } catch (error) {
      startTransition(() => {
        setState({
          status: 'error',
          ...formatWeatherError(error),
        });
      });
    } finally {
      setIsManualLoading(false);
    }
  }, [manualCity, setMissingApiKeyError]);

  useEffect(() => {
    void loadWeatherByLocation();
  }, [loadWeatherByLocation]);

  return {
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
  };
}
