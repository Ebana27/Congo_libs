import { useState } from 'react';
import { ActivityIndicator, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';
import { ArrowLeft } from 'lucide-react-native';
import { colors, typography } from '../src/constants/themes';

export default function WebViewScreen() {
  const { url, title } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          hitSlop={12}
        >
          <ArrowLeft size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.topTitle} numberOfLines={1}>
          {title || 'Congolibs'}
        </Text>
        {/* Espace vide pour centrer le titre */}
        <View style={styles.backButton} />
      </View>

      <View style={styles.webContainer}>
        {loading && (
          <View style={styles.loader}>
            <ActivityIndicator color={colors.primaryDark} size="large" />
          </View>
        )}
        <WebView
          source={{ uri: url }}
          onLoadEnd={() => setLoading(false)}
          style={styles.web}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
  },
  topTitle: {
    ...typography.subtitle,
    fontSize: 17,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  webContainer: {
    flex: 1,
  },
  web: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});