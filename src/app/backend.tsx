import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemeToggle } from '@/components/theme-toggle';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAppwrite } from '@/hooks/use-appwrite';
import { useTheme } from '@/hooks/use-theme';
import { type BookInput, type BookRow } from '@/utils/appwrite';

type BookFormState = {
  title: string;
  author: string;
  pages: string;
  year: string;
};

type BookFormErrors = Partial<Record<keyof BookFormState, string>>;

const EMPTY_FORM: BookFormState = {
  title: '',
  author: '',
  pages: '',
  year: '',
};

function validateBookForm(values: BookFormState): BookFormErrors {
  const errors: BookFormErrors = {};
  const pages = Number(values.pages);
  const year = Number(values.year);
  const currentYear = new Date().getFullYear();

  if (!values.title.trim()) {
    errors.title = 'Enter a book title.';
  }

  if (!values.author.trim()) {
    errors.author = 'Enter an author.';
  }

  if (!Number.isInteger(pages) || pages <= 0) {
    errors.pages = 'Pages must be a positive integer.';
  }

  if (!Number.isInteger(year) || year < 1450 || year > currentYear) {
    errors.year = `Year must be between 1450 and ${currentYear}.`;
  }

  return errors;
}

function toBookInput(values: BookFormState): BookInput {
  return {
    title: values.title.trim(),
    author: values.author.trim(),
    pages: Number(values.pages),
    year: Number(values.year),
  };
}

