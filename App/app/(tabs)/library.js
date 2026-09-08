import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, typography } from '../../src/constants/themes';
// import Card from '../../src/components/Card'
import Filter from '../../src/components/Filter';

export default function LibraryScreen() {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Rechercher dans vos documents télécharger"
        placeholderTextColor={colors.textSecondary}
      />

      {/* Filtre pour chercher plus facilement*/}
      <Filter name={ "BAC" }/>
      <Filter name={ "BEPC" }/>

      {/* Card pour les livres, on peut personnaliser leur taille via les props également*/}
      {/* <Card name={ "Ma carte 1" } txt={ "Par plamedi Ebana" } />
      <Card name={ "Ma carte 2" } txt={ "Par Neocodex" } />*/}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...typography.subtitle,
  },
  input: {
    ...typography.body,
    fontSize: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.text,
  },
});