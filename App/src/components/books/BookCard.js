// src/components/books/BookCard.js
import { useEffect, useState } from "react";
import { Animated, Pressable, View, Text, Image, StyleSheet } from "react-native";
import { router } from "expo-router";
import { colors, typography } from '../../constants/themes';

const SIZES = {
  large: { width: 150, height: 220 },
  medium: { width: 110, height: 165 },
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

export default function BookCard({ name, txt, image, size = 'medium', badge, id, onPress }) {
  const dim = SIZES[size] || SIZES.medium;
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = image != null && !imageFailed;

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    router.push({
      pathname: '/document/[id]',
      params: { id: id || name, name, txt },
    });
  };

  return (
    <Pressable style={({ pressed }) => [styles.container, { width: dim.width }, pressed && styles.cardPressed]} onPress={handlePress}>
      <View style={[styles.cover, { width: dim.width, height: dim.height }]}>
        {showImage ? (
          <Image source={image} style={styles.image} resizeMode="cover" onError={() => setImageFailed(true)} />
        ) : (
          <View style={styles.fallback} />
        )}
        {badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.info}>
        <Marquee text={name} style={styles.name} />
        {txt ? <Text style={styles.txt} numberOfLines={1}>{txt}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 12,
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
    backgroundColor: colors.primaryLight,
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
    ...typography.caption,
    fontSize: 13,
    color: colors.text,
  },
  txt: {
    ...typography.caption,
    fontSize: 12,
    marginTop: 2,
  },
});

