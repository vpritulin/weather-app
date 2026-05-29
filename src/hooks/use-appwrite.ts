import { useContext } from 'react';

import { AppwriteContext } from '@/contexts/appwrite-context';

export function useAppwrite() {
  const context = useContext(AppwriteContext);

  if (!context) {
    throw new Error('useAppwrite must be used inside AppwriteProvider');
  }

  return context;
}
