import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, SearchX, Sparkles } from 'lucide-react-native';
import { colors, fonts, typography } from '../src/constants/themes';
import BookCard from '../src/components/books/BookCard';
import ErrorModal from '../src/components/shared/ErrorModal';
import { getDocuments } from '../src/services/api/congolibsAPI';

const placeholder = require('../assets/images/home/placeholder-book.png');

const TYPES = [
  { id: '', label: 'Tous' },
  { id: 'livre', label: 'Livres' },
  { id: 'concours', label: 'Concours' },
  { id: 'bac', label: 'BAC' },
];

const asText = (value) => (Array.isArray(value) ? value[0] : value);

export default function SearchScreen() {
  const params = useLocalSearchParams();
  const initialQuery = asText(params.q) || '';
  const initialType = asText(params.type) || '';

  const [input, setInput] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState(initialType);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiVisible, setAiVisible] = useState(false);

  const runSearch = useCallback(async (term, wantedType) => {
    const value = String(term || '').trim();
    setLoading(true);
    setError(null);
    try {
      const queryParams = { q: value };
      if (wantedType) queryParams.type = wantedType;
      const data = await getDocuments(queryParams);
      setResults(Array.isArray(data) ? data : []);
    } catch (e) {
      setResults([]);
      setError(e.message || 'Recherche impossible pour le moment.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Recherche initiale (arrivée depuis l'Accueil ou la Découverte) + à chaque
  // changement de filtre. Le texte tapé n'est pris qu'à la validation.
  useEffect(() => {
    runSearch(query, type);
  }, [runSearch, query, type]);

  const submit = () => {
    const value = input.trim();
    setInput('');
    setQuery(value);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />

      <View style={styles.topBar}>
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)/library'))}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Retour"
        >
          <ArrowLeft size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.topTitle} numberOfLines={1}>
          Recherche
        </Text>
        <View style={styles.backButton} />
      </View>

      {/* Barre de recherche + option recherche IA */}
      <View style={styles.searchRow}>
        <View style={styles.searchField}>
          <TextInput
            style={styles.input}
            placeholder="Rechercher un cours, une annale..."
            placeholderTextColor={colors.textSecondary}
            value={input}
            onChangeText={setInput}
            autoFocus={!initialQuery}
            returnKeyType="search"
            onSubmitEditing={submit}
          />
        </View>

        <Pressable
          style={({ pressed }) => [styles.aiButton, pressed && styles.pressed]}
          onPress={() => setAiVisible(true)}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel="Recherche IA, bientôt disponible"
        >
          <Sparkles size={19} color={colors.primaryDark} />
        </Pressable>
      </View>

      {/* Filtres par type */}
      <View style={styles.filtersWrapper}>
        <View style={styles.filters}>
          {TYPES.map((item) => {
            const active = type === item.id;
            return (
              <Pressable
                key={item.id || 'all'}
                onPress={() => setType(item.id)}
                style={({ pressed }) => [
                  styles.chip,
                  active && styles.chipActive,
                  pressed && !active && styles.pressed,
                ]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {loading ? (
        <View style={styles.state}>
          <ActivityIndicator color={colors.primaryDark} size="large" />
          <Text style={styles.stateText}>Recherche en cours...</Text>
        </View>
      ) : error ? (
        <View style={styles.state}>
          <SearchX size={38} color={colors.border} />
          <Text style={styles.stateTitle}>Recherche indisponible</Text>
          <Text style={styles.stateText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, index) => item?.id || String(index)}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <Text style={styles.count}>
              {results.length} résultat{results.length > 1 ? 's' : ''}
              {query ? ` pour « ${query} »` : ''}
            </Text>
          }
          renderItem={({ item }) => (
            <BookCard id={item.id} name={item.nom} image={placeholder} size="large" />
          )}
          ListEmptyComponent={
            <View style={styles.state}>
              <SearchX size={38} color={colors.border} />
              <Text style={styles.stateTitle}>Aucun résultat</Text>
              <Text style={styles.stateText}>
                Essaie un autre mot-clé ou change de filtre.
              </Text>
            </View>
          }
        />
      )}

      <ErrorModal
        visible={aiVisible}
        title="Bientôt disponible"
        message="La recherche IA n'est pas encore disponible sur Congolibs. Utilisez la recherche classique pour le moment."
        buttonText="J'ai compris"
        onClose={() => setAiVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 12,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
  },
  topTitle: {
    ...typography.subtitle,
    fontSize: 18,
    flexShrink: 1,
  },

  // Recherche
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
  },
  searchField: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
  },
  input: {
    ...typography.body,
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 11,
    color: colors.text,
  },
  aiButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primaryDark,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Filtres
  filtersWrapper: {
    marginTop: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  chipActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  chipText: {
    fontFamily: fonts.poppinsMedium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  chipTextActive: {
    fontFamily: fonts.poppinsSemiBold,
    color: colors.surface,
  },

  // Résultats
  count: {
    ...typography.caption,
    fontSize: 12,
    marginBottom: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  state: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
    gap: 8,
  },
  stateTitle: {
    ...typography.subtitle,
    fontSize: 16,
  },
  stateText: {
    ...typography.caption,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
