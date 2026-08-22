import { useState } from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const colors = isDark
    ? { bg: '#000000', fg: '#ffffff', muted: '#8e8e93', card: '#1c1c1e', border: '#2c2c2e' }
    : { bg: '#ffffff', fg: '#000000', muted: '#8e8e93', card: '#f2f2f7', border: '#e5e5ea' };

  async function callCongolibs() {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const res = await fetch(API_URL, { headers: { Accept: 'application/json' } });
      const text = await res.text();
      if (!res.ok) {
        setError(`HTTP ${res.status}`);
      }
      setResponse(text);
    } catch (e) {
      setError(e.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.fg }]}>CongoLibs</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>Client mobile</Text>

        <TouchableOpacity
          style={[styles.button, { borderColor: colors.fg }]}
          onPress={callCongolibs}
          disabled={loading}
          activeOpacity={0.7}
        >
          {loading ? (
            <ActivityIndicator color={colors.fg} />
          ) : (
            <Text style={[styles.buttonLabel, { color: colors.fg }]}>Appeler l'API</Text>
          )}
        </TouchableOpacity>

        {(error !== null || response !== null) && (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {error !== null && <Text style={[styles.error, { color: '#ff3b30' }]}>{error}</Text>}
            <Text style={[styles.result, { color: colors.fg }]} numberOfLines={20}>
              {response}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '300',
  },
  button: {
    marginTop: 24,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 40,
    paddingVertical: 14,
    minWidth: 180,
    alignItems: 'center',
  },
  buttonLabel: {
    fontSize: 15,
    letterSpacing: 0.5,
  },
  card: {
    marginTop: 24,
    alignSelf: 'stretch',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  error: {
    fontSize: 13,
    fontWeight: '600',
  },
  result: {
    fontFamily: 'monospace',
    fontSize: 13,
  },
});
