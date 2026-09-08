import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, fonts } from '../../src/constants/themes';
import DiscoveryCard from '../../src/components/DiscoveryCard';
import { Star, Book, BookOpen, Heart, BadgeCheck, TrendingUp } from 'lucide-react-native';

export default function Decouverte() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={true}>
      <View style={styles.cards}>
        <DiscoveryCard title="BAC" Description="Fiches, annales et sujets corrigés" Icon={<Star />} bg="#ead" />
        <DiscoveryCard title="Université" Description="Cours, mémoires et thèses" Icon={<Book />} bg="#aaaeee" />
        <DiscoveryCard title="Littérature Congolaise" Description="Romans, nouvelles, poèmes" Icon={<BookOpen />} bg="#ccc" />
        <DiscoveryCard title="Romans" Description="Classiques et contemporains" Icon={<Heart />} bg="#bbb021" />
        <DiscoveryCard title="Revues et magazines" Description="Culture, société, économie" Icon={<BadgeCheck />} bg="#aa999e" />
        <DiscoveryCard title="Développement Personnel" Description="Compétences et motivation" Icon={<TrendingUp />} bg="#dd3459" />
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Concours & Opportunités</Text>
        <Text style={styles.cardSubtitle}>Bourses, concours, offres et appels à candidatures</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  cards: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.border,
  },
  cardTitle: {
    fontFamily: fonts.poppinsSemiBold,
    fontSize: 18,
    color: colors.text,
  },
  cardSubtitle: {
    fontFamily: fonts.inter,
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
