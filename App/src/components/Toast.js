// src/components/Toast.js
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle2, XCircle } from 'lucide-react-native';
import { colors, typography } from '../constants/themes';

// Composant simple pour afficher un message de succès ou d'erreur
// Utilisation : <Toast type="success" message="Compte créé avec succès" />
//               <Toast type="error" message="Email ou mot de passe incorrect" />
export default function Toast({ type = 'success', message }) {
  const isSuccess = type === 'success';

  return (
    <View style={[styles.container, isSuccess ? styles.success : styles.error]}>
      {isSuccess ? (
        <CheckCircle2 size={20} color={colors.primaryDark} />
      ) : (
        <XCircle size={20} color={colors.danger} />
      )}
      <Text style={[styles.text, isSuccess ? styles.successText : styles.errorText]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  success: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primaryDark,
  },
  error: {
    // Pas de teinte "erreur claire" dans theme.js, j'en improvise une légère ici
    backgroundColor: '#fff1ee',
    borderWidth: 1,
    borderColor: colors.danger,
  },
  text: {
    ...typography.caption,
    marginLeft: 8,
    flex: 1,
  },
  successText: {
    color: colors.primaryDark,
  },
  errorText: {
    color: colors.danger,
  },
});