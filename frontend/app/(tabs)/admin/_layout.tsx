// Exemplo de TabLayout para o usuário normal
import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { UserProvider } from '@/components/UserContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayoutAdmin() {
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
              <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
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
