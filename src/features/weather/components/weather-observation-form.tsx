import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type FormValues = {
  name: string;
  email: string;
  city: string;
  temperature: string;
  note: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const INITIAL_VALUES: FormValues = {
  name: '',
  email: '',
  city: '',
  temperature: '',
  note: '',
};

function validateForm(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const temperature = Number(values.temperature.replace(',', '.'));

  if (!values.name.trim()) {
    errors.name = 'Enter your name.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email.';
  }

  if (!values.city.trim()) {
    errors.city = 'Enter a city.';
  }

  if (!values.temperature.trim() || Number.isNaN(temperature)) {
    errors.temperature = 'Enter a numeric temperature.';
  } else if (temperature < -80 || temperature > 60) {
    errors.temperature = 'Temperature must be between -80 and 60 C.';
  }

  if (values.note.trim().length < 8) {
    errors.note = 'Add at least 8 characters.';
  }

  return errors;
}

export function WeatherObservationForm() {
  const theme = useTheme();
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submittedValues, setSubmittedValues] = useState<FormValues | null>(null);

  const updateValue = (field: keyof FormValues) => (value: string) => {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
  };

  const handleSubmit = () => {
    const nextErrors = validateForm(values);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      Alert.alert('Form error', 'Please check the highlighted fields.');
      return;
    }

    const submitted = {
      name: values.name.trim(),
      email: values.email.trim(),
      city: values.city.trim(),
      temperature: values.temperature.trim(),
      note: values.note.trim(),
    };

    setSubmittedValues(submitted);
    console.log('Weather observation form:', submitted);
    Alert.alert(
      'Form data',
      `Name: ${submitted.name}\nEmail: ${submitted.email}\nCity: ${submitted.city}\nTemperature: ${submitted.temperature} C\nNote: ${submitted.note}`,
    );
  };

  const handleReset = () => {
    setValues(INITIAL_VALUES);
    setErrors({});
    setSubmittedValues(null);
  };

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.header}>
        <ThemedText type="subtitle" style={styles.title}>
          Observation form
        </ThemedText>
        <ThemedText themeColor="textSecondary">
          Send a local weather note and validate the entered data before submission.
        </ThemedText>
      </View>

      <View style={styles.fields}>
        <FormField
          label="Name"
          value={values.name}
          error={errors.name}
          placeholder="Enter your name"
          onChangeText={updateValue('name')}
        />
        <FormField
          label="Email"
          value={values.email}
          error={errors.email}
          placeholder="name@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={updateValue('email')}
        />
        <FormField
          label="City"
          value={values.city}
          error={errors.city}
          placeholder="Kyiv"
          onChangeText={updateValue('city')}
        />
        <FormField
          label="Temperature, C"
          value={values.temperature}
          error={errors.temperature}
          placeholder="18"
          keyboardType="numeric"
          onChangeText={updateValue('temperature')}
        />
        <FormField
          label="Weather note"
          value={values.note}
          error={errors.note}
          placeholder="Describe the weather outside"
          multiline
          onChangeText={updateValue('note')}
        />
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={handleSubmit}
          style={[styles.primaryButton, { backgroundColor: theme.primary }]}>
          <ThemedText type="smallBold" themeColor="primaryText">
            Submit
          </ThemedText>
        </Pressable>
        <Pressable
          onPress={handleReset}
          style={[styles.secondaryButton, { borderColor: theme.border }]}>
          <ThemedText type="smallBold">Reset</ThemedText>
        </Pressable>
      </View>

      {submittedValues ? (
        <ThemedView style={[styles.resultCard, { borderColor: theme.border }]}>
          <ThemedText type="smallBold">Last submitted data</ThemedText>
          <ThemedText themeColor="textSecondary">Name: {submittedValues.name}</ThemedText>
          <ThemedText themeColor="textSecondary">Email: {submittedValues.email}</ThemedText>
          <ThemedText themeColor="textSecondary">City: {submittedValues.city}</ThemedText>
          <ThemedText themeColor="textSecondary">
            Temperature: {submittedValues.temperature} C
          </ThemedText>
          <ThemedText themeColor="textSecondary">Note: {submittedValues.note}</ThemedText>
        </ThemedView>
      ) : null}
    </ThemedView>
  );
}

function FormField(
  props: {
    label: string;
    value: string;
    error?: string;
    placeholder: string;
    onChangeText: (value: string) => void;
  } & Omit<React.ComponentProps<typeof TextInput>, 'style' | 'value' | 'placeholder' | 'onChangeText'>,
) {
  const theme = useTheme();
  const borderColor = props.error ? theme.warningBadge : theme.border;

  return (
    <View style={styles.field}>
      <ThemedText type="smallBold">{props.label}</ThemedText>
      <TextInput
        {...props}
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        placeholderTextColor={theme.textSecondary}
        cursorColor={theme.primary}
        selectionColor={theme.primary}
        style={[
          styles.input,
          props.multiline && styles.multilineInput,
          {
            backgroundColor: theme.background,
            borderColor,
            color: theme.text,
          },
        ]}
      />
      {props.error ? (
        <ThemedText type="small" themeColor="warningText">
          {props.error}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  header: {
    gap: Spacing.one,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
  },
  fields: {
    gap: Spacing.three,
  },
  field: {
    gap: Spacing.one,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  multilineInput: {
    minHeight: 104,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  primaryButton: {
    minHeight: 48,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  secondaryButton: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  resultCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.three,
    gap: Spacing.one,
  },
});
