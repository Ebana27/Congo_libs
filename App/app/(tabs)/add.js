import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { PlusCircle } from 'lucide-react-native';
import { colors, typography } from '../../src/constants/themes';

export default function AddScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />
      <View style={styles.bubble}>
        <PlusCircle size={34} color={colors.primaryDark} />
      </View>
      <Text style={styles.title}>Ajouter un document</Text>
      <Text style={styles.text}>
        La création et le dépôt de documents arrivent bientôt. Tu pourras bientôt
        partager tes cours, tes annales et tes fiches avec toute la communauté.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    gap: 10,
  },
  bubble: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    ...typography.subtitle,
    fontSize: 20,
    textAlign: 'center',
  },
  text: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});