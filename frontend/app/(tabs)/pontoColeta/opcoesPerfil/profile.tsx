import { getCurrentPositionAsync, LocationObject, requestForegroundPermissionsAsync } from 'expo-location';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useUser } from '@/components/UserContext';
import axios from 'axios';
import { PontoColeta } from '../../services/models/pontoColeta';
import { PontoColetaService } from '../../services/pontoColetaService';
import Alert from '@/components/Alert';

export default function UpdateAddressScreen() {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [pontoColeta, setPontoColeta] = useState<PontoColeta | null>(null);
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setnNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [controller, setController] = useState('');
  const [titulo, setTitulo] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
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

  async function checkUpdateOrCreate() {
    if (user?.id) {
      if (pontoColeta) {
        updatePontoColeta();
      } else {
        createPontoColeta();
      }
    }

  }

  async function fetchPontoColeta() {
    if (!user?.id || controller)
      return;

    const pontoColeta = await PontoColetaService.getPontoColeta(user.id);
    console.log("PontoColeta:", pontoColeta);

    if (pontoColeta) {
      setPontoColeta(pontoColeta);
      setCep(pontoColeta.cep);
      setRua(pontoColeta.rua);
      setnNumero(String(pontoColeta.numero));
      setBairro(pontoColeta.bairro);
      setCidade(pontoColeta.cidade);
      setEstado(pontoColeta.estado);
      setController('Atualizado');
      setTitulo("Atualizar endereço");
    } else {
      setTitulo("Cadastrar endereço");
    }


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
    fetchPontoColeta();
  }, []);

  const getAdress = async () => {
    if (!location) {
      setShowAlert(true);
      setAlertMessage('Localização não encontrada.');
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
      console.log(data);

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

  const updatePontoColeta = async () => {

    if (
      !cep ||
      !rua ||
      !bairro ||
      !cidade ||
      !estado ||
      !numero) {
      setShowAlert(true);
      setAlertMessage('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const pontoColetaData = {
        id: pontoColeta?.id,
        idUsuario: user?.id,
        nome: user?.nome,
        cnpj: user?.cnpj,
        cep: cep,
        rua: rua,
        bairro: bairro,
        cidade: cidade,
        estado: estado,
        numero: parseInt(numero),
        latitude: latitude || location?.coords.latitude,
        longitude: longitude || location?.coords.longitude
      } as PontoColeta
      const response = await PontoColetaService.updatePontoColeta(pontoColetaData);

      if (response) {
        setShowAlert(true);
        setAlertMessage('Endereço Ponto Coleta cadastrado com sucesso!');
        setLatitude('');
        setLatitude('');
        requestLocationPermissions();
      } else {
        console.error('Erro ao cadastrar usuário', response);
      }
    } catch (error) {
      console.log(error);
    }
  }


  const createPontoColeta = async () => {

    if (
      !cep ||
      !rua ||
      !bairro ||
      !cidade ||
      !estado ||
      !numero) {
      setShowAlert(true);
      setAlertMessage('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const pontoColetaData = {
        id: pontoColeta?.id,
        idUsuario: user?.id,
        nome: user?.nome,
        cnpj: user?.cnpj,
        cep: cep,
        rua: rua,
        bairro: bairro,
        cidade: cidade,
        estado: estado,
        numero: parseInt(numero),
        latitude: latitude || location?.coords.latitude,
        longitude: longitude || location?.coords.longitude
      } as PontoColeta
      const response = await PontoColetaService.createPontoColeta(pontoColetaData);

      if (response) {
        setShowAlert(true);
        setAlertMessage('Endereço Ponto Coleta atualizado com sucesso!');
        setLatitude('');
        setLatitude('');
        requestLocationPermissions();
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
      console.log(response.data)
      const data = response.data as {
        logradouro: string;
        bairro: string;
        localidade: string;
        estado: string;
        cep: string;
        uf: string
      }

      const locationResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&street=${data.logradouro}&city=${data.uf}&state=${data.estado}&country=Brazil`);
      const locationData = await locationResponse.json();
      console.log({
        latitude: latitude,
        longitude: longitude,
        response: locationResponse,
        data: locationData
      })
      if (locationData.length > 0) {
        const { lat, lon } = locationData[0];
        setLatitude(lat);
        setLongitude(lon);
      } else {
        setShowAlert(true);
        setAlertMessage('Não foi possível encontrar as coordenadas para este endereço.');
      }



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
        <Text style={styles.headerText}>{titulo}</Text>

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
          value={rua}
          onChangeText={setRua}
        />
        <TextInput style={styles.input}
          placeholder="Número"
          keyboardType="numeric"
          value={numero}
          onChangeText={setnNumero}
          maxLength={5} />
        <TextInput style={styles.input}
          placeholder="Bairro"
          value={bairro}
          onChangeText={setBairro} />
        <TextInput style={styles.input}
          placeholder="Cidade"
          value={cidade}
          onChangeText={setCidade} />
        <TextInput style={styles.input}
          placeholder="Estado"
          value={estado}
          onChangeText={setEstado} />

        <TouchableOpacity style={styles.confirmButton} onPress={checkUpdateOrCreate}>
          <Text style={styles.confirmButtonText}>CONFIRMAR</Text>
        </TouchableOpacity>
      </ScrollView>
      
      {showAlert && (
        <Alert
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6dc06d',
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
    backgroundColor: '#559555',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  locationButtonText: {
    color: 'white',
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
    backgroundColor: '#8FFB8F',
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#558C40',
    marginBottom: 25,
    fontWeight: 'bold'
  },
  confirmButton: {
    backgroundColor: '#559555',
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
