import { useState } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ArrowLeft,
  ChevronDown,
  Mail,
  MessageCircle,
  Phone,
  Send,
} from 'lucide-react-native';
import { colors, typography, fonts } from '../src/constants/themes';

const FAQ = [
  {
    q: 'Comment télécharger un document ?',
    a: "Ouvre la bibliothèque, appuie sur le document de ton choix puis sur le bouton Télécharger. Une fois terminé, il sera disponible hors connexion.",
  },
  {
    q: 'Puis-je lire mes documents sans internet ?',
    a: 'Oui ! Tous les documents téléchargés restent accessibles dans ta bibliothèque, même sans connexion.',
  },
  {
    q: 'Comment ajouter un document aux favoris ?',
    a: "Appuie sur l'icône cœur d'un document pour le retrouver rapidement dans l'onglet Favoris.",
  },
  {
    q: 'Mes documents sont-ils gratuits ?',
    a: 'Congolibs propose des documents gratuits ainsi que du contenu premium, clairement indiqué avant tout téléchargement.',
  },
];

const CONTACT_EMAIL = 'hello@congolibs.space';
const CONTACT_PHONE = '+242067756084';
const WHATSAPP_URL = 'https://wa.me/242067756084'; // format international sans +

const openLink = (url) => {
  Linking.canOpenURL(url)
    .then((supported) => (supported ? Linking.openURL(url) : null))
    .catch(() => {});
};

function FaqItem({ item, open, onToggle }) {
  return (
    <View style={styles.faqItem}>
      <Pressable style={styles.faqQuestion} onPress={onToggle}>
        <Text style={styles.faqQText}>{item.q}</Text>
        <ChevronDown
          size={18}
          color={colors.textSecondary}
          style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}
        />
      </Pressable>
      {open ? <Text style={styles.faqAnswer}>{item.a}</Text> : null}
    </View>
  );
}

export default function HelpScreen() {
  const [openIndex, setOpenIndex] = useState(null);

  const mailto = (subject) =>
    Linking.openURL(
      `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`
    ).catch(() => {});

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Retour"
        >
          <ArrowLeft size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.topTitle}>Aide & support</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Intro */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Comment pouvons-nous t'aider ?</Text>
          <Text style={styles.heroText}>
            Consulte la FAQ ci-dessous ou contacte notre équipe, on répond vite.
          </Text>
        </View>

        {/* FAQ */}
        <Text style={styles.sectionTitle}>Questions fréquentes</Text>
        <View style={styles.card}>
          {FAQ.map((item, i) => (
            <FaqItem
              key={i}
              item={item}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </View>

        {/* Contact */}
        <Text style={styles.sectionTitle}>Nous contacter</Text>
        <View style={styles.card}>
          <Pressable
            style={({ pressed }) => [
              styles.contactRow,
              styles.rowDivider,
              pressed && styles.pressed,
            ]}
            onPress={() => mailto('Demande d’aide — Congolibs')}
            accessibilityRole="button"
            accessibilityLabel={`Écrire à ${CONTACT_EMAIL}`}
          >
            <View style={styles.bubble}>
              <Mail size={18} color={colors.primaryDark} />
            </View>
            <View style={styles.contactTexts}>
              <Text style={styles.contactTitle}>Email</Text>
              <Text style={styles.contactValue} numberOfLines={1}>
                {CONTACT_EMAIL}
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.contactRow,
              styles.rowDivider,
              pressed && styles.pressed,
            ]}
            onPress={() => openLink(`tel:${CONTACT_PHONE}`)}
            accessibilityRole="button"
            accessibilityLabel={`Appeler le ${CONTACT_PHONE}`}
          >
            <View style={styles.bubble}>
              <Phone size={18} color={colors.primaryDark} />
            </View>
            <View style={styles.contactTexts}>
              <Text style={styles.contactTitle}>Téléphone</Text>
              <Text style={styles.contactValue} numberOfLines={1}>
                {CONTACT_PHONE}
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.contactRow,
              styles.rowDivider,
              pressed && styles.pressed,
            ]}
            onPress={() => openLink(WHATSAPP_URL)}
            accessibilityRole="button"
            accessibilityLabel="Écrire sur WhatsApp"
          >
            <View style={styles.bubble}>
              <MessageCircle size={18} color={colors.primaryDark} />
            </View>
            <View style={styles.contactTexts}>
              <Text style={styles.contactTitle}>WhatsApp</Text>
              <Text style={styles.contactValue} numberOfLines={1}>
                Réponse sous 24 h
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.contactRow, pressed && styles.pressed]}
            onPress={() => mailto('Signalement de problème — Congolibs')}
            accessibilityRole="button"
            accessibilityLabel="Signaler un problème"
          >
            <View style={[styles.bubble, styles.bubbleDanger]}>
              <Send size={18} color={colors.danger} />
            </View>
            <View style={styles.contactTexts}>
              <Text style={[styles.contactTitle, { color: colors.danger }]}>
                Signaler un problème
              </Text>
              <Text style={styles.contactValue}>Un bug ? Un document manquant ?</Text>
            </View>
          </Pressable>
        </View>

        <Text style={styles.footNote}>
          Congolibs — Bibliothèque partagée de cours, d’annales et de fiches.
        </Text>
      </ScrollView>
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
  scrollContent: {
    paddingBottom: 28,
  },
  hero: {
    backgroundColor: colors.primaryDark,
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  heroTitle: {
    fontFamily: fonts.poppinsSemiBold,
    fontSize: 18,
    lineHeight: 26,
    color: colors.surface,
  },
  heroText: {
    ...typography.caption,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  sectionTitle: {
    ...typography.caption,
    fontFamily: fonts.poppinsSemiBold,
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.primaryDark,
    marginBottom: 8,
    marginHorizontal: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  faqItem: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 14,
  },
  faqQText: {
    ...typography.body,
    fontSize: 14,
    flexShrink: 1,
  },
  faqAnswer: {
    ...typography.caption,
    fontSize: 13,
    paddingBottom: 14,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    minHeight: 64,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  bubble: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(8, 138, 73, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleDanger: {
    backgroundColor: 'rgba(255, 95, 58, 0.10)',
  },
  contactTexts: {
    flexShrink: 1,
  },
  contactTitle: {
    ...typography.body,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  contactValue: {
    ...typography.caption,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 1,
  },
  footNote: {
    ...typography.caption,
    fontSize: 12,
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 4,
  },
  pressed: {
    opacity: 0.7,
  },
});