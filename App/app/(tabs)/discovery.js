import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, StatusBar, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { colors, fonts } from '../../src/constants/themes';
import DiscoveryCard from '../../src/components/discovery/DiscoveryCard';
import ErrorModal from '../../src/components/shared/ErrorModal';
import {
  GraduationCap,
  Landmark,
  Feather,
  BookOpen,
  Newspaper,
  Target,
  Star,
  ArrowRight,
} from 'lucide-react-native';

const opportunityImage = require('../../assets/images/home/placeholder-book.png');

const CATEGORIES = [
  { title: 'BAC', description: 'Fiches, annales et sujets corrigés', Icon: GraduationCap, bg: '#7CC96B', type: 'bac' },
  { title: 'Université', description: 'Cours, mémoires et thèses', Icon: Landmark, bg: '#0B6B3A', type: 'livre' },
  { title: 'Littérature congolaise', description: 'Romans, nouvelles, poèmes', Icon: Feather, bg: '#4FD1D9', type: 'livre' },
  { title: 'Romans', description: 'Classiques et contemporains', Icon: BookOpen, bg: '#4CAF50', type: 'livre' },
  { title: 'Revues et magazines', description: 'Culture, société, économie', Icon: Newspaper, bg: '#0B6B3A', type: 'livre' },
  { title: 'Développement personnel', description: 'Compétences et motivation', Icon: Target, bg: '#45C4BC', type: 'livre' },
];

export default function Decouverte() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {/* Concours & opportunités : mis en avant, pas encore disponible */}
        <ConcoursCard />

        {CATEGORIES.map((item) => (
          <DiscoveryCard
            key={item.title}
            title={item.title}
            description={item.description}
            Icon={item.Icon}
            bg={item.bg}
            onPress={() =>
              router.push({
                pathname: '/search',
                params: { q: item.title, type: item.type },
              })
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}

function ConcoursCard() {
  const [soonVisible, setSoonVisible] = useState(false);

  return (
    <Pressable
      style={({ pressed }) => [styles.opportunityCard, pressed && styles.pressed]}
      onPress={() => setSoonVisible(true)}
      accessibilityRole="button"
      accessibilityLabel="Concours et opportunités, bientôt disponible"
    >
      <ImageBackground source={opportunityImage} style={styles.opportunityImage} blurRadius={1}>
        <LinearGradient
          colors={['rgba(11,122,69,0.55)', 'rgba(6,10,13,0.88)']}
          locations={[0, 1]}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.opportunityOverlay}>
          <View style={styles.opportunityTop}>
            <View style={styles.opportunityIcon}>
              <Star size={20} color={colors.primaryDark} fill={colors.primaryDark} />
            </View>
            <View style={styles.opportunitySoon}>
              <Text style={styles.opportunitySoonText}>Bientôt disponible</Text>
            </View>
          </View>

          <Text style={styles.opportunityTitle}>Concours & opportunités</Text>
          <Text style={styles.opportunitySubtitle}>
            Bourses, concours, offres et appels à candidatures
          </Text>
        </View>

        <View style={styles.opportunityArrow}>
          <ArrowRight size={18} color={colors.primaryDark} />
        </View>
      </ImageBackground>

      <ErrorModal
        visible={soonVisible}
        title="Bientôt disponible"
        message="Les concours et opportunités ne sont pas encore ouverts sur Congolibs. Revenez bientôt !"
        onClose={() => setSoonVisible(false)}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
    gap: 12,
  },
  opportunityCard: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 6,
  },
  opportunityImage: {
    height: 150,
    justifyContent: 'center',
  },
  opportunityOverlay: {
    padding: 18,
    gap: 4,
  },
  opportunityTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  opportunityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  opportunitySoon: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  opportunitySoonText: {
    fontFamily: fonts.poppinsSemiBold,
    fontSize: 11,
    color: colors.surface,
    letterSpacing: 0.3,
  },
  opportunityTitle: {
    fontFamily: fonts.poppinsSemiBold,
    fontSize: 18,
    color: colors.surface,
  },
  opportunitySubtitle: {
    fontFamily: fonts.inter,
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  opportunityArrow: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});