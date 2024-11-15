import React, { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useUser } from '@/components/UserContext';

export default function RootLayout() {
  const user = useUser();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Marca o componente como montado quando ele for montado pela primeira vez
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Só tenta redirecionar quando o componente está montado e o estado de carregamento está pronto
    if (isMounted) {
      if (!user) {
        router.replace('/login');
      } else {
        router.replace('/(tabs)');
      }
    }
  }, [user, isMounted]);

  if (!isMounted) {
    return null; // Uma tela de carregamento opcional enquanto o estado é resolvido
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="login" />
      <Stack.Screen name="cadastroUsuario" />
    </Stack>
  );
}
