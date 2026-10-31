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

const placeholder = require('../../assets/images/home/placeholder-book.png');

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
  const params = useLocalSearchParams();
  const filter = params.filter;

  const [activeFilter, setActiveFilter] = useState(filter ?? 'Tous');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (filter) setActiveFilter(filter);
  }, [filter]);

  const filteredBooks = useMemo(() => {
    const term = search.trim().toLowerCase();
    return BOOKS.filter((book) => {
      const matchFilter =
        activeFilter === 'Tous' || book.category === activeFilter;
      const matchSearch =
        term.length === 0 ||
        [book.name, book.txt, book.category].some((value) =>
          String(value || '')
            .toLowerCase()
            .includes(term)
        );
      return matchFilter && matchSearch;
    });
  }, [activeFilter, search]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />

      <TextInput
        style={styles.input}
        placeholder="Rechercher dans vos documents..."
        placeholderTextColor={colors.textSecondary}
        value={search}
        onChangeText={setSearch}
        returnKeyType="search"
        onSubmitEditing={() => setSearch('')}
      />

      {/* Conteneur des onglets revu */}
      <View style={styles.filtersWrapper}>
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
      </View>

      <FlatList
        style={styles.list}
        data={filteredBooks}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <BookCard
            id={item.id}
            name={item.name}
            image={placeholder}
            size="large"
          />
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
    backgroundColor: colors.surface,
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  input: {
    ...typography.body,
    fontSize: 15,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    color: colors.text,
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  filtersWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 16,
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  listContent: {
    paddingBottom: 24,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
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