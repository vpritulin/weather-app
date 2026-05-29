export const APPWRITE_ENDPOINT =
  process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT?.replace(/\/$/, '') ??
  'https://fra.cloud.appwrite.io/v1';
export const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID ?? '';
export const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID ?? '';
export const TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID ?? '';
export const DEV_KEY = process.env.EXPO_PUBLIC_APPWRITE_DEV_KEY ?? '';
export const PLATFORM = process.env.EXPO_PUBLIC_APPWRITE_PLATFORM ?? '';

export type BookRow = {
  $id: string;
  title: string;
  author: string;
  pages: number;
  year: number;
};

export type BookInput = {
  title: string;
  author: string;
  pages: number;
  year: number;
};

type ListRowsResponse = {
  rows?: BookRow[];
  documents?: BookRow[];
};

export function isAppwriteConfigured() {
  return Boolean(PROJECT_ID && DATABASE_ID && TABLE_ID);
}

function createHeaders() {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Appwrite-Project': PROJECT_ID,
    'X-Appwrite-Response-Format': '1.8.0',
  };

  if (DEV_KEY) {
    headers['X-Appwrite-Dev-Key'] = DEV_KEY;
  }

  if (PLATFORM) {
    headers['X-Appwrite-Platform'] = PLATFORM;
  }

  return headers;
}

function createRowsUrl(rowId?: string) {
  const baseUrl = `${APPWRITE_ENDPOINT}/tablesdb/${DATABASE_ID}/tables/${TABLE_ID}/rows`;

  return rowId ? `${baseUrl}/${rowId}` : baseUrl;
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  if (!isAppwriteConfigured()) {
    throw new Error('Appwrite is not configured. Fill EXPO_PUBLIC_APPWRITE_* variables.');
  }

  const response = await fetch(url, {
    ...init,
    headers: {
      ...createHeaders(),
      ...init?.headers,
    },
  });

  const text = await response.text();
  const body = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message =
      response.status === 401
        ? 'Unauthorized. Check Appwrite table permissions: grant read/create/update/delete access to Role "Any" for this lab, or sign in a user with access.'
        : body?.message ?? `Appwrite request failed with ${response.status}`;

    throw new Error(message);
  }

  return body as T;
}

export const appwriteBooksApi = {
  async listRows() {
    const response = await request<ListRowsResponse>(createRowsUrl());

    return response.rows ?? response.documents ?? [];
  },

  async createRow(data: BookInput) {
    return request<BookRow>(createRowsUrl(), {
      method: 'POST',
      body: JSON.stringify({
        rowId: 'unique()',
        data,
        permissions: ['read("any")', 'write("any")'],
      }),
    });
  },

  async updateRow(rowId: string, data: BookInput) {
    return request<BookRow>(createRowsUrl(rowId), {
      method: 'PATCH',
      body: JSON.stringify({ data }),
    });
  },

  async deleteRow(rowId: string) {
    await request<unknown>(createRowsUrl(rowId), {
      method: 'DELETE',
    });
  },
};
