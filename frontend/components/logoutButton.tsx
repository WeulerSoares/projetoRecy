import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
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
    <TouchableOpacity style={styles.button} onPress={handleLogout}>
      <Text style={styles.buttonText}>SAIR</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#559555',
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
