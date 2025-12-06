import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // İkonlar için

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'tomato', headerShown: false }}>
      {/* Ana Sayfa Sekmesi */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({ color }) => <Ionicons name="timer-outline" size={24} color={color} />,
        }}
      />
      {/* Raporlar Sekmesi */}
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Raporlar',
          tabBarIcon: ({ color }) => <Ionicons name="bar-chart-outline" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}