import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import React from 'react';

import AppTabs from '@/components/app-tabs';
import { AppwriteProvider } from '@/contexts/appwrite-context';
import { AppThemeProvider, useTheme, useThemeName } from '@/hooks/use-theme';

export default function TabLayout() {
  return (
    <AppThemeProvider>
      <AppwriteProvider>
        <ThemedTabLayout />
      </AppwriteProvider>
    </AppThemeProvider>
  );
}

function ThemedTabLayout() {
  const colorScheme = useThemeName();
  const theme = useTheme();
  const navigationTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <ThemeProvider
      value={{
        ...navigationTheme,
        colors: {
          ...navigationTheme.colors,
          background: theme.background,
          border: theme.border,
          card: theme.backgroundElement,
          notification: theme.warningBadge,
          primary: theme.primary,
          text: theme.text,
        },
      }}>
      <AppTabs />
    </ThemeProvider>
  );
}
