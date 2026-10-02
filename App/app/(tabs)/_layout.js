import { memo, useEffect, useState } from 'react';
import { Tabs, router } from 'expo-router';
import { BookOpen, Compass, Home, Plus, User, X } from 'lucide-react-native';
import Header from '../../src/components/shared/Header';
import ArcAddMenu, { useTabBarMetrics } from '../../src/components/shared/ArcAddMenu';
import { colors } from '../../src/constants/themes';
import { Pressable, StyleSheet, View } from 'react-native';
import { loadToken } from '../../src/services/api/congolibsAPI';

const TITLES = {
  index: 'CONGOLIBS',
  library: 'Bibliothèque',
  discovery: 'Découverte',
  profil: 'Profil',
};

const HomeIcon = memo(({ color, size }) => <Home color={color} size={size} />);
const BookOpenIcon = memo(({ color, size }) => <BookOpen color={color} size={size} />);
const CompassIcon = memo(({ color, size }) => <Compass color={color} size={size} />);
const UserIcon = memo(({ color, size }) => <User color={color} size={size} />);
// Le "+" se transforme en "X" pour fermer le menu en demi-cercle.
const AddTabIcon = memo(({ open, color, size }) =>
  open ? <X color={color} size={size} /> : <Plus color={color} size={size} />
);

export default function TabsLayout() {
  const [checked, setChecked] = useState(false);
  const [arcOpen, setArcOpen] = useState(false);
  const tabBar = useTabBarMetrics();

  useEffect(() => {
    let mounted = true;
    loadToken().then((token) => {
      if (!mounted) return;
      if (!token) {
        // Sécurité : on ne laisse pas naviguer dans l'app sans session valide.
        router.replace('/auth/login');
        return;
      }
      setChecked(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!checked) {
    return null;
  }

  return (
    <View style={styles.root}>
      <Tabs
        screenOptions={{
          header: ({ route }) => <Header title={TITLES[route.name] || 'Congolibs'} />,
          freezeOnBlur: true,
          sceneStyle: {
            backgroundColor: colors.background,
          },
          tabBarActiveTintColor: colors.primaryDark,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            backgroundColor: colors.surface,
            height: tabBar.height,
            paddingTop: tabBar.paddingTop,
            paddingBottom: tabBar.paddingBottom,
            elevation: 0,
            borderTopWidth: 0.5,
            borderTopColor: "#cdcdcd",
          },
          tabBarButton: (props) => (
            <Pressable
              {...props}
              android_ripple={null}
              style={[props.style, ({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })]}
            />
          ),
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            // 5 onglets sur un petit ecran : 12px tronquait "Bibliotheque".
            fontSize: 10.5,
            fontFamily: 'Poppins-Medium',
            marginTop: 2,
            includeFontPadding: false,
          },
          tabBarIconStyle: {
            marginTop: 0,
            marginBottom: 0,
          },
          // Les marges internes par defaut (5px sur les cotes) etaient
          // comptees dans la largeur de chaque onglet : "Bibliotheque" passait
          // en ellipsis. La lib n'applique tabBarItemStyle qu'apres son style.
          tabBarItemStyle: {
            paddingHorizontal: 2,
            paddingVertical: 4,
          },
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Accueil',
            tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: 'Bibliothèque',
            tabBarIcon: ({ color, size }) => <BookOpenIcon color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: '',
            tabBarAccessibilityLabel: arcOpen
              ? "Fermer le menu d'ajout"
              : "Ouvrir le menu d'ajout",
            tabBarIcon: ({ color, size }) => (
              <AddTabIcon open={arcOpen} color={color} size={size} />
            ),
          }}
          listeners={{
            tabPress: (e) => {
              // Le "+" de la tabbar sert de déclencheur : il ouvre/ferme le menu en demi-cercle
              // au lieu de naviguer vers l'onglet.
              e.preventDefault();
              setArcOpen((value) => !value);
            },
          }}
        />
        <Tabs.Screen
          name="discovery"
          options={{
            title: 'Découverte',
            tabBarIcon: ({ color, size }) => <CompassIcon color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="profil"
          options={{
            title: 'Profil',
            tabBarIcon: ({ color, size }) => <UserIcon color={color} size={size} />,
          }}
        />
      </Tabs>

      <ArcAddMenu open={arcOpen} onRequestClose={() => setArcOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
