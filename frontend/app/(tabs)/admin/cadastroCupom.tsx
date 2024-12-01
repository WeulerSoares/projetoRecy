import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { EmpresaParceiraService } from '../services/empresaParceiraService';
import { EmpresaParceira } from '../services/models/empresaParceira';
import { Picker } from '@react-native-picker/picker';
import { Cupom } from '../services/models/cupom';
import { CupomService } from '../services/cupomService';
import Alert from '@/components/Alert';

export default function CadastroCupom() {
  const [empresas, setEmpresas] = useState<EmpresaParceira[]>([]);
  const [empresaSelecionada, setEmpresaSelecionada] = useState<string | undefined>();
  const [pontos, setPontos] = useState('');
  const [valor, setValor] = useState('');
  const [quantidade, setQuantidade] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const formatarPontos = (pontos: string) => {
    return pontos.replace(/\D/g, '');
  };
  
  const formatarValor = (valor: string) => {
    return valor.replace(/\D/g, '');
  };

  useEffect(() => {
    // Buscar empresas ao carregar o componente
    const carregarEmpresas = async () => {
      try {
        const dados = await EmpresaParceiraService.obterEmpresas();
        setEmpresas(dados);
      } catch (error) {
        console.error("Erro ao carregar empresas:", error);
      }
    };
    
    carregarEmpresas();
  }, []);

  const cadastrarCupom = async () => {
    if (!empresaSelecionada || !pontos || !valor || !quantidade) {
      setShowAlert(true);
      setAlertMessage('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const cupom = {
        idEmpresa: Number(empresaSelecionada),
        valor: Number(valor),
        quantidade: quantidade,
        pontos: Number(pontos)
      } as Cupom;

      const response = await CupomService.criarCupom(cupom);

      if (response) {
        setShowAlert(true);
        setAlertMessage(response.message);
      } else {
        setShowAlert(true);
        setAlertMessage('Erro ao criar cupom');
      }
    } catch (error) {
      console.error("Erro ao criar cupom:", error);
      setShowAlert(true);
      setAlertMessage('Erro de conexão. Tente novamente mais tarde.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Cadastro Cupons</Text>
      
      <View style={styles.inputContainer}>
      <MaterialCommunityIcons name="domain" size={24} style={styles.icon} />
        <Picker
          style={styles.input}
          selectedValue={empresaSelecionada}
          onValueChange={(itemValue) => setEmpresaSelecionada(itemValue)}
        >
          <Picker.Item label="Selecione uma empresa" value="" />
          {empresas.map((empresa) => (
              <Picker.Item key={empresa.idEmpresa} label={empresa.nome} value={empresa.idEmpresa} />
          ))}
        </Picker>
      </View>
        
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="alpha-p-box-outline" size={24} style={styles.icon} />
        <TextInput
          placeholder="Informe os pontos"
          value={pontos}
          onChangeText={(text) => {
            const textoFormatado = formatarPontos(text);
            setPontos(textoFormatado);  
          }}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome 
          name="money" 
          size={20} 
          color="black" 
          style={styles.icon} />
        <TextInput
          placeholder="Informe o valor total"
          value={valor}
          onChangeText={(text) => {
            const textoFormatado = formatarValor(text)
            setValor(textoFormatado);
          }}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>

      <Text style={styles.sliderLabel}>Quantidade x Valor</Text>
      <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={100}
          step={1}
          minimumTrackTintColor="#8FFB8F" // Cor da barra ativa
          maximumTrackTintColor="#d3d3d3" // Cor da barra inativa
          thumbTintColor="#8FFB8F" // Cor do "ponto" deslizante
          value={quantidade}
          onValueChange={(value) => setQuantidade(value)}
      />

      <Text style={styles.sliderValue}>{quantidade} cupons de {(Number(valor) / quantidade) | 0} reais</Text>

      <TouchableOpacity style={styles.button} onPress={cadastrarCupom}>
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
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#558C40',
    backgroundColor: '#8FFB8F',
    fontWeight: 'bold'
  },
  sliderLabel: {
    color: 'white',
    marginTop: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderValue: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
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
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
},
});
