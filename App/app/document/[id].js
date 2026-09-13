import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Download,
  Heart,
  Tag,
  UserRound,
} from 'lucide-react-native';
import { colors, typography, fonts } from '../../src/constants/themes';
import { getCall, downloadDocument } from '../../src/services/api/congolibsAPI';
import ErrorModal from '../../src/components/shared/ErrorModal';
import SuccessModal from '../../src/components/shared/SuccessModal';

const placeholder = require('../../assets/images/home/placeholder-book.png');

const TYPE_LABELS = { livre: 'Livre', concours: 'Concours', bac: 'Bac' };

export default function DocumentDetailScreen() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const fallbackName = Array.isArray(params.name) ? params.name[0] : params.name;
  const fallbackTxt = Array.isArray(params.txt) ? params.txt[0] : params.txt;

  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    let mounted = true;
    getCall(`/documents/${encodeURIComponent(id)}/`)
      .then((data) => mounted && setDoc(data))
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  const name = doc?.nom || fallbackName || 'Document en préparation';
  const type = doc?.type || 'livre';
  const date = doc?.date_creation ? new Date(doc.date_creation).toLocaleDateString('fr-FR') : null;
  const author = fallbackTxt;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const uri = await downloadDocument(id, name);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: name,
          UTI: 'com.adobe.pdf',
        });
      } else {
        setSuccessMessage('Le document a été téléchargé dans vos fichiers.');
      }
    } catch (e) {
      setErrorMessage(e.message || 'Impossible de télécharger ce document pour le moment.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />

      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          hitSlop={12}
        >
          <ArrowLeft size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.topTitle}>Détail du document</Text>
        <View style={styles.backButton} />
      </View>

      {loading && !doc && !fallbackName ? (
        <ActivityIndicator
          color={colors.primaryDark}
          size="large"
          style={styles.loader}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.coverWrap}>
            <Image source={placeholder} style={styles.cover} resizeMode="cover" />
          </View>

          <Text style={styles.title}>{name}</Text>
          {author ? <Text style={styles.author}>{author}</Text> : null}

          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Tag size={13} color={colors.primaryDark} />
              <Text style={styles.badgeText}>{TYPE_LABELS[type] || type}</Text>
            </View>
            {date ? (
              <View style={styles.badge}>
                <CalendarDays size={13} color={colors.primaryDark} />
                <Text style={styles.badgeText}>{date}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.card}>
            <View style={styles.cardRow}>
              <View style={styles.cardIcon}>
                <BookOpen size={20} color={colors.primaryDark} />
              </View>
              <View style={styles.cardTexts}>
                <Text style={styles.cardLabel}>Description</Text>
                <Text style={styles.cardValue}>
                  {author
                    ? `Document ${TYPE_LABELS[type] || type} issu de la bibliothèque Congolibs. Consultez son contenu, ajoutez-le à vos favoris ou téléchargez-le pour le lire hors connexion.`
                    : 'Ce document fait partie de la bibliothèque Congolibs. Sa fiche complète sera disponible après synchronisation.'}
                </Text>
              </View>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.favoriteButton,
              favorite && styles.favoriteButtonOn,
              pressed && styles.pressed,
            ]}
            onPress={() => setFavorite((f) => !f)}
          >
            <Heart
              size={20}
              color={favorite ? colors.surface : colors.primaryDark}
              fill={favorite ? colors.surface : 'none'}
            />
            <Text style={[styles.favoriteText, favorite && styles.favoriteTextOn]}>
              {favorite ? 'Ajouté aux favoris' : 'Ajouter aux favoris'}
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.downloadButton, pressed && styles.pressed]}
            onPress={handleDownload}
            disabled={downloading}
          >
            <Download size={20} color={colors.surface} />
            <Text style={styles.downloadText}>
              {downloading ? 'Téléchargement…' : 'Télécharger'}
            </Text>
          </Pressable>
        </ScrollView>
      )}

      <ErrorModal visible={!!errorMessage} message={errorMessage} onClose={() => setErrorMessage(null)} />
      <SuccessModal visible={!!successMessage} message={successMessage} onClose={() => setSuccessMessage(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  topTitle: {
    ...typography.subtitle,
    fontSize: 17,
  },
  loader: {
    marginTop: 80,
  },
  content: {
    padding: 24,
    alignItems: 'center',
    paddingBottom: 44,
  },
  coverWrap: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  cover: {
    width: 168,
    height: 232,
  },
  title: {
    ...typography.title,
    fontSize: 22,
    textAlign: 'center',
  },
  author: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    marginBottom: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primaryLight,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    fontFamily: fonts.poppinsSemiBold,
    fontSize: 12,
    color: colors.primaryDark,
  },
  card: {
    alignSelf: 'stretch',
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(6, 10, 13, 0.07)',
    padding: 16,
    marginTop: 16,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(8, 138, 73, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTexts: {
    flex: 1,
  },
  cardLabel: {
    ...typography.caption,
    fontFamily: fonts.poppinsSemiBold,
    fontSize: 12,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  cardValue: {
    ...typography.caption,
    fontSize: 13,
    lineHeight: 20,
    color: colors.text,
  },
  favoriteButton: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: colors.primaryDark,
    borderRadius: 16,
    paddingVertical: 15,
    marginTop: 20,
  },
  favoriteButtonOn: {
    backgroundColor: colors.primaryDark,
  },
  favoriteText: {
    ...typography.button,
    color: colors.primaryDark,
  },
  favoriteTextOn: {
    color: colors.surface,
  },
  downloadButton: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.primaryDark,
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 12,
  },
  downloadText: {
    ...typography.button,
    fontSize: 16,
  },
  pressed: {
    opacity: 0.7,
  },
});