import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { AppHeader } from '../../src/components/Header.js';
import { COLOR } from '../../src/constants/themes.js';

// Données fictives pour tes livres / manuels scolaires
const EN_COURS = [
  { id: '1', titre: 'Mathématiques Terminale C', progression: '45%', image: 'https://unsplash.com' },
  { id: '2', titre: 'Histoire du Congo - BAC', progression: '12%', image: 'https://unsplash.com' },
];

const POPULAIRES = [
  { id: '3', titre: 'Physique-Chimie 1ère', auteur: 'CongoLibs', image: 'https://unsplash.com' },
  { id: '4', titre: 'Philosophie Terminale', auteur: 'Annales', image: 'https://unsplash.com' },
  { id: '5', titre: 'SVT BEPC 2026', auteur: 'Éducation', image: 'https://unsplash.com' },
];

export default function Accueil() {
  return (
    <SafeAreaView style={styles.container}>
      {/* On garde ton en-tête personnalisé intact */}
      <AppHeader title="CONGOLIBS" />
      
      {/* ScrollView vertical principal pour toute la page */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* SECTION 1 : Titre principal style Apple */}
        <View style={styles.appleHero}>
          <Text style={styles.heroTitle}>Plus récents</Text>
        </View>

        {/* SECTION 2 : En cours de lecture (Défilement Horizontal) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
          {EN_COURS.map((livre) => (
            <Pressable key={livre.id} style={styles.currentBookCard}>
              <Image source={{ uri: livre.image }} style={styles.currentBookImage} />
              <View style={styles.currentBookInfo}>
                <Text style={styles.bookTitle} numberOfLines={2}>{livre.titre}</Text>
                <Text style={styles.bookProgression}>Terminé à {livre.progression}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* SECTION 3 : Titre de section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tendances actuelles</Text>
          <Pressable><Text style={styles.seeAll}>Tout voir</Text></Pressable>
        </View>

        {/* SECTION 4 : Livres populaires (Grille horizontale de couvertures) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
          {POPULAIRES.map((livre) => (
            <Pressable key={livre.id} style={styles.popularBookCard}>
              <View style={styles.imageShadowContainer}>
                <Image source={{ uri: livre.image }} style={styles.popularBookImage} />
              </View>
              <Text style={styles.popularBookTitle} numberOfLines={1}>{livre.titre}</Text>
              <Text style={styles.popularBookAuthor}>{livre.auteur}</Text>
            </Pressable>
          ))}
        </ScrollView>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  appleHero: {
    paddingHorizontal: 16,
    marginTop: 15,
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLOR.neutral || '#111827',
  },
  horizontalScroll: {
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 10,
  },
  currentBookCard: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 12,
    marginRight: 16,
    width: 280,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  currentBookImage: {
    width: 60,
    height: 85,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
  },
  currentBookInfo: {
    flex: 1,
    marginLeft: 12,
  },
  bookTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  bookProgression: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 16,
    marginTop: 30,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  seeAll: {
    fontSize: 14,
    color: COLOR.primary || '#1E40AF',
    fontWeight: '600',
  },
  popularBookCard: {
    width: 110,
    marginRight: 16,
  },
  imageShadowContainer: {
    width: 110,
    height: 160,
    borderRadius: 8,
    backgroundColor: '#fff',
    // Ombres style Apple Books (très douces mais marquées)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 8,
  },
  popularBookImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  popularBookTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  popularBookAuthor: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
});
 