export default function BackendScreen() {
  const theme = useTheme();
  const { books, loading, error, configured, fetchBooks, createBook, updateBook, deleteBook } =
    useAppwrite();
  const [editingBook, setEditingBook] = useState<BookRow | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [form, setForm] = useState<BookFormState>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<BookFormErrors>({});
  const title = editingBook ? 'Edit book row' : 'Create book row';

  const sortedBooks = useMemo(
    () => [...books].sort((first, second) => second.year - first.year),
    [books],
  );

  useEffect(() => {
    if (!editingBook) {
      return;
    }

    setForm({
      title: editingBook.title,
      author: editingBook.author,
      pages: String(editingBook.pages),
      year: String(editingBook.year),
    });
    setFormErrors({});
  }, [editingBook]);

  const updateField = (field: keyof BookFormState) => (value: string) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    setFormErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
  };

  const resetForm = () => {
    setEditingBook(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setIsFormVisible(false);
  };

  const openCreateForm = () => {
    setEditingBook(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setIsFormVisible(true);
  };

  const openEditForm = (book: BookRow) => {
    setEditingBook(book);
    setIsFormVisible(true);
  };

  const handleSubmit = async () => {
    const nextErrors = validateBookForm(form);

    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      Alert.alert('Validation error', 'Please check the highlighted fields.');
      return;
    }

    try {
      if (editingBook) {
        await updateBook(editingBook.$id, toBookInput(form));
        Alert.alert('Saved', 'Book row was updated in Appwrite.');
      } else {
        await createBook(toBookInput(form));
        Alert.alert('Saved', 'Book row was created in Appwrite.');
      }

      resetForm();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save row.';
      Alert.alert('Appwrite error', message);
    }
  };

  const handleDelete = async (book: BookRow) => {
    try {
      await deleteBook(book.$id);
      if (editingBook?.$id === book.$id) {
        resetForm();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete row.';
      Alert.alert('Appwrite error', message);
    }
  };

  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedView style={styles.container}>
            <ThemedView style={styles.pageHeader}>
              <View style={styles.headerTitleGroup}>
                <ThemedText type="subtitle" style={styles.appTitle}>
                  Appwrite books
                </ThemedText>
                <ThemedText themeColor="textSecondary">
                  CRUD rows through the TablesDB backend
                </ThemedText>
              </View>
              <ThemeToggle variant="header" />
            </ThemedView>

            {!configured ? (
              <ThemedView type="backgroundElement" style={styles.noticeCard}>
                <ThemedText type="subtitle" style={styles.noticeTitle}>
                  Backend is not configured
                </ThemedText>
                <ThemedText themeColor="textSecondary">
                  Fill EXPO_PUBLIC_APPWRITE_ENDPOINT, PROJECT_ID, DATABASE_ID and TABLE_ID in
                  your .env file. DEV_KEY and PLATFORM are optional for development.
                </ThemedText>
              </ThemedView>
            ) : null}

            {isFormVisible ? (
              <ThemedView type="backgroundElement" style={styles.formCard}>
                <ThemedText type="subtitle" style={styles.formTitle}>
                  {title}
                </ThemedText>
                <BookField
                  label="Title"
                  value={form.title}
                  error={formErrors.title}
                  placeholder="Clean Code"
                  onChangeText={updateField('title')}
                />
                <BookField
                  label="Author"
                  value={form.author}
                  error={formErrors.author}
                  placeholder="Robert C. Martin"
                  onChangeText={updateField('author')}
                />
                <View style={styles.twoColumnRow}>
                  <BookField
                    label="Pages"
                    value={form.pages}
                    error={formErrors.pages}
                    placeholder="464"
                    keyboardType="numeric"
                    onChangeText={updateField('pages')}
                  />
                  <BookField
                    label="Year"
                    value={form.year}
                    error={formErrors.year}
                    placeholder="2008"
                    keyboardType="numeric"
                    onChangeText={updateField('year')}
                  />
                </View>
                <View style={styles.actionsRow}>
                  <Pressable
                    disabled={!configured || loading}
                    onPress={handleSubmit}
                    style={[
                      styles.primaryButton,
                      { backgroundColor: theme.primary },
                      (!configured || loading) && styles.disabledButton,
                    ]}>
                    <ThemedText type="smallBold" themeColor="primaryText">
                      {editingBook ? 'Update row' : 'Create row'}
                    </ThemedText>
                  </Pressable>
                  <Pressable
                    onPress={resetForm}
                    style={[styles.secondaryButton, { borderColor: theme.border }]}>
                    <ThemedText type="smallBold">Cancel</ThemedText>
                  </Pressable>
                </View>
              </ThemedView>
            ) : null}

            <ThemedView type="backgroundElement" style={styles.listCard}>
              <View style={styles.listHeader}>
                <ThemedText type="subtitle" style={styles.formTitle}>
                  Rows
                </ThemedText>
                <View style={styles.listHeaderActions}>
                  <Pressable
                    disabled={!configured}
                    onPress={openCreateForm}
                    style={[
                      styles.primaryButton,
                      { backgroundColor: theme.primary },
                      !configured && styles.disabledButton,
                    ]}>
                    <ThemedText type="smallBold" themeColor="primaryText">
                      Add record
                    </ThemedText>
                  </Pressable>
                  <Pressable
                    disabled={!configured || loading}
                    onPress={() => void fetchBooks()}
                    style={[styles.secondaryButton, { borderColor: theme.border }]}>
                    <ThemedText type="smallBold">{loading ? 'Loading...' : 'Refresh'}</ThemedText>
                  </Pressable>
                </View>
              </View>

              {error ? <ThemedText themeColor="warningText">{error}</ThemedText> : null}
              {sortedBooks.length === 0 && !loading ? (
                <ThemedText themeColor="textSecondary">No rows loaded yet.</ThemedText>
              ) : null}

              {sortedBooks.map((book) => (
                <ThemedView
                  key={book.$id}
                  style={[styles.bookRow, { borderColor: theme.border }]}>
                  <View style={styles.bookInfo}>
                    <ThemedText type="smallBold">{book.title}</ThemedText>
                    <ThemedText themeColor="textSecondary">
                      {book.author} · {book.pages} pages · {book.year}
                    </ThemedText>
                  </View>
                  <View style={styles.rowActions}>
                    <Pressable
                      onPress={() => openEditForm(book)}
                      style={[styles.compactButton, { borderColor: theme.border }]}>
                      <ThemedText type="smallBold">Edit</ThemedText>
                    </Pressable>
                    <Pressable
                      onPress={() => void handleDelete(book)}
                      style={[styles.compactButton, { borderColor: theme.warningBadge }]}>
                      <ThemedText type="smallBold" themeColor="warningText">
                        Delete
                      </ThemedText>
                    </Pressable>
                  </View>
                </ThemedView>
              ))}
            </ThemedView>
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function BookField(
  props: {
    label: string;
    value: string;
    error?: string;
    placeholder: string;
    onChangeText: (value: string) => void;
  } & Omit<React.ComponentProps<typeof TextInput>, 'style' | 'value' | 'placeholder' | 'onChangeText'>,
) {
  const theme = useTheme();

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
          {
            backgroundColor: theme.background,
            borderColor: props.error ? theme.warningBadge : theme.border,
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
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.four,
    gap: Spacing.three,
  },
  pageHeader: {
    alignItems: 'stretch',
    gap: Spacing.three,
  },
  headerTitleGroup: {
    gap: Spacing.half,
  },
  appTitle: {
    fontSize: 28,
    lineHeight: 34,
  },
  noticeCard: {
    borderRadius: 28,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  noticeTitle: {
    fontSize: 24,
    lineHeight: 30,
  },
  formCard: {
    borderRadius: 28,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  formTitle: {
    fontSize: 28,
    lineHeight: 34,
  },
  field: {
    flex: 1,
    minWidth: 160,
    gap: Spacing.one,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
    fontWeight: '500',
  },
  twoColumnRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  actionsRow: {
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
  disabledButton: {
    opacity: 0.65,
  },
  listCard: {
    borderRadius: 28,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  listHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  listHeaderActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  bookRow: {
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  bookInfo: {
    gap: Spacing.one,
  },
  rowActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  compactButton: {
    minHeight: 40,
    borderWidth: 1,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
});
