import { getCurrentPositionAsync, LocationObject, requestForegroundPermissionsAsync } from 'expo-location';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { PontoColeta } from '../services/models/pontoColeta';
import { useUser } from '@/components/UserContext';
import { PontoColetaService } from '../services/pontoColetaService';
import axios from 'axios';



export default function UpdateAddressScreen() {

  const [location, setLocation] = useState<LocationObject | null>(null);
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setnNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const user = useUser();

  const estados: { [key: string]: string } = {
    "Acre": "AC",
    "Alagoas": "AL",
    "Amazonas": "AM",
    "Bahia": "BA",
    "Ceará": "CE",
    "Espírito Santo": "ES",
    "Goiás": "GO",
    "Maranhão": "MA",
    "Mato Grosso": "MT",
    "Mato Grosso do Sul": "MS",
    "Minas Gerais": "MG",
    "Pará": "PA",
    "Paraíba": "PB",
    "Paraná": "PR",
    "Pernambuco": "PE",
    "Piauí": "PI",
    "Rio de Janeiro": "RJ",
    "Rio Grande do Norte": "RN",
    "Rio Grande do Sul": "RS",
    "Rondônia": "RO",
    "Roraima": "RR",
    "São Paulo": "SP",
    "Santa Catarina": "SC",
    "Sergipe": "SE",
    "Tocantins": "TO"
  };

  interface ViaCepResponse {
    bairro: string;
    cep: string;
    complemento: string;
    ddd: string;
    estado: string;
    localidade: string;
    logradouro: string;
    regiao: string;
    uf: string;
  }


  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();

    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition)
    }
  }

  useEffect(() => {
    requestLocationPermissions();
  }, []);

  const getAdress = async () => {
    if (!location) {
      alert('Localização não encontrada.');
      return;
    }

    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${location.coords.latitude}&lon=${location.coords.longitude}`;

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'MapTestApp/1.0 (contact@example.com)'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const uf = getUf(data.address.state);

      // console.log(data)

      const apiViaCep = axios.create({
        baseURL: "https://viacep.com.br/ws/"
      });

      const cepResponse = await apiViaCep.get<ViaCepResponse[]>(`${uf}/${data.address.city}/${data.address.road}/json/`);

      const cepData = cepResponse.data;

      if (cepData.length > 1) {
        const realLocation = cepData.find((item: ViaCepResponse) => item.bairro === data.address.neighbourhood || item.bairro === data.address.village || item.bairro === data.address.city_district)

        if (realLocation) {
          setCep(realLocation.cep)
          setRua(realLocation.logradouro)
          setBairro(realLocation.bairro)
          setCidade(realLocation.localidade)
          setEstado(realLocation.estado)
        }
      } else {

        setCep(cepData[0].cep)
        setRua(cepData[0].logradouro)
        setBairro(cepData[0].bairro)
        setCidade(cepData[0].localidade)
        setEstado(cepData[0].estado)
      }

      console.log(cepData)




    } catch (error) {
      console.error('Erro ao buscar endereço:', error);
    }
  };

  const updateAddress = async () => {

    if (
      !cep ||
      !rua ||
      !bairro ||
      !cidade ||
      !estado ||
      !numero) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const pontoColeta = {
        idUsuario: user?.id,
        nome: user?.nome,
        cnpj: user?.cnpj,
        cep: cep,
        rua: rua,
        bairro: bairro,
        cidade: cidade,
        estado: estado,
        numero: parseInt(numero),
      } as PontoColeta
      const response = await PontoColetaService.createPontoColeta(pontoColeta);

      if (response) {
        console.log('Endereço Ponto Coleta cadastrado com sucesso:', response);
      } else {
        console.error('Erro ao cadastrar usuário', response);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function checkCEP(cep: number) {
    try {
      const api = axios.create({
        baseURL: "https://viacep.com.br/ws/"
      });

      const response = await api.get(`${cep}/json/`);
      const data = response.data as {
        logradouro: string;
        bairro: string;
        localidade: string;
        estado: string;
        cep: string
      }

      console.log({
        response: data
      })

      setRua(data.logradouro)
      setBairro(data.bairro)
      setCidade(data.localidade)
      setEstado(data.estado)

    } catch (error) {
      console.log(error)
    }
  }

  const formatCEP = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    return numericValue.replace(/(\d{5})(\d{1,3})/, '$1-$2');
  };

  function getUf(estado: string): string | undefined {
    return estados[estado];
  }


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={[styles.scrollContent, { flexGrow: 1 }]}>
        <Text style={styles.headerText}>Atualizar endereço</Text>

        <TouchableOpacity
          style={styles.locationButton}
          onPress={getAdress}>
          <Text style={styles.locationButtonText}>Usar a localização atual</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <View style={styles.divider}>
            <Text style={styles.dividerText}>OU</Text>
          </View>
          <View style={styles.line} />
        </View>

        <TextInput style={styles.input}
          placeholder="CEP"
          placeholderTextColor="#E2E2E2"
          keyboardType="numeric"
          value={formatCEP(cep)}
          onChangeText={(value) => {
            const numericValue = value.replace(/\D/g, '');
            setCep(numericValue);
            if (numericValue.length === 8)
              checkCEP(parseInt(numericValue))
          }}
          maxLength={9}
        />
        <TextInput style={styles.input}
          placeholder="Rua"
          placeholderTextColor="#E2E2E2"
          value={rua}
          onChangeText={setRua}
        />
        <TextInput style={styles.input}
          placeholder="Número"
          placeholderTextColor="#E2E2E2"
          keyboardType="numeric"
          value={numero}
          onChangeText={setnNumero} />
        <TextInput style={styles.input}
          placeholder="Bairro"
          placeholderTextColor="#E2E2E2"
          value={bairro}
          onChangeText={setBairro} />
        <TextInput style={styles.input}
          placeholder="Cidade"
          placeholderTextColor="#E2E2E2"
          value={cidade}
          onChangeText={setCidade} />
        <TextInput style={styles.input}
          placeholder="Estado"
          placeholderTextColor="#E2E2E2"
          value={estado}
          onChangeText={setEstado} />

        <TouchableOpacity style={styles.confirmButton} onPress={updateAddress}>
          <Text style={styles.confirmButtonText}>CONFIRMAR</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6dc06d',
    paddingTop: 40,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    paddingTop: 30
  },
  locationButton: {
    backgroundColor: '#9fe69f',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  locationButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 25,
    marginTop: 1
  },
  divider: {
    paddingHorizontal: 8,
    backgroundColor: '#6dc06d',
    borderColor: '#6dc06d',
    borderWidth: 1,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  line: {
    position: 'absolute', // Fixa a linha atrás do texto
    top: '50%', // Centraliza a linha verticalmente
    left: 0,
    right: 0,
    height: 1, // Espessura da linha
    backgroundColor: '#E2E2E2', // Cor da linha
    zIndex: -1, // Garante que a linha fique atrás do texto
  },
  dividerText: {
    color: 'white',
    fontSize: 16,
    zIndex: 1, // Garante que o texto fique acima da linha
    paddingHorizontal: 8,
    backgroundColor: '#6dc06d', // Cor de fundo para destacar o texto
    borderRadius: 4,
  },
  input: {
    backgroundColor: '#86C386',
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: 'white',
    marginBottom: 25,
  },
  confirmButton: {
    backgroundColor: '#5b8a5b',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexGrow: 1,
  },
});
