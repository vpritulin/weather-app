import { CurrentWeather } from '@/lib/weatherbit';

import { ForecastPoint } from './utils';

export type WeatherSource = 'location' | 'manual';

export type WeatherScreenState =
  | {
      status: 'loading';
    }
  | {
      status: 'error';
      title: string;
      message: string;
    }
  | {
      status: 'ready';
      weather: CurrentWeather;
      forecastPoints: ForecastPoint[];
      source: WeatherSource;
      isInUkraine: boolean;
      requestedCoordinates?: {
        latitude: number;
        longitude: number;
      };
      refreshedAt: string;
    };
