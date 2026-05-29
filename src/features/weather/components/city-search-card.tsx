import React from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';

import { weatherScreenStyles as styles } from '../weather-screen.styles';

export function CitySearchCard(props: {
  backgroundColor: string;
  inputBackgroundColor: string;
  inputTextColor: string;
  inputBorderColor: string;
  placeholderColor: string;
  manualCity: string;
  suggestions: readonly string[];
  showSuggestions: boolean;
  isManualLoading: boolean;
  onChangeCity: (value: string) => void;
  onFocus: () => void;
  onSelectSuggestion: (city: string) => void;
  onSearch: () => void;
  onUseCurrentLocation: () => void;
}) {
  const theme = useTheme();

  return (
    <ThemedView style={[styles.card, { backgroundColor: props.backgroundColor }]}>
      <ThemedText type="subtitle">City search</ThemedText>
      <ThemedText themeColor="textSecondary">
        Use current location or search a city in Ukraine with autocomplete.
      </ThemedText>
      <TextInput
        value={props.manualCity}
        onChangeText={props.onChangeCity}
        onFocus={props.onFocus}
        placeholder="Enter a city in Ukraine"
        placeholderTextColor={props.placeholderColor}
        autoCapitalize="words"
        autoCorrect={false}
        style={[
          styles.input,
          {
            backgroundColor: props.inputBackgroundColor,
            color: props.inputTextColor,
            borderColor: props.inputBorderColor,
          },
        ]}
        cursorColor={theme.primary}
        selectionColor={theme.primary}
      />
      {props.showSuggestions && props.manualCity.trim().length > 0 && props.suggestions.length > 0 ? (
        <ThemedView
          style={[
            styles.suggestionsCard,
            {
              backgroundColor: props.inputBackgroundColor,
              borderColor: props.inputBorderColor,
            },
          ]}>
          {props.suggestions.map((city, index) => (
            <Pressable
              key={city}
              onPress={() => props.onSelectSuggestion(city)}
              style={[
                styles.suggestionButton,
                { borderBottomColor: props.inputBorderColor },
                index === props.suggestions.length - 1 && styles.lastSuggestionButton,
              ]}>
              <ThemedText>{city}</ThemedText>
            </Pressable>
          ))}
        </ThemedView>
      ) : null}

      <View style={styles.actionsRow}>
        <Pressable
          onPress={props.onSearch}
          style={[
            styles.primaryButton,
            { backgroundColor: theme.primary },
            props.isManualLoading && styles.disabledButton,
          ]}
          disabled={props.isManualLoading}>
          <ThemedText themeColor="primaryText" style={styles.primaryButtonLabel}>
            {props.isManualLoading ? 'Loading...' : 'Search city'}
          </ThemedText>
        </Pressable>
        <Pressable
          onPress={props.onUseCurrentLocation}
          style={[styles.secondaryButton, { borderColor: theme.border }]}>
          <ThemedText style={styles.secondaryButtonLabel}>Use current location</ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}
