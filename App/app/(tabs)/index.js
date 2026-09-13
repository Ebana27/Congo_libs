import { useRef, useEffect, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View, StatusBar, ActivityIndicator } from 'react-native';
import { colors, typography, fonts } from '../../src/constants/themes';
import BookCard from '../../src/components/books/BookCard';
import { getDocuments } from '../../src/services/api/congolibsAPI';

const placeholder = require('../../assets/images/home/placeholder-book.png');

const POPULAR_BOOKS = [
  { id: '1', name: 'Littérature Africaine', txt: 'Roman', image: placeholder },
  { id: '2', name: 'Mathématiques Bac S2', txt: 'Sciences', image: placeholder },
  { id: '3', name: 'Histoire du Congo', txt: 'Histoire', image: placeholder },
  { id: '4', name: 'Physique Terminale', txt: 'Sciences', image: placeholder },
  { id: '5', name: 'Guide de la Dissertation', txt: 'Français', image: placeholder },
];

const TYPE_LABELS = { livre: 'Livre', concours: 'Concours', bac: 'Bac' };

export default function HomeScreen() {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [errorDocs, setErrorDocs] = useState(false);

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
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  let heure = new Date().toLocaleTimeString();
  let message = "Bonjour";

  if (heure >= "18:00" && heure < "23:00") {
    message = "Bonsoir";
  } else if (heure >= "23:00" && heure < "06:00") {
    message = "Bonne nuit";
  }


  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />
      <Animated.View style={{ opacity, transform: [{ translateY }] }}>
        <Text style={styles.title}>{message}</Text>
        {/* <Text style={styles.subtitle}>Toute la connaissance, à portée de main.</Text>*/}

        <Text style={styles.sectionTitle}>Livres populaires</Text>
      </Animated.View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {POPULAR_BOOKS.map((book) => (
          <BookCard
            key={book.id}
            id={book.id}
            name={book.name}
            txt={book.txt}
            image={book.image}
            size="large"
          />
        ))}
      </ScrollView>
      <View>
        <Text style={styles.sectionTitle}>Documents les plus connus</Text>
        {loadingDocs ? (
          <ActivityIndicator color={colors.primaryDark} style={styles.docsLoader} />
        ) : errorDocs ? (
          <Text style={styles.docsEmpty}>Impossible de charger les documents.</Text>
        ) : documents.length === 0 ? (
          <Text style={styles.docsEmpty}>Aucun document disponible pour le moment.</Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.row}
          >
            {documents.slice(0, 8).map((doc) => (
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
      </View>
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
  },
  title: {
    ...typography.title,
    fontSize: 30,
  },
  subtitle: {
    ...typography.body,
    marginTop: 8,
    color: colors.text,
  },
  sectionTitle: {
    fontFamily: fonts.poppinsSemiBold,
    fontSize: 18,
    color: colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
  row: {
    paddingRight: 12,
  },
  docsLoader: {
    marginVertical: 24,
  },
  docsEmpty: {
    ...typography.caption,
    textAlign: 'center',
    marginVertical: 24,
  },
});
