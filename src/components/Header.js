// src/components/Header.js
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Bell } from 'lucide-react-native'; 
import { COLOR } from '../constants/themes'; 
import { Link } from "expo-router";

export function AppHeader({ title }) {
  // Exemple de nombre de notifications (tu pourras le rendre dynamique plus tard avec une prop)
  const notificationCount = 10; 

  return (
    <View style={styles.headerContainer}>

      <Text style={styles.headerTitle}>{title}</Text>

      <View style={styles.rightActions}> 
        
        <Link href="/notif" asChild>
          <Pressable style={styles.iconButton}>
            <Bell color={COLOR.neutral || '#111827'} size={22} />
            
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {notificationCount > 9 ? '9+' : notificationCount}
                </Text>
              </View>
            )}
          </Pressable>
        </Link>
        
        <Link href="/profil" asChild>
          <Pressable style={styles.profileButton}>
            <Image 
              source={require('../../assets/img/profil.png')} 
              style={styles.profileImage}
            />
          </Pressable>
        </Link>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24, 
    fontWeight: '800',
    color: COLOR.neutral || '#111827', 
    letterSpacing: 1,
  },
  rightActions: { 
    flexDirection: "row", 
    alignItems: "center",
  },
  iconButton: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Essentiel pour positionner le badge par-dessus
  },
  profileButton: {
    width: 38,
    height: 38,
    marginLeft: 8, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 19, 
    backgroundColor: '#f5f5f5', 
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: COLOR.primary || '#1E40AF', // Ta couleur principale
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 10, // Évite les décalages de texte sur le web
    textAlign: 'center',
  }
});
