import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing, type ThemeColor } from '@/constants/theme';
import { useTheme, useThemePreference, type ThemePreference } from '@/hooks/use-theme';

const OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export function ThemeToggle({ variant = 'card' }: { variant?: 'card' | 'header' }) {
  const theme = useTheme();
  const { preference, setPreference } = useThemePreference();
  const content = (
    <>
      <ThemedText type="smallBold">Theme</ThemedText>
      <View
        style={[
          styles.segment,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: theme.border,
          },
        ]}>
        {OPTIONS.map((option) => {
          const isSelected = option.value === preference;
          const textColor: ThemeColor = isSelected ? 'primaryText' : 'textSecondary';

          return (
            <Pressable
              key={option.value}
              onPress={() => setPreference(option.value)}
              style={[styles.option, isSelected && { backgroundColor: theme.primary }]}>
              <ThemedText type="smallBold" themeColor={textColor}>
                {option.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </>
  );

  if (variant === 'header') {
    return <View style={styles.headerContainer}>{content}</View>;
  }

  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      {content}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 28,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  headerContainer: {
    width: '100%',
    maxWidth: '100%',
    gap: Spacing.one,
  },
  segment: {
    borderWidth: 1,
    borderRadius: 999,
    flexDirection: 'row',
    padding: Spacing.one,
    gap: Spacing.one,
  },
  option: {
    flex: 1,
    minHeight: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.two,
  },
});
