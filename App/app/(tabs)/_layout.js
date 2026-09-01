import { Tabs } from 'expo-router';
import { BookOpen, Home, User } from 'lucide-react-native';
import Header from '../../src/components/Header';
import { colors } from '../../src/constants/themes';

const TITLES = {
  index: 'Congolibs',
  library: 'Bibliothèque',
  profil: 'Profil',
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        header: ({ route }) => <Header title={TITLES[route.name] || 'Congolibs'} />,
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Bibliothèque',
          tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}