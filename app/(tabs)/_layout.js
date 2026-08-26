import { Tabs } from 'expo-router';
import { Home, LibraryIcon } from 'lucide-react-native';
import { COLOR } from '../../src/constants/themes';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: COLOR.primary, headerShown: false }}>
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
          tabBarIcon: ({ color, size }) => <LibraryIcon color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
