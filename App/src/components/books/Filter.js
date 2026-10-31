import { Pressable, Text, StyleSheet, View } from "react-native";
import { colors, fonts } from "../../constants/themes";

export default function Filter({ name, active = false, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tab,
        pressed && !active && styles.tabPressed,
      ]}
    >
      <Text style={[styles.text, active && styles.textActive]}>{name}</Text>
      {/* Ligne verte de soulignement pour l'onglet actif */}
      {active && <View style={styles.activeIndicator} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  tabPressed: {
    opacity: 0.6,
  },
  text: {
    fontFamily: fonts.poppinsMedium,
    fontSize: 14,
    color: colors.textSecondary, // Lisible sur fond blanc
  },
  textActive: {
    fontFamily: fonts.poppinsSemiBold,
    fontSize: 14.5,
    color: colors.primaryDark,
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.primaryDark,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});