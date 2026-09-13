import { useState } from 'react';
import { Pressable, Share, StatusBar, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  FileText,
  Info,
  KeyRound,
  Share2,
  Shield,
  UserRound,
  Wifi,
} from 'lucide-react-native';
import { colors, typography, fonts } from '../src/constants/themes';

// URL du site web — centralisées ici, faciles à ajuster
const WEB_URLS = {
  about: 'https://congolibs.netlify.app/public/src/html/a-propos',
  terms: 'https://congolibs.netlify.app/public/src/html/conditions-utilisation',   // TODO : ajuste le slug
  privacy: 'https://congolibs.netlify.app/public/src/html/confidentialite',       // TODO : ajuste le slug
};

function Row({ icon: Icon, label, onPress, last = false }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        !last && styles.rowDivider,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.rowLeft}>
        <View style={styles.bubble}>
          <Icon size={18} color={colors.primaryDark} />
        </View>
        <Text style={styles.rowText}>{label}</Text>
      </View>
      <ChevronRight size={18} color={colors.border} />
    </Pressable>
  );
}
// Conteneur qui laisse le Switch s'insérer via les children — plus simple :
// on utilise un second composant interne géré par la section Préférences.
function SlotSwitch() {
  return null;
}

function SwitchRow({ icon: Icon, label, value, onValueChange, last = false }) {
  return (
    <View style={[styles.row, !last && styles.rowDivider]}>
      <View style={styles.rowLeft}>
        <View style={styles.bubble}>
          <Icon size={18} color={colors.primaryDark} />
        </View>
        <Text style={styles.rowText}>{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.primaryDark }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

function SectionTitle({ children }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

export default function SettingsScreen() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [mobileData, setMobileData] = useState(false);

  const openWeb = (url, title) =>
    router.push({ pathname: '/webview', params: { url, title } });

  const handleShare = async () => {
    try {
      await Share.share({
        message:
          'Découvre Congolibs : toute la connaissance, à portée de main. Télécharge l’application aujourd’hui !',
      });
    } catch (e) {}
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />
      {/* Barre du haut */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          hitSlop={12}
        >
          <ArrowLeft size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.topTitle}>Paramètres</Text>
        <View style={styles.backButton} />
      </View>

      {/* ── Compte ── */}
      <SectionTitle>Compte</SectionTitle>
      <View style={styles.card}>
        <Row
          icon={UserRound}
          label="Modifier le profil"
          onPress={() => router.push('/profil')}
        />
        <Row
          icon={KeyRound}
          label="Changer le mot de passe"
          onPress={() => router.push('/auth/resetpwd')}
          last
        />
      </View>

      {/* ── Préférences ── */}
      <SectionTitle>Préférences</SectionTitle>
      <View style={styles.card}>
        <SwitchRow
          icon={Bell}
          label="Notifications push"
          value={pushEnabled}
          onValueChange={setPushEnabled}
        />
        <SwitchRow
          icon={Wifi}
          label="Télécharger via données mobiles"
          value={mobileData}
          onValueChange={setMobileData}
          last
        />
      </View>

      {/* ── Informations ── */}
      <SectionTitle>Informations</SectionTitle>
      <View style={styles.card}>
        <Row
          icon={FileText}
          label="Conditions d'utilisation"
          onPress={() => openWeb(WEB_URLS.terms, "Conditions d'utilisation")}
        />
        <Row
          icon={Shield}
          label="Politique de confidentialité"
          onPress={() => openWeb(WEB_URLS.privacy, 'Politique de confidentialité')}
        />
        <Row
          icon={Info}
          label="À propos de Congolibs"
          onPress={() => openWeb(WEB_URLS.about, 'À propos de Congolibs')}
        />
        <Row
          icon={Share2}
          label="Partager l'app"
          onPress={handleShare}
          last
        />
      </View>

      <Text style={styles.version}>Congolibs v1.0.0</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
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
  sectionTitle: {
    ...typography.caption,
    fontFamily: fonts.poppinsSemiBold,
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.textSecondary,
    marginBottom: 8,
    marginHorizontal: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    minHeight: 56,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  bubble: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: 'rgba(8, 138, 73, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    ...typography.body,
    fontSize: 15,
    flexShrink: 1,
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