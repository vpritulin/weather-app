/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { createContext, createElement, useContext, useMemo, useState, type ReactNode } from 'react';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ThemeName = 'light' | 'dark';

const THEME_COOKIE_NAME = 'theme-preference';

function isThemePreference(value: string | undefined): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark';
}

function getCookie(name: string) {
  if (typeof document === 'undefined') {
    return undefined;
  }

  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];
}

function getStoredThemePreference(): ThemePreference {
  const value = getCookie(THEME_COOKIE_NAME);

  return isThemePreference(value) ? value : 'system';
}

function setThemePreferenceCookie(preference: ThemePreference) {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = `${THEME_COOKIE_NAME}=${preference}; Max-Age=31536000; Path=/; SameSite=Lax`;
}

const ThemePreferenceContext = createContext<{
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}>({
  preference: 'system',
  setPreference: () => {},
});

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(getStoredThemePreference);
  const setPreference = (nextPreference: ThemePreference) => {
    setThemePreferenceCookie(nextPreference);
    setPreferenceState(nextPreference);
  };
  const value = useMemo(() => ({ preference, setPreference }), [preference]);

  return createElement(ThemePreferenceContext.Provider, { value }, children);
}

export function useThemePreference() {
  return useContext(ThemePreferenceContext);
}

export function useThemeName() {
  const scheme = useColorScheme();
  const { preference } = useThemePreference();

  if (preference !== 'system') {
    return preference;
  }

  return scheme === 'dark' ? 'dark' : 'light';
}

export function useTheme() {
  const theme = useThemeName();

  return Colors[theme];
}
