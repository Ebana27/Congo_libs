import { View, Text, Image, StyleSheet } from "react-native";
import { colors, typography } from '../../src/constants/themes';

// Dimensions par variante : large = livres populaires, medium = standard (nouveautés, suggestions)
const SIZES = {
  large: { width: 150, height: 220 },
  medium: { width: 110, height: 165 },
};

export default function Card({ name, txt, image, size = 'medium', badge }) {
  const dimensions = SIZES[size] || SIZES.medium;

  return (
    <View style={[styles.container, { width: dimensions.width }]}>
      {/* Cover : occupe la majorité de la card, badge optionnel en overlay */}
      <View style={[styles.coverWrapper, { height: dimensions.height }]}>
        <Image source={image} style={styles.cover} resizeMode="cover" />
        {badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}
      </View>

      {/* Titre + sous-info, tronqués à 2 lignes max */}
      <Text style={styles.name} numberOfLines={2}>{name}</Text>
      {txt ? <Text style={styles.txt} numberOfLines={1}>{txt}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 12,
  },
  coverWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    ...typography.caption,
    fontSize: 11,
  },
  name: {
    ...typography.body,
    fontSize: 14,
    marginTop: 6,
  },
  txt: {
    ...typography.caption,
  },
});