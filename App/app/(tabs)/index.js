import { useRef, useEffect, useState } from 'react';
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { colors, typography, fonts } from '../../src/constants/themes';
import BookCard from '../../src/components/books/BookCard';
import { getDocuments } from '../../src/services/api/congolibsAPI';

// ── Visuels ─────────────────────────────────────────────────────────────────
const heroVisual = require('../../assets/images/home/congolibs-hero-visual.png');
const placeholder = require('../../assets/images/home/placeholder-book.png');
const heroDims = Image.resolveAssetSource(heroVisual);

// ── Palette d'appoint (rappel des visuels verts) ────────────────────────────
const green = {
  ink: '#0F3D2A',    // titres sur fond clair
  mid: '#1E7A4E',    // accents / liens
  mint: '#F0F7F2',   // fond de la carte héro (proche du fond du visuel)
  soft: '#E7F2EB',   // fonds discrets
  border: '#DCE9E1', // bordures
};

const SUGGESTIONS = [
  { id: '1', name: 'Littérature Africaine', txt: 'Roman', image: placeholder },
  { id: '2', name: 'Mathématiques Bac S2', txt: 'Sciences', image: placeholder },
  { id: '3', name: 'Histoire du Congo', txt: 'Histoire', image: placeholder },
];

const TYPE_LABELS = { livre: 'Livre', concours: 'Concours', bac: 'Bac' };

const FILTERS = [
  { key: 'all', label: 'Tout' },
  { key: 'livre', label: 'Livres' },
  { key: 'concours', label: 'Concours' },
  { key: 'bac', label: 'Bac' },
];

const getGreeting = () => {
  const h = new Date().getHours();
  if (h >= 5 && h < 18) return 'Bonjour';
  if (h >= 18 && h < 23) return 'Bonsoir';
  return 'Bonne nuit';
};

