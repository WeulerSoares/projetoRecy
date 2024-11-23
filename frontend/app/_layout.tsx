import React, { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useUser } from '@/components/UserContext';
import { TipoUsuario } from './(tabs)/services/enums/tipoUsuario';

export default function RootLayout() {
  const user = useUser();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (!user) {
        router.replace('/login');
      } else if (user.tipoUsuario === TipoUsuario.Coletor) {
        router.replace('/(tabs)/normal');
      } else if (user.tipoUsuario === TipoUsuario.PontoColeta) {
        router.replace('/(tabs)/pontoColeta');
      } else {
        router.replace('/(tabs)/admin');
      }
    }
  }, [user, isMounted]);

  if (!isMounted) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)/normal" options={{ headerShown: false}} />
      <Stack.Screen name="(tabs)/pontoColeta" options={{ headerShown: false}} />
      <Stack.Screen name="(tabs)/admin" />
      <Stack.Screen name="login" />
      <Stack.Screen name="cadastroUsuario" />
    </Stack>
  );
}
