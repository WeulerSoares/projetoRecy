import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import validator from 'validator';
import { getAuth, createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { UsuarioService } from './(tabs)/services/usuarioService';
import { Usuario } from './(tabs)/services/models/usuario';
import { FirebaseError } from 'firebase/app';
import { useRouter } from 'expo-router';
import { TipoUsuario } from './(tabs)/services/enums/tipoUsuario';
import Alert from '@/components/Alert';

interface CustomRadioButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  selectedColor?: string;
  unselectedColor?: string;
  labelColor?: string;
}

const CustomRadioButton: React.FC<CustomRadioButtonProps> = ({
  label,
  selected,
  onPress,
  selectedColor = '#4CAF50', // Cor quando selecionado
  unselectedColor = '#B5B5B5', // Cor quando não selecionado
  labelColor = '#333', // Cor do texto
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.radioContainer}>
      <View
        style={[
          styles.radioOuterCircle,
          { borderColor: selected ? selectedColor : unselectedColor },
        ]}
      >
        {selected && <View style={[styles.radioInnerCircle, { backgroundColor: selectedColor }]} />}
      </View>
      <Text style={[styles.radioLabel, { color: labelColor }]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default function App() {
  const [nome, setNome] = useState('');
  const [cpfInput, setCpfInput] = useState('');
  const [cnpjInput, setCnpjInput] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState(TipoUsuario.Coletor);

  const [cpfValido, setCpfValido] = useState(true);
  const [cnpjValido, setCnpjValido] = useState(true);
  const [emailError, setEmailError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const router = useRouter();

  const validarCPF = (cpfInput: string) => {
    setCpfValido(true);

    if (cpfInput) {
      setCpfValido(cpf.isValid(cpfInput));
    }
  };

  const validarCNPJ = (cnpjInput: string) => {
    setCnpjValido(true);

    if (cnpjInput) {
      setCnpjValido(cnpj.isValid(cnpjInput));
    }
  };

  const formatarCPF = (cpfInput: string) => {
    return cpfInput
      .replace(/\D/g, '') // Remove tudo que não é número
      .replace(/(\d{3})(\d)/, '$1.$2') // Coloca ponto
      .replace(/(\d{3})(\d)/, '$1.$2') // Coloca ponto
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Coloca hífen
  };

  // Função para formatar CNPJ
  const formatarCNPJ = (cnpjInput: string) => {
    return cnpjInput
      .replace(/\D/g, '') // Remove tudo que não é número
      .replace(/(\d{2})(\d)/, '$1.$2') // Coloca ponto
      .replace(/(\d{3})(\d)/, '$1.$2') // Coloca ponto
      .replace(/(\d{3})(\d)/, '$1/$2') // Coloca barra
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2'); // Coloca hífen
  };

  const validateEmail = (emailInput: string) => {
    setEmailError('');

    if (emailInput.length === 0 || validator.isEmail(emailInput)) {
      setEmailError('');
    } else {
      setEmailError('E-mail inválido');
    }
  };

  const removerMensagemCpfInvalidoCasoEstejaSemValor = (cpfInput: string) => {
    if (cpfInput.length === 0) {
      setCpfValido(true);
    }
  }
  
  const removerMensagemCnpjInvalidoCasoEstejaSemValor = (cnpjInput: string) => {
    if (cnpjInput.length === 0) {
      setCnpjValido(true);
    }
  }

  const cadastrarUsuario = async () => {
    if (!nome || (tipoUsuario === TipoUsuario.Coletor && !cpf) || (tipoUsuario === TipoUsuario.PontoColeta && !cnpj) || !email || !senha) {
      setShowAlert(true);
      setAlertMessage('Por favor, preencha todos os campos.');
      return;
    }

    if (tipoUsuario === TipoUsuario.Coletor && !cpfValido) {
      setShowAlert(true);
      setAlertMessage('Por favor, preencha um CPF válido.');
      return;
    }
    
    if (tipoUsuario === TipoUsuario.PontoColeta && !cnpjValido) {
      setShowAlert(true);
      setAlertMessage('Por favor, preencha um CNPJ válido.');
      return;
    }
    
    if (emailError) {
      setShowAlert(true);
      setAlertMessage('Por favor, preencha um e-mail válido.');
      return;
    }

    const auth = getAuth();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      const usuario = {
        firebaseUid: user.uid,
        nome: nome,
        email: user.email,
        dataNascimento: undefined,
        tipoUsuario: tipoUsuario,
        cpf: cpfInput,
        cnpj: cnpjInput,
      } as Usuario;

      const response = await UsuarioService.criarUsuario(usuario);
      
      if (response) {
        setShowAlert(true);
        setAlertMessage(response.message);
        router.replace('/login');
      } else {
        console.error('Erro ao cadastrar usuário', response);
      }
    } catch (error) {
      const user = auth.currentUser;
      
      if (error instanceof FirebaseError) {
        if (user) {
          await deleteUser(user);
        }

        switch (error.code) {
          case 'auth/email-already-in-use':
            setShowAlert(true);
            setAlertMessage('O e-mail já está em uso.');
            break;
          case 'auth/invalid-email':
            setShowAlert(true);
            setAlertMessage('E-mail inválido.');
            break;
          case 'auth/weak-password':
            setShowAlert(true);
            setAlertMessage('A senha é muito fraca.');
            break;
          default:
            setShowAlert(true);
            setAlertMessage('Erro de autenticação. Tente novamente.');
            console.error("Erro ao cadastrar o usuário:", error.message);
        }
      } else {
        if (user) {
          await deleteUser(user);
        }
        
        console.error("Erro ao cadastrar o usuário:", error);
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
      
      <View style={styles.radioGroup}>
        <CustomRadioButton
          label="Ponto de Coleta"
          selected={tipoUsuario === TipoUsuario.PontoColeta}
          onPress={() => setTipoUsuario(TipoUsuario.PontoColeta)}
          selectedColor="#559555"
          unselectedColor="#559555"
          labelColor="#366923"
        />
        <CustomRadioButton
          label="Reciclador"
          selected={tipoUsuario === TipoUsuario.Coletor}
          onPress={() => setTipoUsuario(TipoUsuario.Coletor)}
          selectedColor="#559555"
          unselectedColor="#559555"
          labelColor="#366923"
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="account" size={24} style={styles.icon} />
        <TextInput
          placeholder="Digite seu nome"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
        />
      </View>

      {tipoUsuario === TipoUsuario.PontoColeta && <View style={[styles.inputContainer, !cnpjValido && styles.invalidInput]}>
        <MaterialCommunityIcons name="card-account-details" size={24} style={styles.icon} />
        <TextInput
          placeholder="Digite seu CNPJ"
          value={cnpjInput}
          onChangeText={(text) => {
            const textoFormatado = formatarCNPJ(text);
            setCnpjInput(textoFormatado);
            validarCNPJ(textoFormatado);
            removerMensagemCnpjInvalidoCasoEstejaSemValor(textoFormatado);
          }}
          keyboardType="numeric"
          maxLength={18}
          style={styles.input}
        />
      </View>}

      {!cnpjValido && cnpjInput.length !== 0 && <Text style={styles.errorText}>CNPJ inválido</Text>}

      {tipoUsuario === TipoUsuario.Coletor && <View style={[styles.inputContainer, !cpfValido && styles.invalidInput]}>
        <MaterialCommunityIcons name="card-account-details" size={24} style={styles.icon} />
        <TextInput
          placeholder="Digite seu CPF"
          value={cpfInput}
          onChangeText={(text) => {
            const textoFormatado = formatarCPF(text);
            setCpfInput(textoFormatado);
            validarCPF(textoFormatado);
            removerMensagemCpfInvalidoCasoEstejaSemValor(textoFormatado);
          }}
          keyboardType="numeric"
          maxLength={14}
          style={styles.input}
        />
      </View>}

      {!cpfValido && cpfInput.length !== 0 && <Text style={styles.errorText}>CPF inválido</Text>}

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

      <TouchableOpacity style={styles.button} onPress={cadastrarUsuario}>
        <Text style={styles.buttonText}>CADASTRAR</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.loginText} onPress={() => router.push('/login')}>
          Já possui uma conta? <Text style={{ fontWeight: 'bold' }}>Faça Login</Text>
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
