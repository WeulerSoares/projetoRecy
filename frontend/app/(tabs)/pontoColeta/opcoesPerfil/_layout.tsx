import { Stack } from 'expo-router';
import React from 'react';
import { UserProvider } from '@/components/UserContext';

export default function TabLayoutFavoritos() {
  return (
    <UserProvider>
      <Stack screenOptions={{
        headerStyle: {
            backgroundColor: '#559555'
        },
        headerTintColor: '#fff'
      }}>
        <Stack.Screen name="index" options={{ title: "Perfil", headerShown: false }} />
        <Stack.Screen name="profile" options={{ title: "Voltar", headerShown: true }} />
      </Stack>
    </UserProvider>
  );
}
