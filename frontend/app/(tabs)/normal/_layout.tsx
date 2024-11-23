// Exemplo de TabLayout para o usuário normal
import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { UserProvider } from '@/components/UserContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayoutNormal() {
  return (
    <UserProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#559555',
          headerShown: false,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="favoritos"
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'heart' : 'heart-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="cupons"
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'ticket' : 'ticket-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="perfil"
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons name={focused ? 'account' : 'account-outline'} size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </UserProvider>
  );
}
