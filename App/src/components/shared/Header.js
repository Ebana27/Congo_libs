import { Bell } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, typography } from '../../constants/themes';
import { router } from 'expo-router';

// TODO : brancher sur le vrai compteur renvoyé par l'API.
const NOTIFICATIONS_COUNT = 3;

export default function Header({ title, notificationCount = NOTIFICATIONS_COUNT }) {
  const count = Math.max(0, Number(notificationCount) || 0);
  const badge = count > 99 ? '99+' : String(count);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Pressable
          accessibilityLabel={
            count > 0 ? `Notifications, ${count} non lues` : 'Notifications'
          }
          hitSlop={8}
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
          onPress={() => router.push('/notifications')}
        >
          <Bell size={22} color={colors.text} />
          {count > 0 ? (
            <View style={styles.badge} pointerEvents="none">
              <Text style={styles.badgeText} numberOfLines={1}>
                {badge}
              </Text>
            </View>
          ) : null}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
  },
  container: {
    height: 56,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...typography.title,
  },
  iconButton: {
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: fonts.poppinsSemiBold,
    fontSize: 10,
    lineHeight: 13,
    color: colors.surface,
  },
  pressed: {
    opacity: 0.7,
  },
});
