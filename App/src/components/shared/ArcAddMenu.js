import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  BackHandler,
  Easing,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { router } from 'expo-router';
import { AlertCircle, Check, FileUp, MessageSquare, Share2 } from 'lucide-react-native';
import { colors, fonts } from '../../constants/themes';

export const TAB_BAR_HEIGHT = 90;
export const TAB_BAR_PADDING_TOP = 10;

const ARC_CENTER_FROM_BOTTOM = TAB_BAR_HEIGHT;

const FEEDBACK_EMAIL = 'hello@congolibs.space';
const SHARE_MESSAGE =
  "Découvre Congolibs, la bibliothèque partagée de cours, d'annales et de fiches. Télécharge l'application et rejoins la communauté.";

const BOX_W = 440;
const BOX_H = 300;
const CX = 220;
const CY = 220;
const R_OUTER = 155;
const R_INNER = 83;
const GAP_DEG = 3;
const CORNER = 10;
const SEGMENT_SPAN = (180 - GAP_DEG * 2) / 3;
const MID_RADIUS = (R_OUTER + R_INNER) / 2;
const ICON_SIZE = 22;

const EASE = Easing.bezier(0.2, 0.9, 0.25, 1.2);

const polar = (radius, deg) => {
  const rad = (deg * Math.PI) / 180;
  return { x: CX + radius * Math.cos(rad), y: CY + radius * Math.sin(rad) };
};

