import { StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '../../src/constants/themes';

export default function ProfilScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profil</Text>
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
});