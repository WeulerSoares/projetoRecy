import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const locations = [
  { id: '1', name: 'Ferro Velho Beira Rio', material: 'Alumínio', price: 'R$ 6,50/kg', rating: 5 },
  { id: '2', name: 'MW Recicláveis', material: 'Papelão', price: 'R$ 2,70/kg', rating: 5 },
  { id: '3', name: 'Casa das Garrafas', material: 'Alumínio', price: 'R$ 3,00/kg', rating: 4.5 },
];

export default function TabTwoScreen() {
  const renderLocationCard = (item: any) => (
    <View key={item.id} style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.placeholderImage} />
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardDetails}>Material: {item.material}</Text>
          <Text style={styles.cardDetails}>Preço: {item.price}</Text>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={16} color="orange" />
            <Text style={styles.rating}>{item.rating},0</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.moreInfoButton}>
        <Text style={styles.moreInfoText}>Mais informações</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerText}>Encontre o melhor ponto de coleta para você</Text>
        <View style={styles.filterContainer}>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Material ▼</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Distância</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Favoritos</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.mapPlaceholder}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/300x200.png?text=Mapa+Simulado' }} 
            style={styles.mapImage}
          />
        </View>
        {locations.map(renderLocationCard)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6dc06d',
    paddingTop: 40,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 80, // Para dar espaço para a barra de navegação inferior
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
  mapPlaceholder: {
    backgroundColor: '#e0e0e0',
    height: 200,
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
  },
  placeholderImage: {
    width: 50,
    height: 50,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginRight: 16,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardDetails: {
    color: 'gray',
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#333',
  },
  activeIcon: {
    color: '#6dc06d',
  },
});
