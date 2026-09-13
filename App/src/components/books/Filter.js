import { Pressable, Text, StyleSheet } from "react-native";
import { colors, fonts } from "../../constants/themes";

export default function Filter({ name, active = false, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        active && styles.chipActive,
        pressed && !active && styles.chipPressed,
      ]}
    >
      <Text style={[styles.text, active && styles.textActive]}>{name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 38,                    // hauteur fixe → plus de déformation
    paddingHorizontal: 18,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    justifyContent: "center",      // texte centré verticalement
    alignItems: "center",
  },
  chipActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  chipPressed: {
    opacity: 0.7,                  // feedback visuel sans changer la taille
  },
  text: {
    fontFamily: fonts.poppinsSemiBold, // même police dans les 2 états
    fontSize: 13,
    color: colors.text,
    // pas de includeFontPadding: false ici → plus de texte coupé
  },
  textActive: {
    color: colors.surface,
  },
});