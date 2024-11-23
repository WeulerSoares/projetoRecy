import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import StarRating from 'react-native-star-rating-widget';
import { useRouter } from 'expo-router';
import { UsuarioService } from '../services/usuarioService';
import { useUser } from '@/components/UserContext';
import { PontoColetaFavorito } from '../services/models/pontoColetaFavorito';

export default function FavoritosScreen() {
  const [pontosColeta, setPontosColeta] = useState<PontoColetaFavorito[]>([]);

  const user = useUser();
  const router = useRouter();

  const carregarPontosColetaFavoritos = async () => {
    try {
      const dados = await UsuarioService.obterPontosColetaFavoritos(user?.id!);

      /*
      for (const f of dados) {
        f.foto = await PontoColetaService.obterFoto(f.idPontoColeta);
      }
      */

      setPontosColeta(dados);
    } catch (error) {
      console.error('Erro ao carregar cupons:', error);
    }
  };

  const toggleFavorito = async (idPontoColeta: number) => {
    await UsuarioService.alterarFavoritoPontoColeta(user?.id!, idPontoColeta);
    await carregarPontosColetaFavoritos();
  };

  const verPerfil = async () => {
    //router.replace('/(tabs)/admin');
  };

  useEffect(() => {
    carregarPontosColetaFavoritos();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.list}>
        <Text style={styles.headerText}>Favoritos</Text>
        {pontosColeta.map((local) => (
          <View key={local.idPontoColeta} style={styles.card}>
            <View style={styles.imagePlaceholder} />
            <View style={styles.info}>
              <Text style={styles.nome}>{local.nomePontoColeta}</Text>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.button} onPress={verPerfil}>
                    <Text style={styles.buttonText}>Ver Perfil</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleFavorito(local.idPontoColeta)}>
                    <MaterialCommunityIcons
                        name={local.favoritado ? "heart" : "heart-outline"}
                        size={30}
                        color={"#559555"}
                        style={styles.iconeFavorito}
                    />
                </TouchableOpacity>
              </View>
              <View style={styles.rating}>
                <StarRating
                    rating={local.avaliacao || 0}
                    onChange={() => {}}
                    enableHalfStar
                    starSize={22}
                    style={styles.starRating}
                />
                <Text style={styles.ratingText}>{local.avaliacao ? local.avaliacao.toFixed(1) : 0}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#6dc06d",
        paddingTop: 40,
        paddingHorizontal: 16,
      },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
      },
    map: {
        height: 200,
        borderRadius: 10,
        margin: 10,
    },
    list: {
        flex: 1,
        paddingHorizontal: 10,
    },
    card: {
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        alignItems: "center",
        justifyContent: "space-between",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    imagePlaceholder: {
        width: 100,
        height: 100,
        backgroundColor: "#ccc",
        borderRadius: 10,
    },
    info: {
        flex: 1,
        marginLeft: 10,
    },
    nome: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    button: {
        marginTop: 5,
        backgroundColor: "#559555",
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignSelf: "flex-start",
    },
    buttonText: {
        color: "white",
        fontSize: 18,
    },
    rating: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
    },
    ratingText: {
        marginLeft: 5,
        color: "#333",
        fontSize: 20,
    },
      actions: {
        flexDirection: "row",
        alignItems: "center", 
      },
      iconeFavorito: {
        marginTop: 5,
        marginLeft: 15, 
      },
      starRating: {
        marginTop: 4,
      },
});