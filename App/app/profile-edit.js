import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, AtSign, Mail, Save, User, UserPlus } from 'lucide-react-native';
import { colors, fonts, typography } from '../src/constants/themes';
import ErrorModal from '../src/components/shared/ErrorModal';
import SuccessModal from '../src/components/shared/SuccessModal';
import { cacheUser, getCachedUser } from '../src/services/api/congolibsAPI';

const FIELDS = [
  { key: 'first_name', label: 'Prénom', Icon: User, keyboard: 'default' },
  { key: 'last_name', label: 'Nom', Icon: UserPlus, keyboard: 'default' },
  { key: 'username', label: "Nom d'utilisateur", Icon: AtSign, keyboard: 'default' },
  { key: 'email', label: 'Email', Icon: Mail, keyboard: 'email-address' },
];

const getInitials = (first, last) => {
  const a = String(first || '').trim().charAt(0);
  const b = String(last || '').trim().charAt(0);
  const value = `${a}${b}`.toUpperCase();
  return value || '?';
};

export default function ProfileEditScreen() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
  });
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    let mounted = true;
    getCachedUser()
      .then((cached) => {
        if (!mounted || !cached) return;
        setForm({
          first_name: cached.first_name || '',
          last_name: cached.last_name || '',
          username: cached.username || '',
          email: cached.email || '',
        });
      })
      .catch(() => {})
      .finally(() => mounted && setReady(true));
    return () => {
      mounted = false;
    };
  }, []);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    const first = form.first_name.trim();
    const last = form.last_name.trim();
    const email = form.email.trim();

    if (!first && !last) {
      setErrorMessage('Renseigne au moins un prénom ou un nom.');
      return;
    }
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      setErrorMessage('Cet email ne semble pas valide.');
      return;
    }

    setSaving(true);
    try {
      const cached = (await getCachedUser().catch(() => null)) || {};
      // Sauvegarde locale uniquement : aucun appel API pour le moment.
      await cacheUser({
        ...cached,
        first_name: first,
        last_name: last,
        username: form.username.trim() || cached.username || '',
        email: email || cached.email || '',
      });
      setSuccessVisible(true);
    } catch (e) {
      setErrorMessage('Impossible d’enregistrer tes informations pour le moment.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />

      <View style={styles.topBar}>
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)/profil'))}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Retour"
        >
          <ArrowLeft size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.topTitle}>Modifier le profil</Text>
        <View style={styles.backButton} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.identity}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {getInitials(form.first_name, form.last_name)}
              </Text>
            </View>
            <Text style={styles.identityHint}>
              Les modifications sont enregistrées uniquement sur cet appareil.
            </Text>
          </View>

          {FIELDS.map((field) => (
            <View key={field.key} style={styles.field}>
              <Text style={styles.label}>{field.label}</Text>
              <View style={styles.inputWrap}>
                <field.Icon size={17} color={colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  value={form[field.key]}
                  onChangeText={(value) => update(field.key, value)}
                  placeholder={`Ton ${field.label.toLowerCase()}`}
                  placeholderTextColor={colors.textSecondary}
                  autoCapitalize="words"
                  autoCorrect={false}
                  keyboardType={field.keyboard}
                  editable={ready && !saving}
                />
              </View>
            </View>
          ))}

          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              pressed && styles.pressed,
              (saving || !ready) && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={saving || !ready}
          >
            <Save size={18} color={colors.surface} />
            <Text style={styles.saveText}>
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      <ErrorModal
        visible={!!errorMessage}
        message={errorMessage}
        onClose={() => setErrorMessage(null)}
      />
      <SuccessModal
        visible={successVisible}
        message="Ton profil a été mis à jour."
        onClose={() => {
          setSuccessVisible(false);
          router.back();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 12,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  topTitle: {
    ...typography.subtitle,
    fontSize: 18,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 14,
  },
  identity: {
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: fonts.poppinsBold,
    fontSize: 30,
    color: colors.surface,
  },
  identityHint: {
    ...typography.caption,
    fontSize: 12,
    textAlign: 'center',
  },
  field: {
    gap: 6,
  },
  label: {
    ...typography.body,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 13 : 8,
  },
  input: {
    flex: 1,
    ...typography.body,
    fontSize: 15,
    color: colors.text,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
    backgroundColor: colors.primaryDark,
    borderRadius: 16,
    paddingVertical: 15,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveText: {
    ...typography.button,
  },
  pressed: {
    opacity: 0.7,
  },
});
