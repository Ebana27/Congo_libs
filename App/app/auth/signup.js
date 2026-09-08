import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { ArrowLeft, EyeIcon, EyeOffIcon, Check } from 'lucide-react-native';
import { colors, typography } from '../../src/constants/themes';
import { postCall } from '../../src/services/api/congolibsAPI';
import ErrorModal from '../../src/components/ErrorModal';
import SuccessModal from '../../src/components/SuccessModal';

// Rayon des coins de la carte blanche, déclaré une seule fois pour garder le design cohérent
const cardRadius = 28;

// Champs attendus par le backend (ACCOUNT_SIGNUP_FIELDS) :
// email, username, password1, password2 — pas de téléphone ni de nom complet
export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Soumission du formulaire d'inscription
  const handleSignup = async () => {
    if (!username || !email || !password || !confirmPassword) {
      setErrorMessage('Veuillez remplir tous les champs.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
      return;
    }
    if (!acceptTerms) {
      setErrorMessage('Veuillez accepter les conditions d\'utilisation.');
      return;
    }
    setLoading(true);
    try {
      await postCall('/users/auth/registration/', {
        username,
        email,
        password1: password,
        password2: confirmPassword,
      });
      setSuccessMessage('Compte créé avec succès. Vous pouvez maintenant vous connecter.');
    } catch (e) {
      setErrorMessage(e.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />

      {/* ImageBackground = le "background-image" CSS de RN : l'image REMPLIT tout le conteneur,
          tout ce qui est en enfant (header + carte) se dessine par-dessus, et elle reste fixe au scroll */}
      <View style={[styles.flex, styles.heroContainer]}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Bouton retour : HORS de la carte, superposé au héro (d'où le cercle translucide).
              marginTop large car la StatusBar est translucide : évite de passer sous le notch */}
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={22} color={colors.text} />
          </Pressable>

          {/* Header sur le héro : titre + sous-titre restent en dehors de la carte blanche */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>Votre espace de lecture commence ici.</Text>
          </View>

          {/* cardWrapper porte l'arrondi + overflow hidden et contraint la hauteur du ScrollView (flex: 1) :
              sans cette contrainte le ScrollView prend la hauteur de tout son contenu et ne scrolle plus */}
          <View style={styles.cardWrapper}>
            {/* keyboardShouldPersistTaps : permet de cliquer checkbox / bouton sans fermer d'abord le clavier */}
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* flexGrow sur la carte : elle s'étire jusqu'en bas si le contenu est plus court
                  que l'écran → jamais de bande du fond visible sous "Se connecter" */}
              <View style={styles.formCard}>
                <View style={styles.fields}>

                  {/* Nom d'utilisateur */}
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Nom d'utilisateur</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Choisissez un nom d'utilisateur"
                      placeholderTextColor={colors.textSecondary}
                      autoCapitalize="none"
                      value={username}
                      onChangeText={setUsername}
                    />
                  </View>

                  {/* Email */}
                  <View style={styles.fieldContainer}>
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

                  {/* Mot de passe */}
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Mot de passe</Text>
                    <View style={styles.passwordInputWrapper}>
                      <TextInput
                        style={styles.passwordInput}
                        placeholder="Créez un mot de passe"
                        placeholderTextColor={colors.textSecondary}
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                      />
                      <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon} hitSlop={8}>
                        {/* Œil ouvert quand le texte est masqué (état de repos = maquette), barré quand visible */}
                        {showPassword ? (
                          <EyeOffIcon size={20} color={colors.textSecondary} />
                        ) : (
                          <EyeIcon size={20} color={colors.textSecondary} />
                        )}
                      </Pressable>
                    </View>
                  </View>

                  {/* Confirmer le mot de passe */}
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Confirmer le mot de passe</Text>
                    <View style={styles.passwordInputWrapper}>
                      <TextInput
                        style={styles.passwordInput}
                        placeholder="Confirmez votre mot de passe"
                        placeholderTextColor={colors.border}
                        secureTextEntry={!showConfirmPassword}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                      />
                      <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon} hitSlop={8}>
                        {showConfirmPassword ? (
                          <EyeOffIcon size={20} color={colors.textSecondary} />
                        ) : (
                          <EyeIcon size={20} color={colors.textSecondary} />
                        )}
                      </Pressable>
                    </View>
                  </View>

                  {/* Conditions d'utilisation */}
                  <View style={styles.termsContainer}>
                    <Pressable onPress={() => setAcceptTerms(!acceptTerms)} style={styles.checkboxWrapper} hitSlop={6}>
                      <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
                        {acceptTerms && <Check size={14} color={colors.surface} strokeWidth={3} />}
                      </View>
                    </Pressable>
                    <Text style={styles.termsText}>
                      J’accepte les <Text style={styles.termsLink}>conditions d’utilisation</Text>
                    </Text>
                  </View>

                  {/* Bouton S'inscrire */}
                  <Pressable
                    style={[styles.signupButton, loading && styles.signupButtonDisabled]}
                    onPress={handleSignup}
                    disabled={loading}
                  >
                    <Text style={styles.signupButtonText}>{loading ? 'Inscription...' : 'S’inscrire'}</Text>
                  </Pressable>

                  {/* Séparateur */}
                  <View style={styles.separator} />

                  {/* Lien Se connecter */}
                  <View style={styles.loginContainer}>
                    <Link href="/auth/login">
                      <Text style={styles.loginText}>
                        Déjà un compte ? <Text style={styles.loginLink}>Se connecter</Text>
                      </Text>
                    </Link>
                  </View>

                </View>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>

      {/* Modale d'erreur */}
      <ErrorModal visible={!!errorMessage} message={errorMessage} onClose={() => setErrorMessage(null)} />

      {/* Modale de succès */}
      <SuccessModal
        visible={!!successMessage}
        message={successMessage}
        onClose={() => {
          setSuccessMessage(null);
          router.replace('/auth/login');
        }}
      />
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  heroContainer: {
    backgroundColor: colors.primaryLight,
  },
  backButton: {
    marginTop: 56,
    marginLeft: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  headerContainer: {
    paddingHorizontal: 24,
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    ...typography.title,
    fontSize: 32,
    color: colors.text,
    marginBottom: 6,
  },
  subtitle: {
    ...typography.caption,
    fontSize: 15,
    color: colors.textSecondary,
  },
  cardWrapper: {
    flex: 1, // contraint le ScrollView à l'espace restant : c'est la clé du scroll
    borderTopLeftRadius: cardRadius,
    borderTopRightRadius: cardRadius,
    overflow: 'hidden', // découpe la carte blanche qui défile selon les coins arrondis
  },
  scrollContent: {
    flexGrow: 1, // le contenu s'étire au minimum sur toute la hauteur du scroll
  },
  formCard: {
    flexGrow: 1, // étire la carte jusqu'en bas sans écraser son contenu (pas flex: 1, ça casserait le scroll)
    backgroundColor: colors.surface,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  fields: {
    gap: 16,
  },
  fieldContainer: {
    width: '100%',
  },
  label: {
    ...typography.body,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
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
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  passwordInput: {
    ...typography.body,
    fontSize: 14,
    flex: 1,
    paddingVertical: 12,
    color: colors.text,
  },
  eyeIcon: {
    paddingLeft: 8,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  checkboxWrapper: {
    marginRight: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  termsText: {
    ...typography.caption,
    fontSize: 13,
    color: colors.text,
  },
  termsLink: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  signupButton: {
    backgroundColor: colors.primaryDark,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  signupButtonDisabled: {
    opacity: 0.6,
  },
  signupButtonText: {
    ...typography.button,
    fontSize: 16,
    fontWeight: '700',
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  loginContainer: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  loginText: {
    ...typography.caption,
    fontSize: 14,
    color: colors.text,
  },
  loginLink: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
});