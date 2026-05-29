# Ukraine Weather App

Expo iOS app that requests the device's current location, calls the Weatherbit Current Weather API, and renders the latest weather conditions in English.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and add your Weatherbit API key:

```bash
EXPO_PUBLIC_WEATHERBIT_API_KEY=your_weatherbit_api_key
```

3. Start the iOS app:

```bash
npm run ios
```

## Features

- Foreground location permission for iOS
- Current weather lookup via `https://api.weatherbit.io/v2.0/current`
- English UI and Weatherbit response language
- Ukraine-focused behavior with an in-app notice when the detected location is outside `UA`
- Manual refresh and pull-to-refresh

## Verification

```bash
npx tsc --noEmit
npm run lint
```
