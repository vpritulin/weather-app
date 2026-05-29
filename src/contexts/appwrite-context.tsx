import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import {
  appwriteBooksApi,
  type BookInput,
  type BookRow,
  isAppwriteConfigured,
} from '@/utils/appwrite';

type AppwriteContextValue = {
  books: BookRow[];
  loading: boolean;
  error: string | null;
  configured: boolean;
  fetchBooks: () => Promise<void>;
  createBook: (data: BookInput) => Promise<void>;
  updateBook: (rowId: string, data: BookInput) => Promise<void>;
  deleteBook: (rowId: string) => Promise<void>;
};

export const AppwriteContext = createContext<AppwriteContextValue | null>(null);

export function AppwriteProvider({ children }: { children: React.ReactNode }) {
  const [books, setBooks] = useState<BookRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const configured = isAppwriteConfigured();

  const fetchBooks = useCallback(async () => {
    if (!configured) {
      setBooks([]);
      setError('Appwrite settings are missing in .env.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      setBooks(await appwriteBooksApi.listRows());
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load rows.';
      console.error('Error fetching Appwrite rows:', err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [configured]);

  const createBook = useCallback(
    async (data: BookInput) => {
      await appwriteBooksApi.createRow(data);
      await fetchBooks();
    },
    [fetchBooks],
  );

  const updateBook = useCallback(
    async (rowId: string, data: BookInput) => {
      await appwriteBooksApi.updateRow(rowId, data);
      await fetchBooks();
    },
    [fetchBooks],
  );

  const deleteBook = useCallback(
    async (rowId: string) => {
      await appwriteBooksApi.deleteRow(rowId);
      await fetchBooks();
    },
    [fetchBooks],
  );

  useEffect(() => {
    void fetchBooks();
  }, [fetchBooks]);

  const value = useMemo(
    () => ({
      books,
      loading,
      error,
      configured,
      fetchBooks,
      createBook,
      updateBook,
      deleteBook,
    }),
    [books, loading, error, configured, fetchBooks, createBook, updateBook, deleteBook],
  );

  return <AppwriteContext.Provider value={value}>{children}</AppwriteContext.Provider>;
}
