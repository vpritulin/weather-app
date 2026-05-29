export type CurrentWeather = {
  city_name: string;
  country_code: string;
  lat: number;
  lon: number;
  temp: number;
  app_temp: number;
  rh: number;
  wind_spd: number;
  wind_cdir: string;
  vis: number;
  clouds: number;
  precip: number;
  uv?: number;
  pod: 'd' | 'n';
  ob_time: string;
  ts: number;
  timezone: string;
  weather: {
    description: string;
    code: number;
    icon: string;
  };
};

export type DailyForecast = {
  valid_date: string;
  min_temp: number;
  max_temp: number;
  temp: number;
  pop: number;
  wind_spd: number;
  uv: number;
  weather: {
    description: string;
    code: number;
    icon: string;
  };
};

type CurrentWeatherResponse = {
  count: number;
  data: CurrentWeather[];
};

type DailyForecastResponse = {
  city_name: string;
  country_code: string;
  lat: string;
  lon: string;
  timezone: string;
  data: DailyForecast[];
};

async function requestJson<T>(path: string, searchParams: URLSearchParams): Promise<T> {
  const response = await fetch(`https://api.weatherbit.io/v2.0/${path}?${searchParams.toString()}`);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Weatherbit request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

function getBaseParams(apiKey: string) {
  return {
    key: apiKey,
    lang: 'en',
    units: 'M',
  };
}

export async function fetchCurrentWeather(params: {
  latitude: number;
  longitude: number;
  apiKey: string;
}): Promise<CurrentWeather> {
  const payload = await requestJson<CurrentWeatherResponse>(
    'current',
    new URLSearchParams({
      lat: params.latitude.toString(),
      lon: params.longitude.toString(),
      ...getBaseParams(params.apiKey),
    }),
  );

  const weather = payload.data[0];

  if (!weather) {
    throw new Error('Weatherbit returned an empty current weather response.');
  }

  return weather;
}

export async function fetchCurrentWeatherByCity(params: {
  city: string;
  countryCode: string;
  apiKey: string;
}): Promise<CurrentWeather> {
  const payload = await requestJson<CurrentWeatherResponse>(
    'current',
    new URLSearchParams({
      city: params.city,
      country: params.countryCode,
      ...getBaseParams(params.apiKey),
    }),
  );

  const weather = payload.data[0];

  if (!weather) {
    throw new Error('Weatherbit returned an empty current weather response.');
  }

  return weather;
}

export async function fetchDailyForecast(params: {
  latitude: number;
  longitude: number;
  apiKey: string;
}): Promise<DailyForecast[]> {
  const payload = await requestJson<DailyForecastResponse>(
    'forecast/daily',
    new URLSearchParams({
      lat: params.latitude.toString(),
      lon: params.longitude.toString(),
      ...getBaseParams(params.apiKey),
    }),
  );

  return payload.data ?? [];
}

export async function fetchDailyForecastByCity(params: {
  city: string;
  countryCode: string;
  apiKey: string;
}): Promise<DailyForecast[]> {
  const payload = await requestJson<DailyForecastResponse>(
    'forecast/daily',
    new URLSearchParams({
      city: params.city,
      country: params.countryCode,
      ...getBaseParams(params.apiKey),
    }),
  );

  return payload.data ?? [];
}
