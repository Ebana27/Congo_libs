import { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  ActivityIndicator,
  Pressable,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { colors, typography, fonts } from '../../src/constants/themes';
import { router } from 'expo-router';
import { Search } from 'lucide-react-native';
import BookCard from '../../src/components/books/BookCard';
import { getDocuments } from '../../src/services/api/congolibsAPI';

const placeholder = require('../../assets/images/home/placeholder-book.png');

const SUGGESTIONS = [
  { id: '1', nom: 'Littérature Africaine', type: 'livre' },
  { id: '2', nom: 'Mathématiques Bac S2', type: 'bac' },
  { id: '3', nom: 'Histoire du Congo', type: 'concours' },
];

const MOMENTS = [
  { from: 0, to: 5, greeting: 'Bonne nuit', flavor: 'soir' },
  { from: 5, to: 9, greeting: 'Bonjour', flavor: 'jour' },
  { from: 9, to: 12, greeting: 'Bonjour', flavor: 'jour' },
  { from: 12, to: 14, greeting: 'Bon après-midi', flavor: 'jour' },
  { from: 14, to: 18, greeting: 'Bon après-midi', flavor: 'jour' },
  { from: 18, to: 22, greeting: 'Bonsoir', flavor: 'soir' },
  { from: 22, to: 24, greeting: 'Bonne nuit', flavor: 'soir' },
];

const PERIODS = [
  {
    id: 'rentree',
    months: [9],
    jour: [
      "C'est la rentrée, on repart tranquillement.",
      'Les nouveautés de septembre sont en ligne.',
    ],
    soir: [
      "Septembre s'installe, la bibliothèque suit.",
      'Rentrée faite, on souffle un peu.',
    ],
  },
  {
    id: 'cours',
    months: [10, 1, 2],
    jour: [
      'Les cours avancent, une petite pause fait du bien.',
      'Un document de temps en temps, ça suffit.',
      'Profitez-en pour compléter une collection.',
    ],
    soir: [
      "La journée a été longue ? Cinq minutes de lecture.",
      "Un peu de lecture avant de dormir, si l'envie est là.",
    ],
  },
  {
    id: 'finAnnee',
    months: [11],
    jour: [
      "On approche de la fin d'année, tout est à jour.",
           'Les dernières fiches de décembre sont là.',
    ],
    soir: [
      "Dernière ligne droite avant les vacances.",
      'Les vacances arrivent, la bibliothèque reste ouverte.',
    ],
  },
  {
    id: 'reprise',
    months: [0],
    jour: [
      'Nouvelle année, nouveau départ.',
      'Les collections ont été mises à jour.',
    ],
    soir: [
      'Janvier commence, on prend le temps.',
      'On repart doucement, sans se presser.',
    ],
  },
  {
    id: 'revisions',
    months: [3],
    jour: [
      'Avril, les documents sont bien rangés.',
      "C'est le moment de remettre de l'ordre.",
    ],
    soir: [
      'Un mois calme pour relire tranquillement.',
      'Quelques fiches bien choisies et c’est l’affaire.',
    ],
  },
  {
    id: 'exams',
    months: [4, 5],
    jour: [
      'Mai, les collections sont complètes.',
      'Juin approche, tout est bien rangé.',
    ],
    soir: [
      'Le soir, un peu de calme aide bien.',
      'Dernier moment pour relire ce qui compte.',
    ],
  },
  {
    id: 'vacances',
    months: [6, 7, 8],
    jour: [
      'Vacances : on lit ce qui nous fait envie.',
      'Pas de programme, on choisit.',
    ],
    soir: [
      'Vacances, lectures tranquilles.',
      'On lit sans se presser.',
    ],
  },
];

const getGreeting = (date = new Date()) => {
  const hour = date.getHours();
  const moment = MOMENTS.find((item) => hour >= item.from && hour < item.to) || MOMENTS[0];
  const month = date.getMonth();
  const period = PERIODS.find((item) => item.months.includes(month)) || PERIODS[1];
  const messages = period[moment.flavor];
  return {
    greeting: moment.greeting,
    message: messages[date.getDate() % messages.length],
  };
};

export default function HomeScreen() {
  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [errorDocs, setErrorDocs] = useState(false);
  const [search, setSearch] = useState('');
  const searchInputRef = useRef(null);

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

  const base = errorDocs ? SUGGESTIONS : documents;
  const nouveautes = base.slice(0, 6);
  const meilleuresListes = [...base].slice(0, 6).reverse();

  const { greeting, message } = getGreeting();

  const submitSearch = () => {
    const q = search.trim();
    if (!q) return;
    setSearch('');
    router.push({ pathname: '/search', params: { q } });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Salutation */}
      <View style={styles.topBar}>
        <Text style={styles.greeting}>{greeting}</Text>
        <Text style={styles.greetingSub}>{message}</Text>
      </View>

      {/* Barre de recherche */}
      <Pressable style={styles.searchBar} onPress={() => searchInputRef.current?.focus()}>
        <Search size={18} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          ref={searchInputRef}
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={submitSearch}
          returnKeyType="search"
          placeholder="Rechercher un livre"
          placeholderTextColor={colors.textSecondary}
          style={styles.searchInput}
        />
      </Pressable>

      {/* Nouveautés */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Nouveautés</Text>
        <TouchableOpacity>
          <Text style={styles.sectionLink}>Voir tout</Text>
        </TouchableOpacity>
      </View>

      {loadingDocs ? (
        <ActivityIndicator color={colors.primaryDark} style={styles.docsLoader} />
      ) : nouveautes.length === 0 ? (
        <Text style={styles.docsEmpty}>Aucun document disponible pour le moment.</Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        >
          {nouveautes.map((doc) => (
            <BookCard
              key={doc.id}
              id={doc.id}
              name={doc.nom}
              image={placeholder}
              size="medium"
            />
          ))}
        </ScrollView>
      )}

      {/* Meilleures listes de livres */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Meilleures listes de livres</Text>
        <TouchableOpacity>
          <Text style={styles.sectionLink}>Voir tout</Text>
        </TouchableOpacity>
      </View>

      {!loadingDocs && meilleuresListes.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        >
          {meilleuresListes.map((doc) => (
            <BookCard
              key={`liste-${doc.id}`}
              id={doc.id}
              name={doc.nom}
              image={placeholder}
              size="medium"
            />
          ))}
        </ScrollView>
      )}

      {/* Bibliothèque complète */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {errorDocs ? 'Suggestions' : 'Bibliothèque'}
        </Text>
      </View>

      {loadingDocs ? (
        <ActivityIndicator color={colors.primaryDark} style={styles.docsLoader} />
      ) : base.length === 0 ? (
        <Text style={styles.docsEmpty}>Aucun document disponible pour le moment.</Text>
      ) : (
        <View style={styles.gridList}>
          {base.map((doc) => (
            <View key={doc.id} style={styles.gridCell}>
              <BookCard
                id={doc.id}
                name={doc.nom}
                image={placeholder}
                size="grid"
              />
            </View>
          ))}
        </View>
      )}
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
  topBar: {
    marginBottom: 20,
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    fontSize: 15,
    padding: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontFamily: fonts.poppinsSemiBold,
    fontSize: 18,
    color: colors.text,
  },
  sectionLink: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  horizontalList: {
    gap: 16,
    paddingBottom: 8,
    marginBottom: 8,
  },
  gridList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 18,
  },
  gridCell: {
    width: '48%',
  },
  docsLoader: {
    marginVertical: 28,
  },
  docsEmpty: {
    ...typography.caption,
    textAlign: 'center',
    marginVertical: 28,
  },
});