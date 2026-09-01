import { View, Text, StyleSheet, Switch, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, Moon, Bell, Globe, Type, Shield, Lock, Info, LogOut } from 'lucide-react-native';
import { COLOR } from '../src/constants/themes';
import { useState } from 'react';

export default function SettingsScreen() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Barre d'actions supérieure (même pattern que profil.js) */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.actionButton}>
          <ChevronLeft color={COLOR.neutral || '#111827'} size={24} />
        </Pressable>
        <Text style={styles.pageTitle}>Paramètres</Text>
        <View style={styles.actionButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Section Général */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionLabel}>GÉNÉRAL</Text>

          {/* Mode sombre */}
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Moon color={COLOR.neutral || '#111827'} size={20} style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Mode sombre</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={(value) => setIsDarkMode(value)}
              trackColor={{ false: '#E5E7EB', true: COLOR.primary || '#006A4E' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Notifications */}
          <Pressable style={styles.menuItem} onPress={() => router.push('/notif')}>
            <View style={styles.menuItemLeft}>
              <Bell color={COLOR.neutral || '#111827'} size={20} style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Notifications</Text>
            </View>
            <ChevronLeft color="#9CA3AF" size={18} style={styles.chevronRight} />
          </Pressable>

          {/* Langue */}
          <Pressable style={styles.menuItem} onPress={() => router.push('/settings/language')}>
            <View style={styles.menuItemLeft}>
              <Globe color={COLOR.neutral || '#111827'} size={20} style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Langue</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Text style={styles.valueText}>Français</Text>
              <ChevronLeft color="#9CA3AF" size={18} style={styles.chevronRight} />
            </View>
          </Pressable>

          {/* Taille du texte */}
          <Pressable style={[styles.menuItem, styles.lastItem]} onPress={() => router.push('/settings/text-size')}>
            <View style={styles.menuItemLeft}>
              <Type color={COLOR.neutral || '#111827'} size={20} style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Taille du texte</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Text style={styles.valueText}>Moyenne</Text>
              <ChevronLeft color="#9CA3AF" size={18} style={styles.chevronRight} />
            </View>
          </Pressable>
        </View>

        {/* Section Compte */}
        <View style={[styles.menuSection, styles.secondSection]}>
          <Text style={styles.sectionLabel}>COMPTE</Text>

          {/* Confidentialité */}
          <Pressable style={styles.menuItem} onPress={() => router.push('/settings/privacy')}>
            <View style={styles.menuItemLeft}>
              <Shield color={COLOR.neutral || '#111827'} size={20} style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Confidentialité</Text>
            </View>
            <ChevronLeft color="#9CA3AF" size={18} style={styles.chevronRight} />
          </Pressable>

          {/* Sécurité */}
          <Pressable style={styles.menuItem} onPress={() => router.push('/settings/security')}>
            <View style={styles.menuItemLeft}>
              <Lock color={COLOR.neutral || '#111827'} size={20} style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Sécurité</Text>
            </View>
            <ChevronLeft color="#9CA3AF" size={18} style={styles.chevronRight} />
          </Pressable>

          {/* À propos */}
          <Pressable style={[styles.menuItem, styles.lastItem]} onPress={() => router.push('/settings/about')}>
            <View style={styles.menuItemLeft}>
              <Info color={COLOR.neutral || '#111827'} size={20} style={styles.menuIcon} />
              <Text style={styles.menuItemText}>À propos de Congolibs</Text>
            </View>
            <ChevronLeft color="#9CA3AF" size={18} style={styles.chevronRight} />
          </Pressable>
        </View>

        {/* Se déconnecter */}
        <Pressable style={[styles.menuItem, styles.logoutItem]} onPress={() => alert('Déconnexion')}>
          <View style={styles.menuItemLeft}>
            <LogOut color="#EF4444" size={20} style={styles.menuIcon} />
            <Text style={[styles.menuItemText, styles.logoutText]}>Se déconnecter</Text>
          </View>
        </Pressable>
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
  pageTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  menuSection: {
    paddingHorizontal: 24,
    marginTop: 8,
  },
  secondSection: {
    marginTop: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: '#6B7280',
    marginBottom: 4,
    marginLeft: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemRight: {
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
  valueText: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 4,
  },
  chevronRight: {
    transform: [{ rotate: '180deg' }],
  },
  logoutItem: {
    borderBottomWidth: 0,
    marginTop: 30,
    paddingHorizontal: 24,
  },
  logoutText: {
    color: '#EF4444',
  },
});
