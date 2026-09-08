import { useRef, useEffect } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors, typography } from '../../src/constants/themes';

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

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[styles.title, { opacity, transform: [{ translateY }] }]}
      >
        Congolibs
      </Animated.Text>
      <Animated.Text
        style={[styles.subtitle, { opacity, transform: [{ translateY }] }]}
      >
        Toute la connaissance, à portée de main.
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    ...typography.title,
    fontSize: 30,
  },
  subtitle: {
    ...typography.body,
    textAlign: 'center',
    marginTop: 8,
  },
});
