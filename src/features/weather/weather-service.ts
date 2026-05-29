import {
  CurrentWeather,
  fetchCurrentWeather,
  fetchCurrentWeatherByCity,
  fetchDailyForecast,
  fetchDailyForecastByCity,
} from '@/lib/weatherbit';

import { ForecastPoint, buildForecastPoints } from './utils';

export async function fetchWeatherBundleByCoordinates(params: {
  latitude: number;
  longitude: number;
  apiKey: string;
}): Promise<{
  weather: CurrentWeather;
  forecastPoints: ForecastPoint[];
}> {
  const [weather, forecast] = await Promise.all([
    fetchCurrentWeather({
      latitude: params.latitude,
      longitude: params.longitude,
      apiKey: params.apiKey,
    }),
    fetchDailyForecast({
      latitude: params.latitude,
      longitude: params.longitude,
      apiKey: params.apiKey,
    }),
  ]);

  return {
    weather,
    forecastPoints: buildForecastPoints(forecast),
  };
}

export async function fetchWeatherBundleByCity(params: {
  city: string;
  countryCode: string;
  apiKey: string;
}): Promise<{
  weather: CurrentWeather;
  forecastPoints: ForecastPoint[];
}> {
  const [weather, forecast] = await Promise.all([
    fetchCurrentWeatherByCity({
      city: params.city,
      countryCode: params.countryCode,
      apiKey: params.apiKey,
    }),
    fetchDailyForecastByCity({
      city: params.city,
      countryCode: params.countryCode,
      apiKey: params.apiKey,
    }),
  ]);

  return {
    weather,
    forecastPoints: buildForecastPoints(forecast),
  };
}
