import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LogoutButton from '@/components/logoutButton';
import { useUser } from '@/components/UserContext';
import * as ImagePicker from 'react-native-image-picker';
import { UsuarioService } from '../services/usuarioService';

export default function CadastroCupom() {
  const user = useUser();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const obterFoto = async () => {
      try {
        if (user && user.fotoPath.length > 0) {
          const fotoPath = await UsuarioService.obterFoto(user.id || 0);
          setSelectedImage(fotoPath);
        }
      } catch (error) {
        console.error("Erro ao obter foto do usuário:", error);
      }
    };
  
    obterFoto();
  }, [user]);
  
  const handleSelectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
      });

      if (result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setSelectedImage(uri!);

        await UsuarioService.adicionarFoto(user?.id!, uri!);
      }
    } catch (error) {
      alert('Não foi possível selecionar a imagem.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Perfil</Text>
      
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.imageButton} onPress={handleSelectImage}>
            {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.image} />
            ) : (
            <MaterialCommunityIcons name="camera" size={48} color="black" />
            )}
        </TouchableOpacity>
        <Text style={styles.nomeUsuario}>{user?.nome}</Text>
      </View>

      <LogoutButton />
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
  inputContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor: '#559555',
    width: '100%',
    borderRadius: 10,
  },
  imageButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    overflow: 'hidden'
  },
  nomeUsuario: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white'
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
