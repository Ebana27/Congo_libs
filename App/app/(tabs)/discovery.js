import { View, Text, StyleSheet, ScrollView, Pressable, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { colors, fonts } from '../../src/constants/themes';
import DiscoveryCard from '../../src/components/discovery/DiscoveryCard';
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

const CATEGORIES = [
  { title: 'BAC', description: 'Fiches, annales et sujets corrigés', Icon: GraduationCap, bg: '#7CC96B' },
  { title: 'Université', description: 'Cours, mémoires et thèses', Icon: Landmark, bg: '#0B6B3A' },
  { title: 'Littérature congolaise', description: 'Romans, nouvelles, poèmes', Icon: Feather, bg: '#4FD1D9' },
  { title: 'Romans', description: 'Classiques et contemporains', Icon: BookOpen, bg: '#4CAF50' },
  { title: 'Revues et magazines', description: 'Culture, société, économie', Icon: Newspaper, bg: '#0B6B3A' },
  { title: 'Développement personnel', description: 'Compétences et motivation', Icon: Target, bg: '#45C4BC' },
];

export default function Decouverte() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {CATEGORIES.map((item) => (
          <DiscoveryCard
            key={item.title}
            title={item.title}
            description={item.description}
            Icon={item.Icon}
            bg={item.bg}
            onPress={() => router.push('/library')}
          />
        ))}

        {/* Concours & opportunités */}
        <Pressable style={({ pressed }) => [styles.opportunityCard, pressed && styles.pressed]} onPress={() => router.push('/library')}>
          <View style={styles.opportunityIcon}>
            <Star size={26} color={colors.primaryDark} fill={colors.primaryDark} />
          </View>

          <View style={styles.opportunityContent}>
            <Text style={styles.opportunityTitle}>Concours & opportunités</Text>
            <Text style={styles.opportunitySubtitle}>
              Bourses, concours, offres et appels à candidatures
            </Text>
          </View>

          <View style={styles.opportunityArrow}>
            <ArrowRight size={18} color={colors.surface} />
          </View>
        </Pressable>
      </ScrollView>
    </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    padding: 16,
    gap: 14,
    marginTop: 8,
  },
  opportunityIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  opportunityContent: {
    flex: 1,
  },
  opportunityTitle: {
    fontFamily: fonts.poppinsSemiBold,
    fontSize: 17,
    color: colors.primaryDark,
  },
  opportunitySubtitle: {
    fontFamily: fonts.inter,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  opportunityArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});