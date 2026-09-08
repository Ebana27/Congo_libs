import { StyleSheet, View, Text, TextInput, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react-native';
import { colors, typography } from '../../src/constants/themes';
import { postCall } from '../../src/services/api/congolibsAPI';
import ErrorModal from '../../src/components/ErrorModal';
import SuccessModal from '../../src/components/SuccessModal';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Soumission du formulaire de réinitialisation
  const handleReset = async () => {
    if (!email) {
      setErrorMessage('Veuillez entrer votre adresse email.');
      return;
    }
    setLoading(true);
    try {
      await postCall('/users/auth/password/reset/', { email });
      setSuccessMessage('Un lien de réinitialisation a été envoyé à votre adresse email.');
    } catch (e) {
      setErrorMessage(e.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Flèche de retour en arrière */}
      <Pressable style={styles.arrowContainer} onPress={() => router.back()}>
        <ArrowLeft size={24} color={colors.primaryDark} />
      </Pressable>

      {/* Titre de la page */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Mot de passe oublié ?</Text>
        {/* Sous titre */}
        <Text style={styles.subtitle}>
          Indiquez votre adresse email et recevez un lien pour réinitialiser votre mot de passe.
        </Text>
      </View>

      {/* Formulaire */}
      <View>
        <View style={styles.fieldContainer}>
          {/* Label Email + Email Input */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Entrez votre email"
            placeholderTextColor={colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View>
          {/* Bouton d'envoi */}
          {/* Remplacé <Button> (RN) par <Pressable> pour pouvoir styliser comme sur la maquette */}
          <Pressable style={[styles.resetButton, loading && styles.resetButtonDisabled]} onPress={handleReset} disabled={loading}>
            <Text style={styles.resetButtonText}>{loading ? 'Envoi...' : 'Envoyer le lien'}</Text>
          </Pressable>
        </View>
      </View>

      {/* Modale d'erreur */}
      <ErrorModal visible={!!errorMessage} message={errorMessage} onClose={() => setErrorMessage(null)} />

      {/* Modale de succès */}
      <SuccessModal
        visible={!!successMessage}
        message={successMessage}
        onClose={() => {
          setSuccessMessage(null);
          setEmail('');
        }}
      />
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  arrowContainer: {
    position: 'absolute',
    top: 60,
    left: 24,
  },
  headerContainer: {
    marginTop: 60,
    marginBottom: 32,
  },
  title: {
    ...typography.title,
    fontSize: 30,
    marginBottom: 8,
  },
  subtitle: {
    ...typography.body,
    color: colors.text,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    ...typography.body,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  resetButton: {
    backgroundColor: colors.primaryDark,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  resetButtonDisabled: {
    opacity: 0.6,
  },
  resetButtonText: {
    ...typography.button,
  },
});