export default function HomeScreen() {
  // Animations d'entrée décalées : en-tête/héro, puis contenu
  const introOpacity = useRef(new Animated.Value(0)).current;
  const introShift = useRef(new Animated.Value(18)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentShift = useRef(new Animated.Value(18)).current;

  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [errorDocs, setErrorDocs] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    let mounted = true;
    getDocuments()
      .then((data) => {
        if (!mounted) return;
        setDocuments((data || []).filter((doc) => doc.delete !== true));
      })
      .catch(() => mounted && setErrorDocs(true))
      .finally(() => mounted && setLoadingDocs(false));
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    Animated.stagger(140, [
      Animated.parallel([
        Animated.timing(introOpacity, { toValue: 1, duration: 650, useNativeDriver: true }),
        Animated.timing(introShift, { toValue: 0, duration: 650, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(contentOpacity, { toValue: 1, duration: 650, useNativeDriver: true }),
        Animated.timing(contentShift, { toValue: 0, duration: 650, useNativeDriver: true }),
      ]),
    ]).start();
  }, [introOpacity, introShift, contentOpacity, contentShift]);

  const base = errorDocs ? SUGGESTIONS : documents;
  const visible =
    !errorDocs && filter !== 'all' ? base.filter((doc) => doc.type === filter) : base;
  const preview = visible.slice(0, 8);
  const noResultForFilter =
    !errorDocs && filter !== 'all' && !loadingDocs && base.length > 0 && visible.length === 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* ── En-tête : salutation + notifications ── */}
      <Animated.View style={{ opacity: introOpacity, transform: [{ translateY: introShift }] }}>
        <View style={styles.topBar}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>{getGreeting()} 👋</Text>
            <Text style={styles.greetingSub}>Que lisez-vous aujourd'hui ?</Text>
          </View>
          <Pressable style={({ pressed }) => [styles.bell, pressed && styles.pressed]}>
            <Text style={styles.bellIcon}>🔔</Text>
          </Pressable>
        </View>

        {/* Recherche */}
        <Pressable
          style={({ pressed }) => [styles.search, pressed && styles.pressed]}
          onPress={() => router.push('/discovery')} // ⚠️ adaptez : route de votre écran de recherche
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Rechercher un livre, un auteur…</Text>
        </Pressable>
      </Animated.View>

      {/* ── Carte héro ── */}
      <Animated.View style={{ opacity: introOpacity, transform: [{ translateY: introShift }] }}>
        <View style={styles.hero}>
          <View style={styles.heroBody}>
            <Text style={styles.heroChip}>BIBLIOTHÈQUE NUMÉRIQUE</Text>
            <Text style={styles.heroTitle}>
              Toute la connaissance congolaise, à portée de main.
            </Text>
            <Pressable
              style={({ pressed }) => [styles.heroButton, pressed && styles.pressed]}
              onPress={() => router.push('/discovery')}
            >
              <Text style={styles.heroButtonText}>Explorer la bibliothèque</Text>
              <Text style={styles.heroButtonArrow}>→</Text>
            </Pressable>
          </View>
          <Image
            source={heroVisual}
            style={[
              styles.heroImage,
              {
                aspectRatio:
                  heroDims.width > 0 && heroDims.height > 0
                    ? heroDims.width / heroDims.height
                    : 1.5,
              },
            ]}
            resizeMode="cover"
          />
        </View>
      </Animated.View>

      {/* ── Filtres + bibliothèque ── */}
      <Animated.View style={{ opacity: contentOpacity, transform: [{ translateY: contentShift }] }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <Pressable
                key={f.key}
                onPress={() => setFilter(f.key)}
                style={({ pressed }) => [styles.chip, active && styles.chipActive, pressed && styles.pressed]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{f.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{errorDocs ? 'Suggestions' : 'Bibliothèque'}</Text>
          <Pressable onPress={() => router.push('/discovery')} hitSlop={8}>
            <Text style={styles.sectionLink}>Voir tout →</Text>
          </Pressable>
        </View>

        {loadingDocs ? (
          <ActivityIndicator color={colors.primaryDark} style={styles.docsLoader} />
        ) : preview.length === 0 ? (
          <Text style={styles.docsEmpty}>
            {noResultForFilter
              ? `Aucun titre dans « ${FILTERS.find((f) => f.key === filter)?.label} » pour l'instant.`
              : 'Aucun document disponible pour le moment. 📖'}
          </Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.docsBleed}
            contentContainerStyle={styles.row}
          >
            {preview.map((doc) => (
              <BookCard
                key={doc.id}
                id={doc.id}
                name={doc.nom}
                txt={TYPE_LABELS[doc.type] || doc.type}
                image={placeholder}
                size="large"
              />
            ))}
          </ScrollView>
        )}

        {errorDocs ? (
          <View style={styles.offlineBanner}>
            <Text style={styles.offlineText}>
              ⚠️ Mode hors ligne — reconnectez-vous pour rafraîchir le contenu.
            </Text>
          </View>
        ) : null}
      </Animated.View>

      <Text style={styles.footer}>Fait avec ❤️ pour la République du Congo</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },

  // En-tête
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    ...typography.title,
    fontSize: 24,
    lineHeight: 30,
  },
  greetingSub: {
    ...typography.body,
    marginTop: 2,
    color: colors.textSecondary,
  },
  bell: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: green.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  bellIcon: {
    fontSize: 16,
  },

  // Recherche
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: green.border,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 10,
  },
  searchPlaceholder: {
    ...typography.body,
    flex: 1,
    color: colors.textSecondary,
  },

  // Héro
  hero: {
    marginTop: 20,
    backgroundColor: green.mint,
    borderRadius: 28,
    overflow: 'hidden',
  },
  heroBody: {
    padding: 22,
    paddingBottom: 8,
  },
  heroChip: {
    alignSelf: 'flex-start',
    fontFamily: fonts.poppinsSemiBold,
    fontSize: 10,
    letterSpacing: 1.2,
    color: green.mid,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: green.border,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    overflow: 'hidden',
  },
  heroTitle: {
    marginTop: 14,
    fontFamily: fonts.poppinsSemiBold,
    fontSize: 23,
    lineHeight: 31,
    color: green.ink,
  },
  heroButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginTop: 16,
    marginBottom: 16,
  },
  heroButtonText: {
    fontFamily: fonts.poppinsSemiBold,
    fontSize: 13,
    color: colors.surface,
  },
  heroButtonArrow: {
    fontSize: 14,
    color: colors.surface,
    marginLeft: 8,
  },
  heroImage: {
    width: '100%',
  },

  // Filtres
  filters: {
    gap: 10,
    paddingTop: 22,
    paddingBottom: 4,
    paddingRight: 24,
  },
  chip: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: green.border,
  },
  chipActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  chipText: {
    fontSize: 13,
    color: colors.text,
  },
  chipTextActive: {
    fontFamily: fonts.poppinsSemiBold,
    color: colors.surface,
  },

  // Sections
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: fonts.poppinsSemiBold,
    fontSize: 18,
    color: colors.text,
  },
  sectionLink: {
    fontFamily: fonts.poppinsSemiBold,
    fontSize: 13,
    color: green.mid,
  },
  docsBleed: {
    marginRight: -24, // la liste défile jusqu'au bord droit de l'écran
  },
  row: {
    gap: 14,
    paddingRight: 24,
  },
  docsLoader: {
    marginVertical: 28,
  },
  docsEmpty: {
    ...typography.caption,
    textAlign: 'center',
    marginVertical: 28,
  },

  // Hors ligne / pied de page
  offlineBanner: {
    marginTop: 20,
    backgroundColor: green.soft,
    borderRadius: 14,
    padding: 12,
  },
  offlineText: {
    ...typography.caption,
    fontSize: 12,
    textAlign: 'center',
    color: green.ink,
  },
  footer: {
    ...typography.caption,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 32,
    color: colors.textSecondary,
  },
  pressed: {
    opacity: 0.75,
  },
});