import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cnpj } from 'cpf-cnpj-validator';
import validator from 'validator';
import * as ImagePicker from 'react-native-image-picker';
import { EmpresaParceira } from '../services/models/empresaParceira';
import { EmpresaParceiraService } from '../services/empresaParceiraService';
import Alert from '@/components/Alert';

export default function CadastroEmpresa() {
  const [nome, setNome] = useState('');
  const [cnpjInput, setCnpjInput] = useState('');
  const [email, setEmail] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [cnpjValido, setCnpjValido] = useState(true);
  const [emailError, setEmailError] = useState('');

  const validarCNPJ = (cnpjInput: string) => {
    setCnpjValido(true);

    if (cnpjInput) {
      setCnpjValido(cnpj.isValid(cnpjInput)); // Atualiza o estado de CNPJ válido
    }
  };

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

  const handleSelectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
      });

      if (result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setSelectedImage(uri!);
      }
    } catch (error) {
      setShowAlert(true);
      setAlertMessage('Não foi possível selecionar a imagem.');
    }
  };

  const cadastrarEmpresaParceira = async () => {
    if (!nome || !cnpj || !email) {
      setShowAlert(true);
      setAlertMessage('Por favor, preencha todos os campos.');
      return;
    }
    
    if (!cnpjValido) {
      setShowAlert(true);
      setAlertMessage('Por favor, preencha um CNPJ válido.');
      return;
    }
    
    if (emailError) {
      setShowAlert(true);
      setAlertMessage('Por favor, preencha um e-mail válido.');
      return;
    }

    if (!selectedImage) {
      setShowAlert(true);
      setAlertMessage('Por favor, Selecione uma foto');
      return;
    }

    try {
      const empresaParceira = {
        nome: nome,
        cnpj: cnpjInput,
        email: email,
        logoPath: selectedImage
      } as EmpresaParceira;

      const response = await EmpresaParceiraService.criarEmpresaParceira(empresaParceira);

      if (response) {
        setShowAlert(true);
        setAlertMessage(response.message);
      }
    } catch (error: any) {
      console.error("Erro ao cadastrar empresa parceira:", error);

      if (error.response && error.response.data && error.response.data.message) {
        setShowAlert(true);
        setAlertMessage(error.response.data.message);
      } else {
        setShowAlert(true);
        setAlertMessage('Erro inesperado ao cadastrar empresa parceira');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Cadastro de Empresa</Text>

      <View>
        <TouchableOpacity style={styles.imageButton} onPress={handleSelectImage}>
            {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.image} />
            ) : (
            <MaterialCommunityIcons name="camera" size={48} color="black" />
            )}
        </TouchableOpacity>
        <Text style={styles.imagePlaceholder}>LOGO EMPRESA</Text>
      </View>

      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="account" size={24} style={styles.icon} />
        <TextInput
          placeholder="Informe o nome"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
        />
      </View>

      <View style={[styles.inputContainer, !cnpjValido && styles.invalidInput]}>
        <MaterialCommunityIcons name="card-account-details" size={24} style={styles.icon} />
        <TextInput
          placeholder="Informe o CNPJ"
          value={cnpjInput}
          onChangeText={(text) => {
            const textoFormatado = formatarCNPJ(text);
            setCnpjInput(textoFormatado);
            validarCNPJ(textoFormatado);
          }}
          keyboardType="numeric"
          maxLength={18}
          style={styles.input}
        />
      </View>

      {!cnpjValido && cnpjInput.length !== 0 && <Text style={styles.errorText}>CNPJ inválido</Text>}
      
      <View style={[styles.inputContainer, emailError.length > 0 && styles.invalidInput]}>
        <MaterialCommunityIcons name="email" size={24} style={styles.icon} />
        <TextInput
          placeholder="Informe o e-mail"
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

      <TouchableOpacity style={styles.button} onPress={cadastrarEmpresaParceira}>
        <Text style={styles.buttonText}>CADASTRAR</Text>
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
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  imageButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: 100,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 18
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
    borderRadius: 30,
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});
