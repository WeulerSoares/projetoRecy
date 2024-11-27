import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Platform, Text, ScrollView, TouchableOpacity, FlatList, Modal, TextInput } from 'react-native';
import { getCurrentPositionAsync, LocationAccuracy, LocationObject, requestForegroundPermissionsAsync, watchPositionAsync } from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { PontoColetaService } from '../services/pontoColetaService';
import { PontoColeta } from '../services/models/pontoColeta';
import { CollectionPoint } from '../services/interfaces/collectionPoint';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { MaterialColetaService } from '../services/materialColetaService';

const TabTwoScreen = () => {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const mapRef = useRef<MapView>(null);
  const [collectionPoints, setCollectionPoints] = useState<PontoColeta[] | null>(null);
  const [items, setItems] = useState<CollectionPoint[]>([]);
  const [material, setMaterial] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [radio, setRadio] = useState('10');
  const [tipoMaterial, setTipoMaterial] = useState('');

  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();
    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
      getPontosDeColeta();
    }
  }

  async function getPontosDeColeta() {
    if (location) {
      const response = await PontoColetaService.getPontosColetaByRange(parseInt(radio), location.coords.latitude, location.coords.longitude);
      if (response) {
        setCollectionPoints(response);
        formatItems(response);

        // if(tipoMaterial && collectionPoints) {
        //   let materials = [];
        //   collectionPoints.forEach((item) => {
        //     const responseMaterial = await MaterialColetaService.obterMateriais()
        //   })
        // }
      }
    }
  }

  function formatItems(pontoColeta: PontoColeta[]) {
    const formattedData: CollectionPoint[] = pontoColeta.map((item: any) => ({
      id: item.id,
      nome: item.nome,
      cnpj: item.cnpj,
      cep: item.cep,
      rua: item.rua,
      numero: item.numero,
      bairro: item.bairro,
      cidade: item.cidade,
      estado: item.estado
    }));

    setItems(formattedData)
  }

  const renderItem = ({ item }: { item: CollectionPoint }) => {
    return (
      <View style={styles.cardContent}>
        <View style={styles.placeholderImage} />
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{item.nome}</Text>
          <Text style={styles.cardDetails}>Endereço: {item.rua}, {item.numero}, {item.bairro}, {item.cidade}, {item.estado}</Text>
          {material &&
            <Text style={styles.cardDetails}>Material: {material}</Text> &&
            <Text style={styles.cardDetails}>Preço: {material}</Text>
          }
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={16} color="orange" />
            <Text style={styles.rating}>5,0</Text>
          </View>
          <TouchableOpacity style={styles.moreInfoButton}>
            <Text style={styles.moreInfoText}>Mais informações</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
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
    getPontosDeColeta();
  }, []);




  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>Encontre o melhor ponto de coleta para você</Text>
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => {
              console.log("Entrou")
              setModalVisible(true)
            }}>
            <Text style={styles.filterButtonText}>Filtros</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Favoritos</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.mapPlaceholder}>
          <Text>Mapa não é suportado no navegador.</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.list}
          />
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
                  getPontosDeColeta(),
                  setModalVisible(false)
                }}
              >
                <Text style={styles.buttonText}>Adicionar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttonAdd, styles.cleanButton]}
                onPress={() => {
                    setTipoMaterial(''),
                    setRadio('10'),
                    getPontosDeColeta()
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
      <Text style={styles.headerText}>Encontre o melhor ponto de coleta para você</Text>
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton} onPress={getPontosDeColeta}>
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text>AAAAAAAAAAAAAAAAAAAAAAAAAAAA</Text>
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
  },
  map: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  webFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
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
    marginHorizontal: 8,
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    fontSize: 16,
    marginLeft: 4,
    color: 'orange',
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


});

export default TabTwoScreen;
