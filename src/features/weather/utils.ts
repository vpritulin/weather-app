import { CurrentWeather, DailyForecast } from '@/lib/weatherbit';

export type ForecastPoint = {
  label: string;
  maxTemp: number;
  minTemp: number;
  precipitationChance: number;
};

export class WeatherScreenError extends Error {
  constructor(
    public readonly title: string,
    message: string,
  ) {
    super(message);
  }
}

export function getWeatherSymbol(code: number, pod: CurrentWeather['pod']) {
  if (code >= 200 && code < 300) {
    return '⛈';
  }
  if (code >= 300 && code < 600) {
    return '🌧';
  }
  if (code >= 600 && code < 700) {
    return '❄️';
  }
  if (code >= 700 && code < 800) {
    return '🌫';
  }
  if (code === 800) {
    return pod === 'd' ? '☀️' : '🌙';
  }
  if (code > 800) {
    return pod === 'd' ? '⛅️' : '☁️';
  }
  return '🌤';
}

export function formatObservationTime(weather: CurrentWeather) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: weather.timezone,
    }).format(new Date(weather.ts * 1000));
  } catch {
    return weather.ob_time;
  }
}

export function formatCoordinates(latitude: number, longitude: number) {
  return `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`;
}

function formatForecastLabel(validDate: string) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
    }).format(new Date(validDate));
  } catch {
    return validDate.slice(5);
  }
}

export function buildForecastPoints(forecast: DailyForecast[]): ForecastPoint[] {
  return forecast.slice(0, 7).map((day) => ({
    label: formatForecastLabel(day.valid_date),
    maxTemp: day.max_temp,
    minTemp: day.min_temp,
    precipitationChance: day.pop,
  }));
}

export function formatWeatherError(error: unknown) {
  if (error instanceof WeatherScreenError) {
    return {
      title: error.title,
      message: error.message,
    };
  }

  if (error instanceof Error) {
    return {
      title: 'Unable to load weather',
      message: error.message,
    };
  }

  return {
    title: 'Unable to load weather',
    message: 'An unexpected error occurred while loading weather data.',
  };
}

export function getWeatherSubtitle(params: {
  status: 'loading' | 'error' | 'ready';
  source?: 'location' | 'manual';
  weather?: CurrentWeather;
}) {
  if (params.status !== 'ready' || !params.weather) {
    return 'Loading current weather and 7-day forecast from Weatherbit';
  }

  if (params.source === 'manual') {
    return `${params.weather.country_code} • ${params.weather.weather.description} • manual city search`;
  }

  return `${params.weather.country_code} • ${params.weather.weather.description}`;
}

export function getLocationBadgeText(params: {
  status: 'loading' | 'error' | 'ready';
  source?: 'location' | 'manual';
  cityName?: string;
  isInUkraine?: boolean;
}) {
  if (params.status !== 'ready') {
    return 'Requesting location permission';
  }

  if (params.source === 'manual') {
    return `Manual city: ${params.cityName}`;
  }

  return params.isInUkraine ? 'Current location: Ukraine' : 'Current location is outside Ukraine';
}
