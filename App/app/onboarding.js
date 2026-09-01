import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { colors, typography } from '../src/constants/themes';

const LOADING_DURATION = 3000;

export default function Onboarding() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, LOADING_DURATION);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Congolibs</Text>
      <ActivityIndicator size="large" color={colors.primaryDark} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  logo: {
    ...typography.title,
    fontSize: 32,
    lineHeight: 40,
  },
});