import { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { BookOpen } from 'lucide-react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors, typography } from '../../src/constants/themes';
import Filter from '../../src/components/books/Filter';
import BookCard from '../../src/components/books/BookCard';

const FILTERS = ['Tous', 'Favoris', 'Téléchargés', 'Récents'];

const BOOKS = [
  { id: '1', name: 'Mathématiques BAC 2024', txt: 'Par Jean Kalala', category: 'Favoris' },
  { id: '2', name: 'Physique-Chimie BAC', txt: 'Par Neocodex', category: 'Téléchargés' },
  { id: '3', name: 'Histoire-Géo BEPC', txt: 'Par Plamedi Ebana', category: 'Favoris' },
  { id: '4', name: 'Anglais facile', txt: 'Par Neocodex', category: 'Récents' },
  { id: '5', name: 'SVT Terminale', txt: 'Par Jean Kalala', category: 'Téléchargés' },
  { id: '6', name: 'Français expression', txt: 'Par Neocodex', category: 'Récents' },
];

export default function LibraryScreen() {
  const { filter } = useLocalSearchParams(); // ex: { filter: 'Favoris' } depuis le profil
  const [activeFilter, setActiveFilter] = useState(filter ?? 'Tous');
  const [search, setSearch] = useState('');

  // Si l'utilisateur revient sur l'onglet avec un autre filtre
  useEffect(() => {
    if (filter) setActiveFilter(filter);
  }, [filter]);

  const filteredBooks = useMemo(() => {
    return BOOKS.filter((book) => {
      const matchFilter =
        activeFilter === 'Tous' || book.category === activeFilter;
      const matchSearch = book.name
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [activeFilter, search]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />
      {/* Identique à la découverte */}
      <TextInput
        style={styles.input}
        placeholder="Rechercher dans vos documents téléchargés"
        placeholderTextColor={colors.textSecondary}
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.filters}>
        {FILTERS.map((name) => (
          <Filter
            key={name}
            name={name}
            active={activeFilter === name}
            onPress={() => setActiveFilter(name)}
          />
        ))}
      </View>

      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <BookCard id={item.id} name={item.name} txt={item.txt} size="large" />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <BookOpen size={40} color={colors.border} />
            <Text style={styles.emptyTitle}>Aucun document ici</Text>
            <Text style={styles.emptyText}>
              Tes téléchargements et favoris apparaîtront dans cette catégorie.
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface, // blanc, comme la découverte
    paddingTop: 12,
    paddingHorizontal: 16,
  },

  // Identiques à la découverte
  input: {
    ...typography.body,
    fontSize: 14,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12,
    color: colors.text,
    marginBottom: 12,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 12,
  },
  listContent: {
    paddingBottom: 24,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  // État vide
  empty: {
    alignItems: 'center',
    marginTop: 70,
    paddingHorizontal: 40,
    gap: 6,
  },
  emptyTitle: {
    ...typography.subtitle,
    fontSize: 16,
  },
  emptyText: {
    ...typography.caption,
    textAlign: 'center',
  },
});