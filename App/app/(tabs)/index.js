import { useRef, useEffect } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View, StatusBar } from 'react-native';
import { colors, typography, fonts } from '../../src/constants/themes';
import BookCard from '../../src/components/books/BookCard';

const placeholder = require('../../assets/images/home/placeholder-book.png');

const POPULAR_BOOKS = [
  { id: '1', name: 'Littérature Africaine', txt: 'Roman', image: placeholder },
  { id: '2', name: 'Mathématiques Bac S2', txt: 'Sciences', image: placeholder },
  { id: '3', name: 'Histoire du Congo', txt: 'Histoire', image: placeholder },
  { id: '4', name: 'Physique Terminale', txt: 'Sciences', image: placeholder },
  { id: '5', name: 'Guide de la Dissertation', txt: 'Français', image: placeholder },
];

export default function HomeScreen() {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

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
});
