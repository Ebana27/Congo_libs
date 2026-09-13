import { memo } from 'react';
import { Tabs } from 'expo-router';
import { BookOpen, Compass, Home, Plus, User, PlusCircle } from 'lucide-react-native';
import Header from '../../src/components/shared/Header';
import { colors } from '../../src/constants/themes';
import { Pressable } from 'react-native';

const TITLES = {
  index: 'CONGOLIBS',
  library: 'Bibliothèque',
  discovery: 'Découverte',
  profil: 'Profil',
};

const HomeIcon = memo(({ color, size }) => <Home color={color} size={size} />);
const BookOpenIcon = memo(({ color, size }) => <BookOpen color={color} size={size} />);
const PlusIcon = memo(({ color, size }) => <PlusCircle color={color} size={size} />);
const CompassIcon = memo(({ color, size }) => <Compass color={color} size={size} />);
const UserIcon = memo(({ color, size }) => <User color={color} size={size} />);

export default function TabsLayout() {
  return (
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
          height: 90,
          paddingTop: 10,
          borderColor: "transparent",
          elevation: 0,
        },
        tabBarButton: (props) => (
          <Pressable
            {...props}
            android_ripple={null}
            style={[props.style, ({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })]}
          />
        ),
        tabBarShowLabel: true, // Garder les textes globalement
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Poppins-SemiBold',
        },
        // Masque le texte sur Android/iOS si l'onglet n'est pas actif (option native de React Navigation)
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
          tabBarIcon: ({ color, size }) => <PlusIcon color={color} size={size} />,
        }}
        listeners={{
          tabPress: (e) => {
            // Le "+" n'ouvre pas un écran, il déclenchera la bottom sheet
            e.preventDefault();
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
  );
}
