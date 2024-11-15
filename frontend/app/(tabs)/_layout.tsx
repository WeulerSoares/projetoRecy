import { Slot, Tabs, useSegments } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const segments = useSegments();

  // Verifica se estamos nas telas de login ou cadastro
  const isAuthRoute = segments[0] === 'cadastroUsuario' || segments[0] === 'login';

  // Se estamos nas telas de login ou cadastro, ocultar as abas
  if (isAuthRoute) {
    return <Slot screenOptions={{headerShown: false}} />; // Slot renderiza a tela atual sem as abas
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'ticket' : 'ticket-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="CadastroCupom"
        options={{
          title: 'Cadastro de Cupom',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'ticket' : 'ticket-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
