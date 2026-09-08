// src/components/ErrorModal.js
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { AlertCircle } from "lucide-react-native";
import { colors, typography } from "../constants/themes";

export default function ErrorModal({
  visible,
  message,
  title = "Erreur",
  buttonText = "Fermer",
  onClose,
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconBadge}>
            <AlertCircle size={30} color={colors.danger} />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(6, 10, 13, 0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  card: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: colors.surface,
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  iconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#ffe9e4",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    ...typography.title,
    fontSize: 20,
    color: colors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    ...typography.body,
    fontSize: 15,
    textAlign: "center",
    color: colors.textSecondary,
    marginBottom: 24,
  },
  button: {
    width: "100%",
    backgroundColor: colors.danger,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    ...typography.button,
  },
});