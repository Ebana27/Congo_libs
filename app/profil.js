import { View, Text, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, Settings, BookOpen, Award, LogOut } from 'lucide-react-native';
import { COLOR } from '../src/constants/themes';

export default function ProfilScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Cache le header natif pour faire un en-tête Behance sur-mesure */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* Barre d'actions supérieure */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.actionButton}>
          <ChevronLeft color={COLOR.neutral || '#111827'} size={24} />
        </Pressable>
        <Pressable onPress={() => alert('Paramètres')} style={styles.actionButton}>
          <Settings color={COLOR.neutral || '#111827'} size={22} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Section Identité (Style Behance Hero) */}
        <View style={styles.profileHero}>
          <View style={styles.avatarContainer}>
            <Image 
              source={require('../assets/img/profil.png')} 
              style={styles.avatar}
            />
          </View>
          <Text style={styles.userName}>Plamedi Nkounkou</Text>
          <Text style={styles.userTitle}>Étudiant — Brazzaville, Congo</Text>
          
          <Pressable style={styles.editButton} onPress={() => alert('Modifier le profil')}>
            <Text style={styles.editButtonText}>Modifier le profil</Text>
          </Pressable>
        </View>

        {/* Section Statistiques / Compteurs discrets */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>14</Text>
            <Text style={styles.statLabel}>Cours suivis</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Quiz réussis</Text>
          </View>
        </View>

        {/* Menu d'options épuré */}
        <View style={styles.menuSection}>
          <Pressable style={styles.menuItem} onPress={() => router.push('/library')}>
            <View style={styles.menuItemLeft}>
              <BookOpen color={COLOR.neutral || '#111827'} size={20} style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Ma Bibliothèque</Text>
            </View>
            <ChevronLeft color="#9CA3AF" size={18} style={{ transform: [{ rotate: '180deg' }] }} />
          </Pressable>

          <Pressable style={styles.menuItem} onPress={() => alert('Mes Certificats')}>
            <View style={styles.menuItemLeft}>
              <Award color={COLOR.neutral || '#111827'} size={20} style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Mes Certificats & Badges</Text>
            </View>
            <ChevronLeft color="#9CA3AF" size={18} style={{ transform: [{ rotate: '180deg' }] }} />
          </Pressable>

          <Pressable style={[styles.menuItem, styles.logoutItem]} onPress={() => alert('Déconnexion')}>
            <View style={styles.menuItemLeft}>
              <LogOut color="#EF4444" size={20} style={styles.menuIcon} />
              <Text style={[styles.menuItemText, styles.logoutText]}>Se déconnecter</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  profileHero: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3F4F6',
    marginBottom: 16,
    // Ombre très légère et douce style Behance
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  userTitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: '#111827', // Bouton noir uni typique de Behance
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '85%',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 32,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: '#E5E7EB',
  },
  menuSection: {
    width: '100%',
    paddingHorizontal: 24,
    marginTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  logoutItem: {
    borderBottomWidth: 0,
    marginTop: 10,
  },
  logoutText: {
    color: '#EF4444',
  },
});
