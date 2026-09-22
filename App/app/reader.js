import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';
import { ArrowLeft } from 'lucide-react-native';
import { colors, typography } from '../src/constants/themes';

// TEMPORAIRE — lecteur WebView en attendant un lecteur PDF natif
// (expo-pdf / react-native-pdf). À remplacer côté natif, notamment pour
// le rendu des PDF locaux sur Android (la WebView Android ne rend pas les PDF).

const asString = (value) =>
  Array.isArray(value) ? value[0] : value || '';

const PLACEHOLDER_HTML = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
  body { margin: 0; font-family: -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; background: #edf8f1; color: #060a0d; }
  .wrap { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px; text-align: center; }
  .badge { width: 96px; height: 96px; border-radius: 50%; background: #088a49; color: #fff; display: flex; align-items: center; justify-content: center; font-family: 'Segoe UI', Arial, sans-serif; font-weight: 700; font-size: 30px; letter-spacing: 1px; margin-bottom: 24px; }
  h1 { font-size: 26px; margin: 0 0 8px; }
  p { font-size: 16px; line-height: 24px; color: #074a2b; margin: 0 0 4px; }
  .note { font-size: 13px; color: #5a7a6a; margin-top: 24px; max-width: 300px; }
</style>
</head>
<body>
  <div class="wrap">
    <div class="badge">CL</div>
    <h1>Hello les gars</h1>
    <p>Ceci est l'\u00e9cran de d\u00e9monstration du lecteur.</p>
    <p class="note">Le lecteur affichera ici les vrais documents dès que le backend fournira leur lien de lecture.</p>
  </div>
</body>
</html>`;

export default function ReaderScreen() {
  const params = useLocalSearchParams();
  const title = asString(params.title);
  const driveId = asString(params.driveId);
  const url = asString(params.url);
  const file = asString(params.file);
  const isPlaceholder = asString(params.html) === '1';

  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const uri = driveId
    ? `https://drive.google.com/file/d/${driveId}/preview`
    : url || file;

  const source = isPlaceholder
    ? { html: PLACEHOLDER_HTML }
    : { uri: uri || 'about:blank' };

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
          {title || 'Lire le document'}
        </Text>
        <View style={styles.backButton} />
      </View>

      {failed ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Impossible d'ouvrir le document</Text>
          <Text style={styles.errorText}>
            Vérifiez votre connexion Internet puis réessayez.
          </Text>
          <Pressable
            style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}
            onPress={() => {
              setFailed(false);
              setLoading(true);
            }}
          >
            <Text style={styles.retryText}>Réessayer</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.webContainer}>
          {loading && (
            <View style={styles.loader}>
              <ActivityIndicator color={colors.primaryDark} size="large" />
            </View>
          )}
          <WebView
            source={source}
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            allowsInlineMediaPlayback
            allowingReadAccessToURL={file || undefined}
            onLoadEnd={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setFailed(true);
            }}
            onHttpError={() => {
              setLoading(false);
              setFailed(true);
            }}
            style={styles.web}
          />
        </View>
      )}
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
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    ...typography.subtitle,
    fontSize: 18,
    color: colors.danger,
    textAlign: 'center',
  },
  errorText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  retryButton: {
    backgroundColor: colors.primaryDark,
    borderRadius: 14,
    paddingHorizontal: 28,
    paddingVertical: 12,
    marginTop: 16,
  },
  retryText: {
    ...typography.button,
  },
  pressed: {
    opacity: 0.7,
  },
});