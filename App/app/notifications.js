import { useMemo, useState } from 'react';
import { Pressable, SectionList, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Bell,
  Download,
  Sparkles,
} from 'lucide-react-native';
import { colors, typography, fonts } from '../src/constants/themes';

// Remplace par tes vraies données (API, state global, etc.)
const NOTIFS_INIT = [
  { id: '1', type: 'download', when: 'today', time: 'Il y a 5 min', title: 'Téléchargement terminé', body: 'Mathématiques BAC 2024 est prêt à être lu.', read: false },
  { id: '2', type: 'discovery', when: 'today', time: 'Il y a 2 h', title: 'Nouveau document disponible', body: "Physique-Chimie Terminale vient d'être ajouté à la Découverte.", read: false },
  { id: '3', type: 'download', when: 'today', time: 'Ce matin', title: 'Téléchargement terminé', body: 'Annales BEPC 2023 sont prêtes à être lues.', read: true },
  { id: '4', type: 'system', when: 'yesterday', time: 'Hier', title: 'Bienvenue sur Congolibs !', body: 'Explore des milliers de documents pour ton année scolaire.', read: true },
  { id: '5', type: 'discovery', when: 'earlier', time: 'Lun.', title: 'Conseil de lecture', body: "Les documents les plus consultés cette semaine t'attendent.", read: true },
];

const TINTS = {
  download:  { icon: Download,  bg: 'rgba(8, 138, 73, 0.10)',  fg: colors.primaryDark },
  discovery: { icon: Sparkles,  bg: 'rgba(255, 95, 58, 0.10)', fg: colors.danger },
  system:    { icon: Bell,      bg: 'rgba(6, 10, 13, 0.06)',   fg: colors.textSecondary },
};

const SECTION_ORDER = [
  { key: 'today', label: "Aujourd'hui" },
  { key: 'yesterday', label: 'Hier' },
  { key: 'earlier', label: 'Plus tôt' },
];

export default function NotificationsScreen() {
  const [notifs, setNotifs] = useState(NOTIFS_INIT);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const sections = useMemo(() => {
    const groups = { today: [], yesterday: [], earlier: [] };
    notifs.forEach((n) => groups[n.when]?.push(n));
    return SECTION_ORDER
      .filter((s) => groups[s.key].length > 0)
      .map((s) => ({ key: s.key, title: s.label, data: groups[s.key] }));
  }, [notifs]);

  const markAsRead = (id) => {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />
      {/* ── Header ── */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          hitSlop={12}
        >
          <ArrowLeft size={22} color={colors.text} />
        </Pressable>

        <View style={styles.topTitles}>
          <Text style={styles.topTitle}>Notifications</Text>
          <Text style={styles.topSubtitle}>
            {unreadCount > 0
              ? `${unreadCount} non lue${unreadCount > 1 ? 's' : ''}`
              : 'Tout est lu'}
          </Text>
        </View>

        <Pressable onPress={markAllAsRead} disabled={unreadCount === 0} hitSlop={8}>
          <Text style={[styles.markAll, unreadCount === 0 && styles.markAllDisabled]}>
            Tout lire
          </Text>
        </Pressable>
      </View>

      {/* ── Liste ── */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const tint = TINTS[item.type] || TINTS.system;
          const Icon = tint.icon;

          return (
            <Pressable
              style={({ pressed }) => [
                styles.card,
                !item.read && styles.cardUnread,
                pressed && styles.pressed,
              ]}
              onPress={() => markAsRead(item.id)}
            >
              <View style={[styles.bubble, { backgroundColor: tint.bg }]}>
                <Icon size={20} color={tint.fg} />
              </View>

              <View style={styles.content}>
                <Text
                  style={[styles.title, !item.read && styles.titleUnread]}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <Text style={styles.body} numberOfLines={2}>
                  {item.body}
                </Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>

              {!item.read && <View style={styles.dot} />}
            </Pressable>
          );
        }}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyBubble}>
              <Bell size={32} color={colors.primaryDark} />
            </View>
            <Text style={styles.emptyTitle}>Aucune notification</Text>
            <Text style={styles.emptyText}>
              Tu seras prévenu ici des nouveautés et de tes téléchargements.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface, // ← page blanche
  },

  // ── Header ──
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 12,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight, // cercle vert clair sur blanc
  },
  topTitles: {
    flex: 1,
  },
  topTitle: {
    ...typography.subtitle,
    fontSize: 18,
  },
  topSubtitle: {
    ...typography.caption,
    fontSize: 12,
  },
  markAll: {
    fontFamily: fonts.poppinsSemiBold,
    fontSize: 13,
    color: colors.primaryDark,
  },
  markAllDisabled: {
    color: colors.border,
  },

  // ── Liste ──
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionHeader: {
    ...typography.caption,
    fontFamily: fonts.poppinsSemiBold,
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.textSecondary,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 4,
  },

  // ── Carte ──
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: colors.surface, // lue = blanche…
    borderRadius: 18,
    borderWidth: 1,                  // …délimitée par un bord fin
    borderColor: 'rgba(6, 10, 13, 0.07)',
    padding: 14,
    marginBottom: 10,
  },
  cardUnread: {
    backgroundColor: colors.primaryLight, // non-lue = remplie vert clair
    borderColor: colors.primaryLight,
  },
  bubble: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  titleUnread: {
    fontFamily: fonts.poppinsSemiBold,
    color: colors.text,
  },
  body: {
    ...typography.caption,
    fontSize: 13,
  },
  time: {
    ...typography.caption,
    fontSize: 11,
    marginTop: 2,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.primaryDark,
    marginTop: 6,
  },

  // ── État vide ──
  empty: {
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: 40,
    gap: 6,
  },
  emptyBubble: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyTitle: {
    ...typography.subtitle,
    fontSize: 16,
  },
  emptyText: {
    ...typography.caption,
    textAlign: 'center',
  },

  pressed: {
    opacity: 0.7,
  },
});