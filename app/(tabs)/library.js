import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet } from 'react-native';
import { AppHeader } from '../../src/components/Header.js';

export default function Library() {
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="PROFIL" />
      <View style={styles.content}>
        <Text style={styles.title}>Page Profil</Text>
        <Text style={styles.subtitle}>Tu peux mettre ici les infos utilisateur plus tard.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
  },
});
