import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

export default function CadastroCupom() {
  const [quantity, setQuantity] = useState(0);
  const [value, setValue] = useState(10);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Cadastro Cupons</Text>

      <View style={styles.logoContainer}>
        <FontAwesome name="camera" size={48} color="white" />
        <Text style={styles.logoText}>LOGO EMPRESA</Text>
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome name="building-o" size={20} color="white" style={styles.icon} />
        <TextInput placeholder="Informe o nome da empresa" placeholderTextColor="#558C40" style={styles.input} />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="business" size={20} color="white" style={styles.icon} />
        <TextInput placeholder="Informe o CNPJ da empresa" placeholderTextColor="#558C40" style={styles.input} />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome name="key" size={20} color="white" style={styles.icon} />
        <TextInput placeholder="Informe os pontos" placeholderTextColor="#558C40" style={styles.input} />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome name="money" size={20} color="white" style={styles.icon} />
        <TextInput placeholder="Informe o valor total" placeholderTextColor="#558C40" style={styles.input} />
      </View>

      <Text style={styles.sliderLabel}>Quantidade x Valor</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={quantity}
        onValueChange={(val) => setQuantity(val)}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#888"
        thumbTintColor="#6dc06d"
      />

      <Text style={styles.sliderValue}>{quantity} cupons de {value} reais</Text>

      <TouchableOpacity style={styles.registerButton}>
        <Text style={styles.registerButtonText}>CADASTRAR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6dc06d',
    paddingTop: 40,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    color: 'white',
    fontSize: 18,
    marginTop: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#88d888',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 15,
    width: '100%',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 16,
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
  registerButton: {
    backgroundColor: '#3b8d3b',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginBottom: 20,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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
