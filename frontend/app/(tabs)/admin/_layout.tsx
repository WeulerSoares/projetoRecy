// Exemplo de TabLayout para o usuário normal
import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { UserProvider } from '@/components/UserContext';

export default function TabLayoutAdmin() {
  const colorScheme = useColorScheme();

  return (
    <UserProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            tabBarLabel: '', // Esconde o texto da aba
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="cadastroCupom"
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'ticket' : 'ticket-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="cadastroEmpresa"
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'business' : 'business-outline'} color={color} />
            ),
          }}
        />
      </Tabs>
    </UserProvider>
  );
}
