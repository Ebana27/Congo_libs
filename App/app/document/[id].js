import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Download,
  Heart,
  Share2,
  Star,
  Tag,
} from 'lucide-react-native';
import { colors, typography, fonts } from '../../src/constants/themes';
import { getCall, downloadDocument } from '../../src/services/api/congolibsAPI';
import { logError, logStep } from '../../src/utils/logger';
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
  const [reading, setReading] = useState(false);
  // TODO : brancher la note moyenne + la note de l'utilisateur sur l'API
  // dès qu'un endpoint dédié sera exposé côté backend.
  const [rating, setRating] = useState(0);
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
    logStep('bouton Télécharger', { id, nom: name });
    try {
      const uri = await downloadDocument(id, name);
      logStep('partage système', uri);
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
      logError('LECTURE', 'échec', e.message);
      setErrorMessage(e.message || 'Impossible de télécharger ce document pour le moment.');
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: name,
        message: `Découvre "${name}" sur Congolibs 📚`,
      });
    } catch (e) {
      setErrorMessage('Impossible de partager ce document pour le moment.');
    }
  };

  const handleRead = async () => {
    const driveId = doc?.lien_telechargement;
    logStep('bouton Lire', { id, nom: name, lienDrive: driveId || 'absent (API publique)' });
    if (driveId) {
      router.push({ pathname: '/reader', params: { driveId, title: name } });
      return;
    }
    // L'API publique n'expose pas le lien du fichier (volontaire côté
    // sécurité). On récupère donc le PDF via l'endpoint de téléchargement et
    // on l'ouvre avec le lecteur du système : c'est la seule façon d'afficher
    // le contenu réel, la WebView Android ne rendant pas les PDF.
    setReading(true);
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
      logError('LECTURE', 'échec', e.message);
      setErrorMessage(e.message || "Impossible d'ouvrir ce document pour le moment.");
    } finally {
      setReading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {loading && !doc && !fallbackName ? (
        <ActivityIndicator
          color={colors.primaryDark}
          size="large"
          style={styles.loader}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Fond flouté + dégradé */}
          <View style={styles.hero}>
            <ImageBackground source={placeholder} style={styles.heroImage} blurRadius={2}>
              <BlurView intensity={55} tint="dark" style={StyleSheet.absoluteFill} />
              <LinearGradient
                colors={['rgba(6,10,13,0.25)', colors.background]}
                locations={[0, 1]}
                style={StyleSheet.absoluteFill}
              />
            </ImageBackground>

            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
              hitSlop={12}
            >
              <ArrowLeft size={22} color={colors.surface} />
            </Pressable>

            {/* Tag du type de document : uniquement sur la vue détail, en haut à droite */}
            <View style={styles.heroTag}>
              <Tag size={13} color={colors.primaryDark} />
              <Text style={styles.heroTagText}>{TYPE_LABELS[type] || type}</Text>
            </View>
          </View>

          {/* Couverture nette flottante */}
          <View style={styles.coverWrap}>
            <Image source={placeholder} style={styles.cover} resizeMode="cover" />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>{name}</Text>
            {author ? <Text style={styles.author}>{author}</Text> : null}

            {/* Notation par étoiles */}
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((value) => (
                <Pressable
                  key={value}
                  onPress={() => setRating(value)}
                  hitSlop={6}
                  style={({ pressed }) => pressed && styles.pressed}
                >
                  <Star
                    size={24}
                    color={colors.primaryDark}
                    fill={value <= rating ? colors.primaryDark : 'none'}
                  />
                </Pressable>
              ))}
              {rating > 0 ? (
                <Text style={styles.ratingValue}>{rating}/5</Text>
              ) : (
                <Text style={styles.ratingHint}>Notez ce document</Text>
              )}
            </View>

            <View style={styles.badgeRow}>
              {date ? (
                <View style={styles.badge}>
                  <CalendarDays size={13} color={colors.primaryDark} />
                  <Text style={styles.badgeText}>{date}</Text>
                </View>
              ) : null}
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Description</Text>
              <Text style={styles.sectionText}>
                {author
                  ? `Document ${TYPE_LABELS[type] || type} issu de la bibliothèque Congolibs. Consultez son contenu, ajoutez-le à vos favoris ou téléchargez-le pour le lire hors connexion.`
                  : 'Ce document fait partie de la bibliothèque Congolibs. Sa fiche complète sera disponible après synchronisation.'}
              </Text>
            </View>
              
            {/* Actions à la suite */}
            <View style={styles.actionRow}>
              <Pressable
                style={({ pressed }) => [styles.readButton, pressed && styles.pressed]}
                onPress={handleRead}
                disabled={reading}
              >
                {reading ? (
                  <ActivityIndicator size="small" color={colors.surface} />
                ) : (
                  <BookOpen size={19} color={colors.surface} />
                )}
                <Text style={styles.readText}>Lire</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
                onPress={handleDownload}
                disabled={downloading}
              >
                {downloading ? (
                  <ActivityIndicator size="small" color={colors.primaryDark} />
                ) : (
                  <Download size={19} color={colors.primaryDark} />
                )}
              </Pressable>

              <Pressable
                style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
                onPress={handleShare}
              >
                <Share2 size={19} color={colors.primaryDark} />
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.iconButton,
                  favorite && styles.iconButtonOn,
                  pressed && styles.pressed,
                ]}
                onPress={() => setFavorite((f) => !f)}
              >
                <Heart
                  size={19}
                  color={favorite ? colors.surface : colors.primaryDark}
                  fill={favorite ? colors.surface : 'none'}
                />
              </Pressable>
            </View>
          </View>
        </ScrollView>
      )}

      <ErrorModal visible={!!errorMessage} message={errorMessage} onClose={() => setErrorMessage(null)} />
      <SuccessModal visible={!!successMessage} message={successMessage} onClose={() => setSuccessMessage(null)} />
    </View>
  );
}

const HERO_HEIGHT = 280;
const COVER_WIDTH = 148;
const COVER_HEIGHT = 208;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loader: {
    marginTop: 80,
  },
  scrollContent: {
    paddingBottom: 44,
  },
  hero: {
    height: HERO_HEIGHT,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 54,
    left: 16,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6, 10, 13, 0.35)',
  },
  heroTag: {
    position: 'absolute',
    top: 54,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  heroTagText: {
    fontFamily: fonts.poppinsSemiBold,
    fontSize: 12,
    color: colors.primaryDark,
  },
  coverWrap: {
    alignSelf: 'center',
    marginTop: -(COVER_HEIGHT / 2 + 30),
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  cover: {
    width: COVER_WIDTH,
    height: COVER_HEIGHT,
  },
  content: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    ...typography.title,
    fontSize: 22,
    textAlign: 'center',
    marginTop: 18,
  },
  author: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 14,
  },
  ratingValue: {
    ...typography.caption,
    fontFamily: fonts.poppinsSemiBold,
    color: colors.primaryDark,
    marginLeft: 6,
  },
  ratingHint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
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
  actionRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: 10,
    marginTop: 22,
  },
  readButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primaryDark,
    borderRadius: 16,
    paddingVertical: 15,
  },
  readText: {
    ...typography.button,
    fontSize: 16,
  },
  iconButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconButtonOn: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  section: {
    alignSelf: 'stretch',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 18,
    marginTop: 26,
  },
  sectionLabel: {
    ...typography.caption,
    fontFamily: fonts.poppinsSemiBold,
    fontSize: 12,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  sectionText: {
    ...typography.body,
    fontSize: 14,
    lineHeight: 22,
    color: colors.text,
  },
  pressed: {
    opacity: 0.7,
  },
});