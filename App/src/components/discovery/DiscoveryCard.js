import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { colors, fonts } from '../../constants/themes';

export default function DiscoveryCard({ title, description, Icon, bg = colors.primaryDark, onPress }) {
  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    router.push('/library');
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={handlePress}
    >
      <View style={[styles.iconWrap, { backgroundColor: bg }]}>
        <Icon size={24} color={colors.surface} />
      </View>

      <View style={styles.texts}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      <ChevronRight size={18} color={colors.border} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(6, 10, 13, 0.07)',
    padding: 16,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.poppinsSemiBold,
    fontSize: 16,
    color: colors.text,
  },
  description: {
    fontFamily: fonts.inter,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  pressed: {
    opacity: 0.7,
  },
});