const sectorPath = (startDeg, endDeg) => {
  const dOuter = (CORNER / R_OUTER) * (180 / Math.PI);
  const dInner = (CORNER / R_INNER) * (180 / Math.PI);
  const outerStart = polar(R_OUTER, startDeg + dOuter);
  const outerEnd = polar(R_OUTER, endDeg - dOuter);
  const innerEnd = polar(R_INNER, endDeg - dInner);
  const innerStart = polar(R_INNER, startDeg + dInner);
  const cornerOuterEnd = polar(R_OUTER, endDeg);
  const cornerInnerStart = polar(R_INNER, startDeg);

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${R_OUTER} ${R_OUTER} 0 0 1 ${outerEnd.x} ${outerEnd.y}`,
    `Q ${cornerOuterEnd.x} ${cornerOuterEnd.y} ${innerEnd.x} ${innerEnd.y}`,
    `A ${R_INNER} ${R_INNER} 0 0 0 ${innerStart.x} ${innerStart.y}`,
    `Q ${cornerInnerStart.x} ${cornerInnerStart.y} ${outerStart.x} ${outerStart.y}`,
    'Z',
  ].join(' ');
};

const SEGMENTS = [
  { id: 'add', color: colors.arc.add, Icon: FileUp, label: 'Ajouter un document' },
  { id: 'feedback', color: colors.arc.feedback, Icon: MessageSquare, label: 'Envoyer un feedback' },
  { id: 'share', color: colors.arc.share, Icon: Share2, label: "Partager l'application" },
].map((segment, index) => {
  const start = 180 + index * (SEGMENT_SPAN + GAP_DEG);
  const end = start + SEGMENT_SPAN;
  const mid = (start + end) / 2;
  return {
    ...segment,
    mid,
    d: sectorPath(start, end),
    center: polar(MID_RADIUS, mid),
    hitWidth: 2 * MID_RADIUS * Math.sin(((SEGMENT_SPAN / 2) * Math.PI) / 180) + 4,
    hitHeight: R_OUTER - R_INNER - 6,
  };
});

export default function ArcAddMenu({ open = false, onRequestClose }) {
  const { width: screenWidth } = useWindowDimensions();
  const [toast, setToast] = useState(null);
  const [pressed, setPressed] = useState(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [sending, setSending] = useState(false);

  const progress = useRef(SEGMENTS.map(() => new Animated.Value(0))).current;
  const toastProgress = useRef(new Animated.Value(0)).current;
  const toastTimer = useRef(null);

  const menuWidth = Math.min(screenWidth * 0.92, BOX_W);
  const scale = menuWidth / BOX_W;
  const menuHeight = menuWidth * (BOX_H / BOX_W);
  const centerY = menuHeight * (CY / BOX_H);
  const menuBottom = ARC_CENTER_FROM_BOTTOM - (menuHeight - centerY);

  useEffect(() => {
    const segmentAnimations = progress.map((value) =>
      Animated.timing(value, {
        toValue: open ? 1 : 0,
        duration: open ? 620 : 220,
        easing: open ? EASE : Easing.in(Easing.quad),
        useNativeDriver: true,
      })
    );

    if (open) {
      Animated.stagger(90, segmentAnimations).start();
    } else {
      Animated.parallel(segmentAnimations).start();
    }
  }, [open, progress]);

  useEffect(() => {
    if (Platform.OS === 'web') return undefined;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!open) return false;
      onRequestClose?.();
      return true;
    });
    return () => subscription.remove();
  }, [open, onRequestClose]);

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    []
  );

  const showToast = useCallback((message, tone = 'success') => {
    setToast({ message, tone });
    toastProgress.setValue(0);
    Animated.timing(toastProgress, {
      toValue: 1,
      duration: 240,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      Animated.timing(toastProgress, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setToast(null);
      });
    }, 2400);
  }, [toastProgress]);

  const handleAdd = useCallback(() => {
    onRequestClose?.();
    router.navigate('/add');
  }, [onRequestClose]);

  const handleFeedback = useCallback(() => {
    onRequestClose?.();
    setFeedbackText('');
    setFeedbackOpen(true);
  }, [onRequestClose]);

  const sendFeedback = useCallback(async () => {
    const message = feedbackText.trim();
    if (!message) {
      showToast('Écris ton message avant d’envoyer', 'error');
      return;
    }
    setSending(true);
    const url = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(
      'Feedback Congolibs'
    )}&body=${encodeURIComponent(message)}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        showToast("Aucune application d'e-mail n'est installée", 'error');
        return;
      }
      await Linking.openURL(url);
      setFeedbackOpen(false);
      setFeedbackText('');
      showToast('Merci, ton message est prêt à partir');
    } catch (e) {
      showToast("Impossible d'ouvrir l'application mail", 'error');
    } finally {
      setSending(false);
    }
  }, [feedbackText, showToast]);

  const handleShare = useCallback(() => {
    Share.share({ message: SHARE_MESSAGE }, { dialogTitle: 'Partager Congolibs' })
      .then((result) => {
        if (result.action === Share.sharedAction) {
          showToast("C'est parti, merci !");
        }
      })
      .catch(() => {
        showToast('Partage impossible', 'error');
      });
  }, [showToast]);

  const ACTIONS = { add: handleAdd, feedback: handleFeedback, share: handleShare };

  const ACCESSIBILITY_ACTIONS = [
    { name: 'add', label: 'Ajouter un document' },
    { name: 'feedback', label: 'Envoyer un feedback' },
    { name: 'share', label: "Partager l'application" },
  ];

  // Hit-test par coordonnées : les secteurs sont dessinés dans des vues
  // transformées (rotate/scale/transformOrigin) dont le hit-test natif est
  // peu fiable. On calcule donc l'angle et le rayon du tap directement.
  const hitTest = (x, y) => {
    const dx = x - CX * scale;
    const dy = y - CY * scale;
    if (dy > 0) return null; // sous la ligne de diamètre
    const radius = Math.sqrt(dx * dx + dy * dy);
    if (radius < R_INNER * scale || radius > R_OUTER * scale) return null;
    let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    if (angle < 0) angle += 360;
    if (angle < 180 || angle > 360) return null;
    const index = Math.min(2, Math.floor((angle - 180) / (SEGMENT_SPAN + GAP_DEG)));
    return SEGMENTS[index]?.id ?? null;
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {open && (
        <Pressable
          style={styles.backdrop}
          onPress={() => onRequestClose?.()}
          accessibilityRole="button"
          accessibilityLabel="Fermer le menu"
        />
      )}

      <View
        pointerEvents={open ? 'box-none' : 'none'}
        style={[
          styles.menu,
          {
            left: (screenWidth - menuWidth) / 2,
            width: menuWidth,
            height: menuHeight,
            bottom: menuBottom,
          },
        ]}
      >
        {SEGMENTS.map((segment, index) => (
          <Animated.View
            key={segment.id}
            pointerEvents="box-none"
            style={[
              StyleSheet.absoluteFill,
              { transformOrigin: [CX * scale, CY * scale, 0] },
              {
                opacity: progress[index],
                transform: [
                  {
                    rotate: progress[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: ['180deg', '0deg'],
                    }),
                  },
                  {
                    scale: progress[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.45, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <Svg
              pointerEvents="none"
              style={styles.segmentSvg}
              width={menuWidth}
              height={menuHeight}
              viewBox={`0 0 ${BOX_W} ${BOX_H}`}
            >
              <Path d={segment.d} fill={segment.color} opacity={pressed === index ? 0.75 : 1} />
            </Svg>

            <View
              pointerEvents="none"
              style={[
                styles.segmentIcon,
                {
                  left: (segment.center.x - ICON_SIZE / 2) * scale,
                  top: (segment.center.y - ICON_SIZE / 2) * scale,
                  width: ICON_SIZE * scale,
                  height: ICON_SIZE * scale,
                },
              ]}
            >
              <segment.Icon
                size={ICON_SIZE * scale}
                color={colors.surface}
                strokeWidth={2.4}
              />
            </View>
          </Animated.View>
        ))}

        {/* Zone tactile unique : hit-test sur les secteurs (les vues
            transformées ci-dessus ne sont pas cliquables de façon fiable). */}
        <Pressable
          style={StyleSheet.absoluteFill}
          onPressIn={(e) => setPressed(hitTest(e.nativeEvent.locationX, e.nativeEvent.locationY))}
          onPressOut={() => setPressed(null)}
          onPress={(e) => {
            const id = hitTest(e.nativeEvent.locationX, e.nativeEvent.locationY);
            if (id) ACTIONS[id]?.();
          }}
          accessibilityLabel="Menu d'ajout"
          accessibilityActions={ACCESSIBILITY_ACTIONS}
          onAccessibilityAction={(e) => ACTIONS[e.nativeEvent.actionName]?.()}
        />
      </View>

      {/* Modale de feedback */}
      <Modal
        visible={feedbackOpen}
        transparent
        animationType="fade"
        onRequestClose={() => (sending ? null : setFeedbackOpen(false))}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => (sending ? null : setFeedbackOpen(false))}
          />

          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIcon}>
                <MessageSquare size={18} color={colors.surface} />
              </View>
              <View style={styles.modalHeaderTexts}>
                <Text style={styles.modalTitle}>Envoyer un feedback</Text>
                <Text style={styles.modalSubtitle}>{FEEDBACK_EMAIL}</Text>
              </View>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Qu’est-ce qui pourrait être amélioré ?"
              placeholderTextColor={colors.textSecondary}
              value={feedbackText}
              onChangeText={setFeedbackText}
              multiline
              textAlignVertical="top"
              maxLength={800}
              editable={!sending}
            />

            <View style={styles.modalActions}>
              <Pressable
                style={({ pressed }) => [
                  styles.modalCancel,
                  pressed && styles.pressed,
                ]}
                onPress={() => setFeedbackOpen(false)}
                disabled={sending}
              >
                <Text style={styles.modalCancelText}>Annuler</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.modalSend,
                  pressed && styles.pressed,
                  sending && styles.modalSendDisabled,
                ]}
                onPress={sendFeedback}
                disabled={sending}
              >
                <Text style={styles.modalSendText}>
                  {sending ? 'Envoi...' : 'Envoyer'}
                </Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {toast !== null && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.toast,
            {
              bottom: TAB_BAR_HEIGHT + 16,
              opacity: toastProgress,
              transform: [
                {
                  translateY: toastProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [14, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {toast.tone === 'error' ? (
            <AlertCircle size={16} color={colors.danger} strokeWidth={2.6} />
          ) : (
            <Check size={16} color={colors.primary} strokeWidth={3} />
          )}
          <Text style={styles.toastText}>{toast.message}</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: TAB_BAR_HEIGHT,
  },
  segmentSvg: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  segmentIcon: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toast: {
    position: 'absolute',
    left: 24,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: colors.text,
    elevation: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.24,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
  toastText: {
    fontFamily: fonts.poppinsMedium,
    fontSize: 12.5,
    lineHeight: 17,
    color: colors.surface,
    marginLeft: 8,
    flexShrink: 1,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.75,
  },

  // Modale de feedback
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(6, 10, 13, 0.55)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    gap: 14,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeaderTexts: {
    flex: 1,
  },
  modalTitle: {
    fontFamily: fonts.poppinsSemiBold,
    fontSize: 16,
    color: colors.text,
  },
  modalSubtitle: {
    fontFamily: fonts.inter,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  modalInput: {
    minHeight: 110,
    maxHeight: 180,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fonts.inter,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  modalCancel: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    fontFamily: fonts.poppinsSemiBold,
    fontSize: 14,
    color: colors.text,
  },
  modalSend: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: colors.primaryDark,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalSendDisabled: {
    opacity: 0.6,
  },
  modalSendText: {
    fontFamily: fonts.poppinsSemiBold,
    fontSize: 14,
    color: colors.surface,
  },
});
