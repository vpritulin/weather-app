/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
    border: '#D6D9DF',
    primary: '#0D63F3',
    primaryText: '#FFFFFF',
    link: '#0D63F3',
    heroDay: '#0D63F3',
    heroNight: '#16233E',
    heroText: '#FFFFFF',
    heroTextSecondary: 'rgba(255,255,255,0.84)',
    heroTextMuted: 'rgba(255,255,255,0.8)',
    heroBadge: 'rgba(255,255,255,0.16)',
    chartTrack: '#DCE8FF',
    warningBackground: '#FFF2DE',
    warningBadge: '#FFE2B8',
    warningTitle: '#5E3A00',
    warningText: '#7A4C09',
  },
  dark: {
    text: '#ffffff',
    background: '#0B0F14',
    backgroundElement: '#171E27',
    backgroundSelected: '#263342',
    textSecondary: '#AEB8C5',
    border: '#334155',
    primary: '#60A5FA',
    primaryText: '#07111F',
    link: '#93C5FD',
    heroDay: '#2563EB',
    heroNight: '#0F172A',
    heroText: '#FFFFFF',
    heroTextSecondary: 'rgba(255,255,255,0.86)',
    heroTextMuted: 'rgba(255,255,255,0.76)',
    heroBadge: 'rgba(255,255,255,0.18)',
    chartTrack: '#1E3A5F',
    warningBackground: '#3B2A12',
    warningBadge: '#F59E0B',
    warningTitle: '#FDE68A',
    warningText: '#FCD34D',
  },
} as const;

export const THEMES = Colors;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
