import { View, Text, StatusBar, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from 'expo-router';
import Spinner from "../src/components/Spinner";

export default function Accueil() {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Configuration de la barre de statut (optionnel mais recommandé) */}
      <StatusBar barStyle="dark-content" /> 
      
      <View style={styles.container}>
        <Text style={styles.title}>CONGOLIBS</Text>
        <Text style={styles.subtitle}>Bienvenue sur Congolibs</Text>
        <Spinner />

      <Link href="/(tabs)" style={{ color: 'blue', marginTop: 20 }}>
        Commencer
      </Link>
      </View>

    </SafeAreaView>
  );
}

// Déclaration de l'objet styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1, // Permet à la SafeAreaView d'occuper tout l'écran
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',     
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
});
