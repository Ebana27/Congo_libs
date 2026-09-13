import { useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, typography, fonts } from '../../src/constants/themes';
import {
  BookStackIcon,
  SearchDownloadIcon,
  GlobeBookIcon,
} from '../../src/components/onboarding/OnboardingIllustrations';

const ONBOARDING_DONE_KEY = 'congolibs_onboarding_done';

const SLIDES = [
  {
    key: '1',
    Icon: BookStackIcon,
    title: 'Ta bibliothèque, dans ta poche',
    text: 'Congolibs rassemble livres, annales du bac et sujets de concours dans une seule application, pensée pour les élèves et les étudiants.',
  },
  {
    key: '2',
    Icon: SearchDownloadIcon,
    title: 'Cherche, découvre, télécharge',
    text: 'Retrouve tes matières grâce à une recherche simple. Télécharge tes documents et consulte-les même sans connexion.',
  },
  {
    key: '3',
    Icon: GlobeBookIcon,
    title: 'Ton savoir, partout avec toi',
    text: 'Révise en classe, à la maison ou en déplacement. Tes favoris et tes téléchargements te suivent sur tous tes appareils.',
  },
];

export default function OnboardingIntro() {
  const { width } = useWindowDimensions();
  const listRef = useRef(null);
  const [index, setIndex] = useState(0);

  const finish = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_DONE_KEY, '1');
    } catch (e) {}
    router.replace('/auth/login');
  };

  const slide = SLIDES[index];
  const Icon = slide.Icon;
  const isLast = index === SLIDES.length - 1;

  const onMomentumScrollEnd = (e) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(Math.max(0, Math.min(SLIDES.length - 1, newIndex)));
  };

  const goNext = () => {
    if (isLast) {
      finish();
      return;
    }
    listRef.current?.scrollToOffset({
      offset: (index + 1) * width,
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />

      <Pressable onPress={finish} style={styles.skip} hitSlop={10}>
        <Text style={styles.skipText}>Passer</Text>
      </Pressable>

      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        renderItem={({ item }) => {
          const IconCmp = item.Icon;
          return (
            <View style={[styles.slide, { width }]}>
              <View style={styles.art}>
                <IconCmp />
              </View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.text}>{item.text}</Text>
            </View>
          );
        }}
      />

      <View style={styles.dots}>
        {SLIDES.map((s, i) => (
          <View key={s.key} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>

      <Pressable
        style={({ pressed }) => [styles.nextButton, pressed && styles.pressed]}
        onPress={goNext}
      >
        <Text style={styles.nextText}>{isLast ? 'Commencer' : 'Suivant'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  skip: {
    position: 'absolute',
    top: 62,
    right: 24,
    zIndex: 2,
  },
  skipText: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  art: {
    marginBottom: 44,
  },
  title: {
    ...typography.title,
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 12,
  },
  text: {
    ...typography.body,
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 28,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.border,
  },
  dotActive: {
    width: 26,
    backgroundColor: colors.primaryDark,
  },
  nextButton: {
    backgroundColor: colors.primaryDark,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 40,
    marginBottom: 44,
  },
  nextText: {
    ...typography.button,
    fontSize: 16,
  },
  pressed: {
    opacity: 0.7,
  },
});