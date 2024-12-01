import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { UserProvider } from '@/components/UserContext';

export default function TabLayoutPontoColeta() {
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
            headerShown: false,
            tabBarLabel: '',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'trash' : 'trash-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="collectionType"
          options={{
            headerShown: false,
            tabBarLabel: '',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'albums' : 'albums-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="registers"
          options={{
            headerShown: false,
            tabBarLabel: '',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'list' : 'list-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="opcoesPerfil"
          options={{
            headerShown: false,
            tabBarLabel: '',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
            ),
          }}
        />
      </Tabs>
    </UserProvider>
  );
}