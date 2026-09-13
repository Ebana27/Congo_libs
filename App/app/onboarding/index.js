import { useEffect } from 'react';
import { StyleSheet, Text, StatusBar, View } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, typography } from '../../src/constants/themes';
import { loadToken } from '../../src/services/api/congolibsAPI';

const ONBOARDING_DONE_KEY = 'congolibs_onboarding_done';

const hasSeenOnboarding = async () => {
  try {
    return (await AsyncStorage.getItem(ONBOARDING_DONE_KEY)) === '1';
  } catch (e) {
    return false;
  }
};

export default function OnboardingScreen() {
  useEffect(() => {
    let mounted = true;

    const route = async () => {
      try {
        const token = await loadToken();
        if (token) {
          router.replace('/(tabs)');
          return;
        }
      } catch (e) {}
      if (!mounted) return;
      const seen = await hasSeenOnboarding();
      if (!mounted) return;
      router.replace(seen ? '/auth/login' : '/onboarding/intro');
    };

    route();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />
      <Text style={styles.logo}>Congolibs</Text>
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
  },
  logo: {
    ...typography.title,
    fontSize: 36,
  },
});