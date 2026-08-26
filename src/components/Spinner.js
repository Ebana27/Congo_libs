import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';

export default function Spinner() {
  // Création des 3 valeurs d'animation pour les cercles
  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;
  const anim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fonction pour créer l'effet de va-et-vient sur un cercle
    const createWave = (anim, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: -15, // Monte de 15 pixels
            duration: 400,
            useNativeDriver: true, // Ultra léger et fluide
          }),
          Animated.timing(anim, {
            toValue: 0, // Redescend
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
    };

    // Lancement des 3 animations avec un décalage de temps (delay)
    const wave1 = createWave(anim1, 0);
    const wave2 = createWave(anim2, 150);
    const wave3 = createWave(anim3, 300);

    wave1.start();
    wave2.start();
    wave3.start();

    // Nettoyage à la destruction du composant
    return () => {
      wave1.stop();
      wave2.stop();
      wave3.stop();
    };
  }, [anim1, anim2, anim3]);

  return (
    <View style={styles.container}>
      {/* Cercle 1 - Vert */}
      <Animated.View style={[styles.dot, { backgroundColor: '#008751', transform: [{ translateY: anim1 }] }]} />
      {/* Cercle 2 - Jaune */}
      <Animated.View style={[styles.dot, { backgroundColor: '#FFD100', transform: [{ translateY: anim2 }] }]} />
      {/* Cercle 3 - Rouge */}
      <Animated.View style={[styles.dot, { backgroundColor: '#DC241F', transform: [{ translateY: anim3 }] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginHorizontal: 6,
  },
});
