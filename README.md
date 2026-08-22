# Movana — Rider App

React Native (Expo SDK 54) rider application for the Movana AI-powered B2B2C logistics platform.

## Stack

- Expo SDK 54 + Expo Router (file-based navigation)
- TypeScript
- Zustand (state)
- Axios (REST) + Socket.IO client (real-time tracking)
- react-native-maps (Google Maps provider)
- Manrope (primary font, per SRS Section 10)

## Getting Started

```bash
npm install
cp .env.example .env   # fill in API_BASE_URL, SOCKET_URL, GOOGLE_MAPS_API_KEY
npx expo start
```

Update `app.json` → `android.config.googleMaps.apiKey` with a real Google Maps API key before building for Android; iOS uses Apple Maps unless `PROVIDER_GOOGLE` config is added there too.

## Structure

- `app/` — screens, grouped by flow: `(auth)`, `(tabs)`, `delivery/`, `onboarding/`
- `src/api/` — Axios client + typed endpoint modules
- `src/components/` — presentational UI, grouped by domain
- `src/features/` — hooks encapsulating domain logic (auth, deliveries, tracking, earnings)
- `src/store/` — Zustand stores
- `src/services/` — socket, location, storage, notifications
- `src/constants/` — design tokens (colors, typography) and app config

## Notes

- Background location tracking (`src/services/location.service.ts`) starts when a rider accepts a delivery and stops on completion/failure/cancellation — required for FR-011.
- Offline location events queue via `useOfflineQueue` and flush through `trackingApi.syncOfflineQueue` once connectivity returns (NFR-006).
- `RouteMap` currently draws a straight line between pickup/drop-off; swap in a Directions API call for real road-following polylines when route optimization (AI-002) is wired up.
- Vehicle-info and bank-info screens save locally for now — connect to their respective backend endpoints once available.
