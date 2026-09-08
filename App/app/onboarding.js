import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, StatusBar, View } from 'react-native';
import { router } from 'expo-router';
import { colors, typography } from '../src/constants/themes';
import { isSessionValid } from '../src/services/api/congolibsAPI';

export default function Onboarding() {
  useEffect(() => {
    let mounted = true;
    isSessionValid().then((valid) => {
      if (!mounted) return;
      router.replace(valid ? '/(tabs)' : '/auth/login');
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />
      <View style={styles.container}>
        <Text style={styles.logo}>Congolibs</Text>
        <ActivityIndicator size="large" color={colors.primaryDark} />
      </View>
    </>
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
