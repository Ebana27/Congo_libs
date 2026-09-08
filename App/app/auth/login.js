// Import balise react native
import { StyleSheet, View, Text, TextInput, Pressable, Image, StatusBar } from 'react-native';

// Element de navigation de expo-router
import { Link, router } from 'expo-router';

// Element de react
import { useState } from 'react';

// Icone lucide react
import { ArrowLeft, EyeIcon, EyeOffIcon } from 'lucide-react-native';

// Element de thèmes depuis le fichier themes.js
import { colors, typography } from '../../src/constants/themes';

// Services : API congolibs
import { postCall, primeCsrfToken, setCsrfToken } from '../../src/services/api/congolibsAPI';

// Composant
// -------------------
// Modales
import ErrorModal from '../../src/components/ErrorModal';
import SuccessModal from '../../src/components/SuccessModal';

// Fonction par défaut
export default function Login() {
  // Etats des champs du formulaire
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Soumission du formulaire de connexion
  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage('Veuillez remplir tous les champs.');
      return;
    }
    setLoading(true);
    try {
      await primeCsrfToken();
      const data = await postCall('/users/login/', { username, password });
      setCsrfToken(data.csrfToken);
      setSuccessMessage('Connexion réussie. Bienvenue dans votre bibliothèque.');
    } catch (e) {
      setErrorMessage(e.message || 'Identifiants invalides.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />

      {/* Flèche de retour en arrière */}
      <Pressable style={styles.arrowContainer} onPress={() => router.back()}>
        <ArrowLeft size={24} color={colors.primaryDark} />
      </Pressable>

      {/* Titre de la page */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Connexion</Text>
        {/* Sous titre */}
        <Text style={styles.subtitle}>Retrouvez votre bibliothèque.</Text>
      </View>

      {/* Formulaire de connexion */}
      <View>
        <View style={styles.fieldContainer}>
          {/* Label Nom d'utilisateur + Input */}
          <Text style={styles.label}>Nom d'utilisateur</Text>
          <TextInput
            style={styles.input}
            placeholder="Entrez votre nom d'utilisateur"
            placeholderTextColor={colors.textSecondary}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.fieldContainer}>
          {/* Label Password + Password Input */}
          <Text style={styles.label}>Mot de passe</Text>
          <View style={styles.passwordInputWrapper}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Entrez votre mot de passe"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            {/* Toggle affichage/masquage du mot de passe */}
            <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              {showPassword ? (
                <EyeIcon size={22} color={colors.text} />
              ) : (
                <EyeOffIcon size={22} color={colors.text} />
              )}
            </Pressable>
          </View>
          <Link href="./resetpwd" style={styles.forgotPasswordLink}>
            <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
          </Link>
        </View>

        <View>
          {/* Bouton de connexion */}
          {/* Remplacé <Button> (RN) par <Pressable> pour pouvoir styliser comme sur la maquette */}
          <Pressable style={[styles.loginButton, loading && styles.loginButtonDisabled]} onPress={handleLogin} disabled={loading}>
            <Text style={styles.loginButtonText}>{loading ? 'Connexion...' : 'Se connecter'}</Text>
          </Pressable>
        </View>

        {/* Separator */}
        <View style={styles.separatorContainer}>
          <View style={styles.separator} />
          <Text style={styles.separatorText}>ou</Text>
          <View style={styles.separator} />
        </View>

        {/* Connexion via Google ou Apple */}
        <View style={styles.socialContainer}>
          {/* Bouton avec icon google et apple */}
          <Pressable style={styles.socialButton} onPress={() => { alert("Connexion en cours..."); }}>
            <Image source={require('../../assets/icons/external_icons/logo_google.png')} style={styles.icon} />
            <Text style={styles.socialButtonText}>Google</Text>
          </Pressable>
          <Pressable style={styles.socialButton} onPress={() => { alert("Connexion en cours..."); }}>
            <Image source={require('../../assets/icons/external_icons/logo_apple.png')} style={styles.icon} />
            <Text style={styles.socialButtonText}>Apple</Text>
          </Pressable>
        </View>

        {/* Pas de compte ? Inscrivez-vous */}
        <View style={styles.signupContainer}>
          <Link href="/auth/signup">
            <Text style={styles.signupText}>
              Pas encore de compte ? <Text style={styles.signupLink}>Créer un compte</Text>
            </Text>
          </Link>
        </View>
      </View>

      <Link href="/">
        <Text style={styles.tempButton}>
          Accueil
        </Text>
      </Link>

      {/* Modale d'erreur */}
      <ErrorModal visible={!!errorMessage} message={errorMessage} onClose={() => setErrorMessage(null)} />

      {/* Modale de succès */}
      <SuccessModal
        visible={!!successMessage}
        message={successMessage}
        onClose={() => {
          setSuccessMessage(null);
          setUsername('');
          setPassword('');
          router.replace('/(tabs)');
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
    paddingTop: 40,
  },
  arrowContainer: {
    position: 'absolute',
    top: 50,
    left: 24,
  },
  headerContainer: {
    marginTop: 60,
    marginBottom: 32,
  },
  title: {
    ...typography.title,
    fontSize: 34,
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
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
  },
  passwordInput: {
    ...typography.body,
    flex: 1,
    paddingVertical: 14,
  },
  eyeIcon: {
    paddingLeft: 8,
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  forgotPasswordText: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: colors.primaryDark,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    ...typography.button,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  separatorText: {
    ...typography.caption,
    marginHorizontal: 12,
  },
  socialContainer: {
    gap: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 14,
  },
  socialButtonText: {
    ...typography.body,
    fontWeight: '600',
    marginLeft: 10,
  },
  icon: {
    width: 22,
    height: 22,
  },
  signupContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  signupText: {
    ...typography.caption,
    color: colors.text,
  },
  signupLink: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  tempButton: {
    backgroundColor: colors.primaryDark,
    padding: 10,
    borderRadius: 5,
    marginTop: 30,
    alignItems: 'center',
  },
  tempButtonText: {
    color: colors.surface,
  },
});
