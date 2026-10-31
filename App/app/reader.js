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
import { logError, logStep } from '../src/utils/logger';

// Lecteur WebView : uniquement utilisé quand une vraie source est disponible
// (aperçu Drive exposé par l'API). Sans source, aucun contenu n'est simulé — le
// bouton « Lire » de la fiche télécharge le PDF et l'ouvre avec le lecteur du
// système, la WebView Android ne rendant pas les PDF.

const asString = (value) =>
  Array.isArray(value) ? value[0] : value || '';

export default function ReaderScreen() {
  const params = useLocalSearchParams();
  const title = asString(params.title);
  const driveId = asString(params.driveId);
  const url = asString(params.url);
  const file = asString(params.file);

  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const uri = driveId
    ? `https://drive.google.com/file/d/${driveId}/preview`
    : url || file;

  const hasSource = Boolean(uri);

  logStep('lecteur ouvert', {
    titre: title || '(sans titre)',
    source: hasSource ? uri : 'AUCUNE — le backend n’expose pas le lien du fichier',
  });

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

      {!hasSource || failed ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>
            {failed ? "Impossible d'ouvrir le document" : 'Contenu indisponible'}
          </Text>
          <Text style={styles.errorText}>
            {failed
              ? 'Vérifiez votre connexion Internet puis réessayez.'
              : "La lecture dans l'application n'est pas encore disponible pour ce document. Utilisez le bouton « Télécharger » de la fiche pour l'ouvrir."}
          </Text>
          {!failed && (
            <Pressable
              style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}
              onPress={() => router.back()}
            >
              <Text style={styles.retryText}>Retour à la fiche</Text>
            </Pressable>
          )}
          {failed && (
            <Pressable
              style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}
              onPress={() => {
                setFailed(false);
                setLoading(true);
              }}
            >
              <Text style={styles.retryText}>Réessayer</Text>
            </Pressable>
          )}
        </View>
      ) : (
        <View style={styles.webContainer}>
          {loading && (
            <View style={styles.loader}>
              <ActivityIndicator color={colors.primaryDark} size="large" />
            </View>
          )}
          <WebView
            source={{ uri }}
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            allowsInlineMediaPlayback
            allowingReadAccessToURL={file || undefined}
            onLoadEnd={() => {
              setLoading(false);
              logStep('WebView chargée');
            }}
            onError={(e) => {
              setLoading(false);
              setFailed(true);
              logError('LECTURE', 'WebView en erreur', e?.nativeEvent?.description || e);
            }}
            onHttpError={(e) => {
              setLoading(false);
              setFailed(true);
              logError('LECTURE', `WebView HTTP ${e?.nativeEvent?.statusCode}`, e?.nativeEvent?.url);
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