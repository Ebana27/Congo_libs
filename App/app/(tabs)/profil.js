import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Settings, LogOut } from 'lucide-react-native';
import { colors, typography, fonts } from '../../src/constants/themes';
import { getCall, logout as apiLogout } from '../../src/services/api/congolibsAPI';

export default function ProfilScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    getCall('/users/session/')
      .then((data) => setUser(data.user || null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    await apiLogout();
    router.replace('/auth/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user ? (user.first_name || user.username || '?').charAt(0).toUpperCase() : '?'}
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator color={colors.primaryDark} style={styles.loader} />
        ) : (
          <View style={styles.info}>
            <Text style={styles.name}>
              {user ? user.first_name || user.username : 'Utilisateur'}
            </Text>
            <Text style={styles.email}>
              {user ? user.email : ''}
            </Text>
          </View>
        )}

        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={() => router.push('/auth/resetpwd')}
        >
          <Settings size={20} color={colors.primaryDark} />
          <Text style={styles.buttonText}>Paramètres</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.logoutButton, pressed && styles.buttonPressed]}
          onPress={handleLogout}
          disabled={loggingOut}
        >
          <LogOut size={20} color={colors.surface} />
          <Text style={styles.logoutText}>
            {loggingOut ? 'Déconnexion...' : 'Se déconnecter'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  inner: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontFamily: fonts.poppinsBold,
    fontSize: 34,
    color: colors.surface,
  },
  loader: {
    marginTop: 20,
  },
  info: {
    alignItems: 'center',
    marginBottom: 32,
  },
  name: {
    ...typography.subtitle,
    fontSize: 20,
  },
  email: {
    ...typography.caption,
    marginTop: 4,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 12,
  },
  buttonText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    backgroundColor: colors.danger,
    borderRadius: 14,
    paddingVertical: 14,
  },
  logoutText: {
    ...typography.button,
  },
  buttonPressed: {
    opacity: 0.7,
  },
});
