import { useEffect } from 'react';
import { Stack } from 'expo-router';

import { removeExpiredDownloads } from '../src/drm/storage';

export default function RootLayout() {
  useEffect(() => {
    removeExpiredDownloads().catch((error) => {
      console.error('Échec du nettoyage des fichiers DRM expirés.', error);
    });
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}
