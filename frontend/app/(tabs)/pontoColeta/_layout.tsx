// Exemplo de TabLayout para o usuário normal
import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { UserProvider } from '@/components/UserContext';

export default function TabLayoutPontoColeta() {
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
            headerShown: false,
            tabBarLabel: '', // Esconde o texto da aba
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'trash' : 'trash-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            headerShown: false,
            tabBarLabel: '', // Esconde o texto da aba
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
            ),
          }}
        />
        {/* <Tabs.Screen
          name="collectionRegister"
          options={{
            headerShown: false,
            tabBarLabel: '', // Esconde o texto da aba
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'trash' : 'trash-outline'} color={color} />
            ),
          }}
        /> */}
        <Tabs.Screen
          name="collectionType"
          options={{
            headerShown: false,
            tabBarLabel: '', // Esconde o texto da aba
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'albums' : 'albums-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="registers"
          options={{
            headerShown: false,
            tabBarLabel: '', // Esconde o texto da aba
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'list' : 'list-outline'} color={color} />
            ),
          }}
        />
        {/* <Tabs.Screen
          name="mapTest"
          options={{
            headerShown: false,
            tabBarLabel: '', // Esconde o texto da aba
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'map' : 'map-outline'} color={color} /> 
            ),
          }}
        /> */}
      </Tabs>
    </UserProvider>
  );
}