// src/components/books/BookCard.js
import { useEffect, useState } from "react";
import { Animated, Pressable, View, Text, Image, StyleSheet } from "react-native";
import { router } from "expo-router";
import { BookOpen } from "lucide-react-native";
import { colors, fonts, typography } from '../../constants/themes';

const SIZES = {
  large: { width: 150, height: 220 },
  medium: { width: 110, height: 165 },
  grid: { width: '100%', height: 200 },
};

const COVER_PALETTE = ['#0B7A45', '#1D6F72', '#B45309', '#088a49', '#3F5D50', '#7A4B12'];

const getCoverColor = (seed) => {
  const value = String(seed || '');
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) % 9973;
  }
  return COVER_PALETTE[hash % COVER_PALETTE.length];
};

const getInitials = (name) => {
  const words = String(name || '')
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
};

function Marquee({ text, style }) {
  const translateX = useState(new Animated.Value(0))[0];
  const [textWidth, setTextWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (textWidth > containerWidth) {
      const distance = textWidth - containerWidth + 20;
      const anim = Animated.loop(
        Animated.sequence([
          Animated.timing(translateX, {
            toValue: -distance,
            duration: distance * 20,
            useNativeDriver: true,
          }),
          Animated.delay(800),
          Animated.timing(translateX, {
            toValue: 0,
            duration: distance * 20,
            useNativeDriver: true,
          }),
          Animated.delay(800),
        ])
      );
      anim.start();
      return () => anim.stop();
    }
  }, [textWidth, containerWidth]);

  return (
    <View
      style={styles.marquee}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <Animated.Text
        style={[style, { transform: [{ translateX }] }, styles.marqueeText]}
        numberOfLines={1}
        onTextLayout={(e) => setTextWidth(e.nativeEvent.lines[0]?.width || 0)}
      >
        {text}
      </Animated.Text>
    </View>
  );
}

export default function BookCard({ name, image, size = 'medium', badge, id, onPress }) {
  const dim = SIZES[size] || SIZES.medium;
  const fluid = typeof dim.width === 'string';
  const iconSize = fluid ? 44 : Math.round(dim.width * 0.3);
  const initialsSize = fluid ? 24 : Math.round(dim.width * 0.17);
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = image != null && !imageFailed;

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    router.push({
      pathname: '/document/[id]',
      params: { id: id || name, name },
    });
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { width: dim.width },
        fluid && styles.fluid,
        pressed && styles.cardPressed,
      ]}
      onPress={handlePress}
    >
      <View style={[styles.cover, { width: dim.width, height: dim.height }]}>
        {showImage ? (
          <Image source={image} style={styles.image} resizeMode="cover" onError={() => setImageFailed(true)} />
        ) : (
          <View style={[styles.fallback, { backgroundColor: getCoverColor(name) }]}>
            <BookOpen size={iconSize} color={colors.surface} strokeWidth={1.5} />
            <Text style={[styles.fallbackInitials, { fontSize: initialsSize }]}>
              {getInitials(name)}
            </Text>
          </View>
        )}
        {badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.info}>
        <Marquee text={name} style={styles.name} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 12,
  },
  fluid: {
    marginRight: 0,
  },
  cardPressed: {
    opacity: 0.75,
  },
  cover: {
    borderRadius: 12,
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  fallback: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 10,
  },
  fallbackInitials: {
    fontFamily: fonts.poppinsBold,
    color: colors.surface,
    opacity: 0.9,
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
  info: {
    marginTop: 6,
  },
  marquee: {
    overflow: 'hidden',
  },
  marqueeText: {
    alignSelf: 'flex-start',
  },
  name: {
    ...typography.subtitle,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
});

