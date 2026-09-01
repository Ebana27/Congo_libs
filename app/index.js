import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Pressable, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Remplacer ces URLs par vos require() locaux si vos images sont dans assets/
const LIVRES_A_LA_UNE = [
  { id: '1', titre: 'Petit pays', auteur: 'Gaël Faye', image: 'https://unsplash.com' },
  { id: '2', titre: 'Le pleurer-rire', auteur: 'Alain Mabanckou', image: 'https://unsplash.com' },
  { id: '3', titre: 'Histoire du Congo', auteur: 'Des origines à nos jours', image: 'https://unsplash.com' },
];

export default function Accueil() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* --- SECTION 1 : PROFILE HEADER --- */}
        <View style={styles.profileHeader}>
          <View>
            <Text style={styles.greetingText}>Bonjour, Jonathan</Text>
          </View>
          <View style={styles.headerRight}>
            <Pressable style={styles.notificationBadge}>
              <Ionicons name="notifications-outline" size={24} color="#003625" />
              <View style={styles.badgeDot} />
            </Pressable>
            <Image 
              source={{ uri: 'https://unsplash.com' }} 
              style={styles.avatar} 
            />
          </View>
        </View>

        {/* --- SECTION 2 : HERO HERO BANNER --- */}
        <View style={styles.heroSection}>
          <Text style={styles.heroMainTitle}>À la une</Text>
          <Text style={styles.heroSubtitle}>Débloque ton potentiel</Text>
          
          <ImageBackground 
            source={{ uri: 'https://unsplash.com' }} // Image technologique / abstraite verte
            style={styles.heroBanner}
            imageStyle={{ borderRadius: 20 }}
          >
            <View style={styles.heroOverlay}>
              <Pressable style={styles.discoverButton}>
                <Text style={styles.discoverButtonText}>Découvrir</Text>
              </Pressable>
            </View>
          </ImageBackground>
        </View>

        {/* --- SECTION 3 : LIVRES À LA UNE (Horizontal) --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Livres à la une</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
          {LIVRES_A_LA_UNE.map((livre) => (
            <Pressable key={livre.id} style={styles.bookCardHorizontal}>
              <View style={styles.imageShadowContainer}>
                <Image source={{ uri: livre.image }} style={styles.bookCover} />
              </View>
              <Text style={styles.bookTitleText} numberOfLines={1}>{livre.titre}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* --- SECTION 4 : LIVRES TÉLÉCHARGÉS (Vertical List) --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Livres téléchargés</Text>
        </View>

        <View style={styles.downloadedContainer}>
          {LIVRES_A_LA_UNE.map((livre) => (
            <View key={livre.id} style={styles.downloadedRow}>
              <View style={styles.downloadedLeft}>
                <Image source={{ uri: livre.image }} style={styles.miniCover} />
                <Text style={styles.downloadedTitle} numberOfLines={1}>{livre.titre}</Text>
              </View>
              <Pressable style={styles.openButton}>
                <Text style={styles.openButtonText}>Ouvrir</Text>
                <Ionicons name="chevron-forward" size={16} color="#006A4E" />
              </Pressable>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  notificationBadge: {
    position: 'relative',
    padding: 4,
  },
  badgeDot: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30', // Point rouge de notification
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E2E8F0',
  },
  heroSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  heroMainTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#000000',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#718096',
    marginTop: 2,
    marginBottom: 15,
  },
  heroBanner: {
    width: '100%',
    height: 180,
    overflow: 'hidden',
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 54, 37, 0.15)', // Filtre vert translucide discret
    justifyContent: 'flex-end',
    padding: 20,
  },
  discoverButton: {
    backgroundColor: '#004D34',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  discoverButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  horizontalScroll: {
    paddingLeft: 20,
    paddingRight: 5,
  },
  bookCardHorizontal: {
    width: 115,
    marginRight: 16,
    alignItems: 'center',
  },
  imageShadowContainer: {
    width: 115,
    height: 165,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  bookCover: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  bookTitleText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#2D3748',
    textAlign: 'center',
    width: '100%',
  },
  downloadedContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  downloadedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  downloadedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  miniCover: {
    width: 36,
    height: 48,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
  },
  downloadedTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A202C',
    flex: 1,
  },
  openButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  openButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#006A4E',
  },
});
 