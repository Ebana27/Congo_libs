import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import {
  Settings,
  LogOut,
  ChevronRight,
  Download,
  Heart,
  HelpCircle,
  Info,
  Pencil,
} from 'lucide-react-native';
import { colors, typography, fonts } from '../../src/constants/themes';
import {
  getCurrentUser,
  loadToken,
  logout as apiLogout,
} from '../../src/services/api/congolibsAPI';
import ConfirmModal from '../../src/components/profil/ConfirmModal';

function MenuItem({ icon: Icon, label, onPress, danger = false, last = false }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.menuItem,
        !last && styles.menuItemDivider,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.menuLeft}>
        <View style={[styles.menuBubble, danger && styles.menuBubbleDanger]}>
          <Icon size={18} color={danger ? colors.danger : colors.primaryDark} />
        </View>
        <Text style={[styles.menuText, danger && styles.menuTextDanger]}>
          {label}
        </Text>
      </View>
      <ChevronRight size={18} color={colors.border} />
    </Pressable>
  );
}

export default function ProfilScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const token = await loadToken().catch(() => '');
      if (!mounted) return;
      if (!token) {
        setLoggedIn(false);
        setLoading(false);
        return;
      }
      setLoggedIn(true);
      getCurrentUser()
        .then((data) => mounted && setUser(data))
        .catch(async () => {
          const still = await loadToken().catch(() => '');
          if (mounted && !still) setLoggedIn(false);
        })
        .finally(() => mounted && setLoading(false));
    };
    init();
    return () => {
      mounted = false;
    };
  }, []);

  // Déclenché uniquement après confirmation dans la modale
  const handleLogout = () => {
    setConfirmVisible(false);
    router.replace('/auth/login');
    apiLogout().catch(() => {});
  };

  const getInitials = () => {
    if (!user) return '?';
    if (user.first_name && user.last_name) {
      return (user.first_name[0] + user.last_name[0]).toUpperCase();
    }
    return (user.first_name || user.username || '?').charAt(0).toUpperCase();
  };

  const fullName = user
    ? [user.first_name, user.last_name].filter(Boolean).join(' ') ||
      user.username ||
      'Utilisateur'
    : 'Utilisateur';

  if (!loading && !loggedIn) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.simpleContent}
        showsVerticalScrollIndicator={false}
      >
        <StatusBar style="dark" backgroundColor="transparent" translucent={true} />
        <View style={styles.card}>
          <Text style={styles.name}>Non connecté</Text>
          <Text style={styles.email}>
            Connecte-toi pour accéder à ton profil et à tes documents.
          </Text>
          <Pressable
            style={({ pressed }) => [styles.loginButton, pressed && styles.pressed]}
            onPress={() => router.replace('/auth/login')}
          >
            <Text style={styles.loginText}>Se connecter</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />
      {/* ── Identité ── */}
      <View style={styles.identity}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials()}</Text>
          </View>
          {/* TODO : brancher la route édition du profil */}
          <Pressable style={styles.editBadge} onPress={() => router.push('/settings')} hitSlop={8}>
            <Pencil size={13} color={colors.primaryDark} />
          </Pressable>
        </View>

        <Text style={styles.name} numberOfLines={1}>
          {fullName}
        </Text>
        {user.email ? (
          <Text style={styles.email} numberOfLines={1}>
            {user.email}
          </Text>
        ) : null}
      </View>

      {/* ── Stats ── */}
      <View style={styles.card}>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Téléchargements</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Favoris</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>En cours</Text>
          </View>
        </View>
      </View>

      {/* ── Menu ── */}
      <View style={styles.card}>
        <MenuItem
          icon={Download}
          label="Mes téléchargements"
          onPress={() => router.push('/library')}
        />
        <MenuItem
          icon={Heart}
          label="Mes favoris"
          onPress={() =>
            router.push({ pathname: '/library', params: { filter: 'Favoris' } })
          }
        />
        <MenuItem
          icon={Settings}
          label="Paramètres"
          onPress={() => router.push('/settings')}
        />
        <MenuItem
          icon={HelpCircle}
          label="Aide & support"
          onPress={() => router.push('/help')}
        />
        <MenuItem
          icon={Info}
          label="À propos de Congolibs"
          onPress={() =>
            router.push({
              pathname: '/webview',
              params: {
                url: 'https://congolibs.netlify.app/public/src/html/a-propos',
                title: 'À propos de Congolibs',
              },
            })
          }
          last
        />
      </View>

      {/* ── Déconnexion ── */}
      <Pressable
        style={({ pressed }) => [styles.logoutButton, pressed && styles.pressed]}
        onPress={() => setConfirmVisible(true)}
      >
        <LogOut size={20} color={colors.danger} />
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </Pressable>

      <Text style={styles.version}>Congolibs v1.0.0</Text>

      {/* ── Avertissement avant déconnexion ── */}
      <ConfirmModal
        visible={confirmVisible}
        title="Se déconnecter ?"
        message="Tu devras te reconnecter pour accéder à tes documents téléchargés."
        confirmText="Se déconnecter"
        cancelText="Annuler"
        onClose={() => setConfirmVisible(false)}
        onConfirm={handleLogout}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface, // ← page blanche
  },
  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 14,
  },
  simpleContent: {
    padding: 16,
    paddingTop: 32,
  },

  // ── Identité ──
  identity: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: fonts.poppinsBold,
    fontSize: 34,
    color: colors.surface,
  },
  editBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primaryLight,
  },
  name: {
    ...typography.subtitle,
    fontSize: 20,
    textAlign: 'center',
  },
  email: {
    ...typography.caption,
    marginTop: 4,
    textAlign: 'center',
  },

  // ── Cartes ──
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(6, 10, 13, 0.07)',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    ...typography.subtitle,
    fontSize: 20,
    color: colors.primaryDark,
  },
  statLabel: {
    ...typography.caption,
    fontSize: 12,
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    height: 34,
    backgroundColor: colors.border,
  },

  // ── Menu ──
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
  },
  menuItemDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  menuBubble: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(8, 138, 73, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuBubbleDanger: {
    backgroundColor: 'rgba(255, 95, 58, 0.10)',
  },
  menuText: {
    ...typography.body,
    fontSize: 15,
  },
  menuTextDanger: {
    color: colors.danger,
  },

  // ── État non connecté ──
  loginButton: {
    backgroundColor: colors.primaryDark,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  loginText: {
    ...typography.button,
  },

  // ── Déconnexion ──
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 95, 58, 0.35)',
    backgroundColor: 'rgba(255, 95, 58, 0.06)',
    borderRadius: 16,
    paddingVertical: 15,
  },
  logoutText: {
    ...typography.button,
    color: colors.danger,
  },
  version: {
    ...typography.caption,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },

  pressed: {
    opacity: 0.7,
  },
});