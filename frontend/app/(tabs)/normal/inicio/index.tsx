import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Platform, Text, ScrollView, TouchableOpacity, FlatList, Modal, TextInput, Image } from 'react-native';
import { getCurrentPositionAsync, LocationAccuracy, LocationObject, requestForegroundPermissionsAsync, watchPositionAsync } from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { PontoColetaService } from '../../services/pontoColetaService';
import { Picker } from '@react-native-picker/picker';
import { Link } from 'expo-router';
import { useUser } from '@/components/UserContext';
import { PontoColetaPesquisa } from '../../services/models/pontoColetaPesquisa';
import StarRating from 'react-native-star-rating-widget';
import { PontoColetaParaFiltro } from '../../services/models/pontoColetaParaFiltro';
import { TipoMaterial } from '../../services/enums/tipoMaterial';

const TabTwoScreen = () => {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const mapRef = useRef<MapView>(null);
  const [pontosColeta, setPontosColeta] = useState<PontoColetaPesquisa[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [radio, setRadio] = useState('10');
  const [tipoMaterial, setTipoMaterial] = useState('');

  const user = useUser();
  
    const dados = [{
      idPontoColeta: 1,
      nomePontoColeta: 'Estação Circular',
      favoritado: false,
      avaliacao: 5,
      endereco: 'Av. Juiz Marco Túlio Isaac, 50 - Jardim da Cidade, Betim - MG',
      foto: 'https://lh5.googleusercontent.com/p/AF1QipOmo7q-buUeqFIDe3E8_XQXpcG4Ia6GRDU2iC30=w426-h240-k-no'
    },
    {
      idPontoColeta: 2,
      nomePontoColeta: 'MW Recicláveis',
      favoritado: false,
      avaliacao: 5,
      endereco: 'R. Florianópolis, 107 - Niterói, Betim - MG',
      foto: 'https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=UTy0tFkSagSkZg1QAgusEw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=14.468989&pitch=0&thumbfov=100'
    },
    {
      idPontoColeta: 3,
      nomePontoColeta: 'Ecoponto E-MILE - PUC BETIM',
      favoritado: false,
      avaliacao: 4,
      endereco: 'R. do Rosário, 1081 - Angola, Betim - MG, 32630-000',
      foto: 'https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=fpvAmtInav5KZ9wFdysztQ&cb_client=search.gws-prod.gps&w=408&h=240&yaw=296.94507&pitch=0&thumbfov=100'
    },
    {
      idPontoColeta: 4,
      nomePontoColeta: 'Reciclagem Bandeirantes',
      favoritado: false,
      avaliacao: 3,
      endereco: 'Av. Bandeirantes, 103 - Chácaras, Betim - MG',
      foto: 'https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=ul_w0iEj6GEsRO3eFbYbbg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=330.12436&pitch=0&thumbfov=100'
    },
    {
      idPontoColeta: 5,
      nomePontoColeta: 'Brasil Reciclagem MG',
      favoritado: false,
      avaliacao: 5,
      endereco: 'R. Antônio Soares de Melo, 61 - Betim Industrial, Betim - MG',
      foto: 'https://lh5.googleusercontent.com/p/AF1QipMYUuCRVNqA_uWEUKY9vLHAI_fhclFhxwQYlbUZ=w408-h408-k-no'
    }];

  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();
    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
      getPontosDeColeta(currentPosition);
    }
  }

  async function getPontosDeColeta(localizacao: LocationObject) {
    if (Platform.OS === 'web' && localizacao) {    

      const filtro = {
        idUsuario: user?.id!,
        raio: parseInt(radio),
        latitude: localizacao.coords.latitude,
        longitude: localizacao.coords.longitude,
        tipoMaterial: tipoMaterial ? tipoMaterial : null
      } as PontoColetaParaFiltro;

      const dados = await PontoColetaService.getPontosColeta(filtro);

      for (const f of dados) {
        f.foto = await PontoColetaService.obterFoto(f.idPontoColeta);
      }

      setPontosColeta(dados);
    }
  }

  const obterPrecoFormatado = (preco: number, tipoMedida: string) => {
    let medida = '';

    switch (tipoMedida) {
      case 'peso':
        medida = 'kg';
        break;
      case 'volume':
        medida = 'L';
        break;
      case 'unidade':
        medida = 'Unidade';
        break;
    }

    return `R$ ${preco}/${medida}`
  };

  useEffect(() => {
    requestLocationPermissions();
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      watchPositionAsync(
        {
          accuracy: LocationAccuracy.Highest,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (response) => {
          setLocation(response);
        }
      );
    }

    getPontosDeColeta(location!);
  }, []);




  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.headerText}>Encontre o melhor ponto de coleta para você</Text>
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => {
                setModalVisible(true)
              }}>
              <Text style={styles.filterButtonText}>Filtros</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.mapPlaceholder}>
            <Text>Mapa não é suportado no navegador.</Text>
          </View>
          {pontosColeta.map((pontoColeta) => (
            <View style={styles.cardContent} key={pontoColeta.idPontoColeta}>
              <View style={styles.placeholderImage}>
                {pontoColeta.foto ? (
                  <Image source={{ uri: pontoColeta.foto }} style={styles.image} />
                ) : null}
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{pontoColeta.nomePontoColeta}</Text>
                <Text style={styles.cardDetails}>Endereço: {pontoColeta.endereco}</Text>
                {pontoColeta.tipoMaterial &&
                  <Text style={styles.cardDetails}>Material: {TipoMaterial[pontoColeta.tipoMaterial as keyof typeof TipoMaterial]}
                  <br></br>
                  Preço: {obterPrecoFormatado(pontoColeta.precoMaterial!, pontoColeta.tipoMedida)}</Text>
                }
                <View style={styles.rating}>
                  <StarRating
                      rating={pontoColeta.avaliacao || 0}
                      onChange={() => {}}
                      enableHalfStar
                      starSize={22}
                      style={styles.starRating}
                  />
                  <Text style={styles.ratingText}>{pontoColeta.avaliacao ? pontoColeta.avaliacao.toFixed(1) : 0}</Text>
                </View>
                <TouchableOpacity style={styles.moreInfoButton}>
                  <Link href={{ pathname: '/normal/inicio/perfilPontoColeta', params: { id: pontoColeta.idPontoColeta }}} style={styles.moreInfoText}>Mais informações</Link>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Filtros */}
        <Modal
          visible={modalVisible}
          animationType='slide'
          transparent={true}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Filtros</Text>
            <View style={styles.pickerContainer}>
              <Picker
                style={styles.picker}
                selectedValue={tipoMaterial}
                onValueChange={(itemValue) => setTipoMaterial(itemValue)}>

                <Picker.Item label='Selecione o tipo de material ▼' value="" />
                <Picker.Item label='Alumínio' value="aluminio" />
                <Picker.Item label='Eletrônico' value="eletronico" />
                <Picker.Item label='Orgânico' value="organico" />
                <Picker.Item label='Papel' value="papel" />
                <Picker.Item label='Papelão' value="papelao" />
                <Picker.Item label='Plástico' value="plastico" />
                <Picker.Item label='Vidro' value="vidro" />

              </Picker>
            </View>

            <TextInput
              style={styles.input}
              value={radio}
              onChangeText={setRadio}
              keyboardType="numeric"
              placeholder='Raio de procura' />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.buttonAdd}
                onPress={() => { 
                  getPontosDeColeta(location!),
                  setModalVisible(false)
                }}
              >
                <Text style={styles.buttonText}>Filtrar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttonAdd, styles.cleanButton]}
                onPress={() => {
                    setTipoMaterial(''),
                    setRadio('10'),
                    getPontosDeColeta(location!)
                    setModalVisible(false);
                }}>
                <Text style={styles.buttonText}>Limpar Filtro</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setModalVisible(false);
                }}>
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerText}>Encontre o melhor ponto de coleta para você</Text>
        <View style={styles.filterContainer}>
          <TouchableOpacity style={styles.filterButton} onPress={getPontosDeColeta(location!)}>
            <Text style={styles.filterButtonText}>Material ▼</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Distância</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Favoritos</Text>
          </TouchableOpacity>
        </View>
        {location && (
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}

          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
            />
          </MapView>
        )}
        {dados.map((pontoColeta) => (
          <View style={styles.cardContent} key={pontoColeta.idPontoColeta}>
            <View style={styles.placeholderImage}>
              {pontoColeta.foto ? (
                <Image source={{ uri: pontoColeta.foto }} style={styles.image} />
              ) : null}
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{pontoColeta.nomePontoColeta}</Text>
              <Text style={styles.cardDetails}>Endereço: {pontoColeta.endereco}</Text>
              {/* {material &&
                <Text style={styles.cardDetails}>Material: {material}</Text> &&
                <Text style={styles.cardDetails}>Preço: {material}</Text>
              } */}
              <View style={styles.rating}>
                <StarRating
                    rating={pontoColeta.avaliacao || 0}
                    onChange={() => {}}
                    enableHalfStar
                    starSize={22}
                    style={styles.starRating}
                />
                <Text style={styles.ratingText}>{pontoColeta.avaliacao ? pontoColeta.avaliacao.toFixed(1) : 0}</Text>
              </View>
              <TouchableOpacity style={styles.moreInfoButton}>
                <Link href={{ pathname: '/normal/inicio/perfilPontoColeta', params: { id: pontoColeta.idPontoColeta }}} style={styles.moreInfoText}>Mais informações</Link>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Filtros */}
      <Modal
        visible={modalVisible}
        animationType='slide'
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.cardTitle}>Filtros</Text>
          <View>
            <Picker
              selectedValue={tipoMaterial}
              onValueChange={(itemValue) => setTipoMaterial(itemValue)}>
              <Picker.Item label='Selecione o tipo de material ▼' value="vazio" />
              <Picker.Item label='Alumínio' value="aluminio" />
              <Picker.Item label='Eletrônico' value="eletronico" />
              <Picker.Item label='Orgânico' value="organico" />
              <Picker.Item label='Papel' value="papel" />
              <Picker.Item label='Papelão' value="papelao" />
              <Picker.Item label='Plástico' value="plastico" />
              <Picker.Item label='Vidro' value="vidro" />
            </Picker>
          </View>

          <TextInput
            value={radio}
            onChangeText={setRadio}
            keyboardType="numeric"
            placeholder='Raio de procura' />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6dc06d',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  map: {
    flex: 1,
    width: '100%',
    paddingBottom: 80,
    marginBottom: 80,
  },
  webFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 80,
  },
  mapPlaceholder: {
    backgroundColor: '#e0e0e0',
    height: 200,
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignContent: 'center',
    flex: 1,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  filterButtonText: {
    color: 'black',
    fontSize: 16,
  },

  //Cards

  list: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },

  cardContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeholderImage: {
    width: 100,
    height: 100,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginRight: 16,
  },
  cardText: {
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000',
    textAlign: 'left',
  },
  cardDetails: {
    color: 'gray',
    textAlign: 'left',
    flexWrap: 'wrap',
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
},
  moreInfoButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#ededed',
    borderRadius: 8,
  },
  moreInfoText: {
    color: '#555',
  },

  // Modal

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  pickerWrapper: {
    width: '100%',
    justifyContent: 'center',
    backgroundColor: '#8FE38F',
    borderRadius: 25, // Borda arredondada
    overflow: 'hidden', // Para garantir que o conteúdo fique dentro da borda arredondada
  },
  picker: {
    width: '100%',
    backgroundColor: '#fff',
    borderColor: '#8FE38F',
    fontSize: 16,
    padding: 12,
    marginBottom: 16,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  pickerContainer: {
    width: "100%",
    overflow: 'hidden',
    borderRadius: 25,
    borderBottomLeftRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#888',
    borderRadius: 8,
    alignItems: 'center',
    width: 120,                     // Mesma largura que o botão "Adicionar"
  },
  buttonAdd: {
    paddingVertical: 12,            // Ajuste do padding vertical
    paddingHorizontal: 16,          // Ajuste do padding horizontal
    backgroundColor: '#4caf50',
    borderRadius: 8,
    alignItems: 'center',
    width: 120,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 25,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cleanButton: {
    backgroundColor: '#f44336',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  starRating: {
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 5,
    color: "#333",
    fontSize: 20,
},
});

export default TabTwoScreen;
