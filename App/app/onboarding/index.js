import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, StatusBar, View } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, typography } from '../../src/constants/themes';
import { getCall, isSessionValid } from '../../src/services/api/congolibsAPI';

const ONBOARDING_DONE_KEY = 'congolibs_onboarding_done';

const hasSeenOnboarding = async () => {
  try {
    return (await AsyncStorage.getItem(ONBOARDING_DONE_KEY)) === '1';
  } catch (e) {
    return false;
  }
};

export default function OnboardingScreen() {
  const [status, setStatus] = useState('checking');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      setStatus('checking');
      try {
        await getCall('/documents/');
        if (!mounted) return;
        const valid = await isSessionValid();
        if (!mounted) return;
        if (valid) {
          router.replace('/(tabs)');
          return;
        }
        const seen = await hasSeenOnboarding();
        if (!mounted) return;
        router.replace(seen ? '/auth/login' : '/onboarding/intro');
      } catch (e) {
        if (mounted) setStatus('offline');
      }
    };

    check();
    return () => {
      mounted = false;
    };
  }, [attempt]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />

      <Text style={styles.logo}>Congolibs</Text>
      <Text style={styles.tagline}>Toute la connaissance, à portée de main.</Text>

      {status === 'checking' ? (
        <View style={styles.statusBlock}>
          <ActivityIndicator size="large" color={colors.primaryDark} />
          <Text style={styles.statusText}>Connexion au serveur…</Text>
        </View>
      ) : (
        <View style={styles.statusBlock}>
          <Text style={styles.errorTitle}>Serveur injoignable</Text>
          <Text style={styles.statusText}>
            Impossible de vérifier l'API pour le moment. Vérifiez votre connexion.
          </Text>
          <Pressable
            style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}
            onPress={() => setAttempt((a) => a + 1)}
          >
            <Text style={styles.retryText}>Réessayer</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  logo: {
    ...typography.title,
    fontSize: 36,
  },
  tagline: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  statusBlock: {
    alignItems: 'center',
    gap: 12,
  },
  statusText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  errorTitle: {
    ...typography.subtitle,
    fontSize: 18,
    color: colors.danger,
  },
  retryButton: {
    backgroundColor: colors.primaryDark,
    borderRadius: 14,
    paddingHorizontal: 28,
    paddingVertical: 12,
    marginTop: 8,
  },
  retryText: {
    ...typography.button,
  },
  pressed: {
    opacity: 0.7,
  },
});