import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Button } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import validator from 'validator';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { useRouter } from 'expo-router';
import { UsuarioService } from './(tabs)/services/usuarioService';
import { TipoUsuario } from './(tabs)/services/enums/tipoUsuario';
import Alert from '@/components/Alert';

export default function App() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [emailError, setEmailError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const router = useRouter();

  const validateEmail = (emailInput: string) => {
    setEmailError('');

    if (emailInput.length === 0 || validator.isEmail(emailInput)) {
      setEmailError('');
    } else {
      setEmailError('E-mail inválido');
    }
  };

  // Função para cadastrar o usuário
  const logarUsuario = async () => {
    // Verifique se todos os campos estão preenchidos e válidos
    if (!email || !senha) {
      setShowAlert(true);
      setAlertMessage('Por favor, preencha todos os campos.');
      return;
    }
    
    const auth = getAuth();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      console.log('Usuário logado com sucesso:', userCredential.user);

      const response = await UsuarioService.getUsuario(userCredential.user.uid);
      
      if (response.tipoUsuario === TipoUsuario.Coletor) {
        router.replace('/(tabs)/normal');
      } else if (response.tipoUsuario === TipoUsuario.PontoColeta) {
        router.replace('/(tabs)/pontoColeta');
      } else {
        router.replace('/(tabs)/admin');
      }



    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/invalid-email':
            setShowAlert(true);
            setAlertMessage('E-mail inválido.');
            break;
          case 'auth/user-not-found':
            setShowAlert(true);
            setAlertMessage('Usuário não encontrado.');
            break;
          case 'auth/wrong-password':
            setShowAlert(true);
            setAlertMessage('Senha incorreta.');
            break;
          case 'auth/invalid-credential':
            setShowAlert(true);
            setAlertMessage('Usuário não encontrado.');
            break;
          default:
            setShowAlert(true);
            setAlertMessage('Não foi possível fazer o login. Tente novamente.');
        }
      } else {
        console.error("Erro ao logar com usuário:", error);
        setShowAlert(true);
        setAlertMessage('Erro de conexão. Tente novamente mais tarde.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image 
      source={require("../assets/images/lixo_dinheiro.png")} 
      style={styles.logo} />

      <View style={[styles.inputContainer, emailError.length > 0 && styles.invalidInput]}>
        <MaterialCommunityIcons name="email" size={24} style={styles.icon} />
        <TextInput
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            validateEmail(text);
          }}
          keyboardType="email-address"
          style={styles.input}
        />
      </View>

      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="lock" size={24} style={styles.icon} />
        <TextInput
          placeholder="Digite sua senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          style={styles.input}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={logarUsuario}>
        <Text style={styles.buttonText}>ENTRAR</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.loginText} onPress={() => router.push('/cadastroUsuario')} >
          Ainda não possui uma conta? <Text style={{ fontWeight: 'bold' }}>Cadastre-se</Text>
        </Text>
      </TouchableOpacity>
      
      {showAlert && (
        <Alert
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6dc06d',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 170,
    height: 170,
    marginBottom: 30,
  },
  radioGroup: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  radioOuterCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInnerCircle: {
    height: 14,
    width: 14,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioLabel: {
    marginLeft: 5,
    fontSize: 16,
    color: '#333',
    fontWeight: '600'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8FFB8F',
    borderRadius: 30,
    paddingHorizontal: 15,
    marginVertical: 8,
    width: '100%',

    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,

    // Sombra para Android
    elevation: 5,
  },
  icon: {
    marginRight: 10,
    color: '#558C40'
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#558C40',
    fontWeight: 'bold'
  },
  invalidInput: {
    borderColor: 'red',
    borderWidth: 2,
  },
  button: {
    backgroundColor: '#559555',
    borderRadius: 30,
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
  loginText: {
    marginTop: 15,
    fontSize: 16,
    color: '#366923',
    fontWeight: '500',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});
