import { StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '../../src/constants/themes';

export default function LibraryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bibliothèque</Text>
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