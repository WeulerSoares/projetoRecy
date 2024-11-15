import React from 'react';
import { Button, Alert } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';

export default function LogoutButton() {
  const router = useRouter();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Redireciona para a tela de login após o logout
      router.replace('/login');
      Alert.alert("Logout", "Você foi desconectado com sucesso.");
    } catch (error) {
      console.error("Erro ao desconectar:", error);
      Alert.alert("Erro", "Não foi possível desconectar. Tente novamente.");
    }
  };

  return (
    <Button title="Logout" onPress={handleLogout} color="#FF3B30" />
  );
}
