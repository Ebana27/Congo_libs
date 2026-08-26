// app/notif.js
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, BookOpen, Bell, Award, CheckCircle } from 'lucide-react-native';
import { useState } from 'react';
import { COLOR } from '../src/constants/themes';

// Données fictives pour les notifications
const NOTIFICATIONS_DATA = [
  {
    id: '1',
    type: 'course',
    title: 'Nouveau sujet disponible',
    description: 'Le sujet de Mathématiques BAC 2026 est en ligne.',
    time: 'Il y a 10 min',
    unread: true,
  },
  {
    id: '2',
    type: 'award',
    title: 'Félicitations !',
    description: 'Tu as validé le quiz sur l\'histoire du Congo avec un score parfait.',
    time: 'Il y a 2 heures',
    unread: true,
  },
  {
    id: '3',
    type: 'system',
    title: 'Rappel d\'examen',
    description: 'Plus que 15 jours avant les premières simulations du BEPC.',
    time: 'Hier',
    unread: false,
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState('all'); // 'all' ou 'unread'

  const notificationsFiltrees = NOTIFICATIONS_DATA.filter(n => 
    filter === 'all' ? true : n.unread
  );

  // Fonction pour attribuer une icône selon le type de notification
  const renderIcon = (type) => {
    switch (type) {
      case 'course': return <BookOpen color={COLOR.primary || '#1E40AF'} size={20} />;
      case 'award': return <Award color="#10B981" size={20} />;
      default: return <Bell color={COLOR.neutral || '#111827'} size={20} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* En-tête de la page */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.actionButton}>
          <ChevronLeft color={COLOR.neutral || '#111827'} size={24} />
        </Pressable>
        <Text style={styles.pageTitle}>Notifications</Text>
        <Pressable onPress={() => alert('Tout marquer comme lu')} style={styles.actionButton}>
          <CheckCircle color={COLOR.neutral || '#111827'} size={20} />
        </Pressable>
      </View>

      {/* Filtres de sélection */}
      <View style={styles.filterContainer}>
        <Pressable 
          style={[styles.filterTab, filter === 'all' && styles.activeFilterTab]} 
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>Toutes</Text>
        </Pressable>
        <Pressable 
          style={[styles.filterTab, filter === 'unread' && styles.activeFilterTab]} 
          onPress={() => setFilter('unread')}
        >
          <Text style={[styles.filterText, filter === 'unread' && styles.activeFilterText]}>Non lues</Text>
        </Pressable>
      </View>

      {/* Liste des notifications */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {notificationsFiltrees.length === 0 ? (
          <View style={styles.emptyState}>
            <Bell color="#9CA3AF" size={48} style={{ marginBottom: 12 }} />
            <Text style={styles.emptyText}>Aucune notification pour le moment.</Text>
          </View>
        ) : (
          notificationsFiltrees.map((item) => (
            <View 
              key={item.id} 
              style={[styles.notifCard, item.unread && styles.unreadCard]}
            >
              <View style={styles.iconContainer}>
                {renderIcon(item.type)}
              </View>
              
              <View style={styles.notifBody}>
                <View style={styles.notifHeader}>
                  <Text style={styles.notifTitle}>{item.title}</Text>
                  <Text style={styles.notifTime}>{item.time}</Text>
                </View>
                <Text style={styles.notifDescription}>{item.description}</Text>
              </View>
              
              {item.unread && <View style={styles.unreadDot} />}
            </View>
          ))
        )}
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
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginTop: 10,
    marginBottom: 20,
    gap: 16,
  },
  filterTab: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  activeFilterTab: {
    backgroundColor: '#111827',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  notifCard: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    alignItems: 'flex-start',
    position: 'relative',
  },
  unreadCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginHorizontal: -12,
    borderBottomColor: 'transparent',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  notifBody: {
    flex: 1,
  },
  notifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    maxWidth: '75%',
  },
  notifTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  notifDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1E40AF',
    position: 'absolute',
    right: 0,
    top: '50%',
    marginTop: -4,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 16,
  }
});
