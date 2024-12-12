import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from 'expo-router';
import { PontoColetaService } from "../../services/pontoColetaService";
import StarRating from "react-native-star-rating-widget";
import { useUser } from "@/components/UserContext";
import { UsuarioService } from "../../services/usuarioService";
import PerfilPontoColetaModel from "../../services/models/perfilPontoColeta";
import { TipoMaterial } from "../../services/enums/tipoMaterial";

const PerfilPontoColeta = () => {
  const [pontoColeta, setPontoColeta] = useState<PerfilPontoColetaModel>();
  const [image, setImage] = useState<string | null>(null);

  const { id } = useLocalSearchParams();
  const user = useUser();

  const toggleFavorito = async (favoritado: boolean) => {
    try {    
      await UsuarioService.alterarFavoritoPontoColeta(user?.id!, pontoColeta!.idPontoColeta);
      const pontoColetaAtualizado = { ...pontoColeta, favoritado } as PerfilPontoColetaModel;
      setPontoColeta(pontoColetaAtualizado);
    } catch(error) {
      console.error('Erro ao alterar ponto de coleta favorito:', error);
    }
  };
  
  const alterarAvaliacao = async (avaliacao: number) => {
    try {    
      await UsuarioService.alterarAvaliacaoPontoColeta(user?.id!, pontoColeta?.idPontoColeta!, avaliacao);
      const pontoColetaAtualizado = { ...pontoColeta, avaliacao } as PerfilPontoColetaModel;
      setPontoColeta(pontoColetaAtualizado);
    } catch(error) {
      console.error('Erro ao alterar avaliação do ponto de coleta:', error);
    }
  };
  
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
  
  const carregarDadosPontoColeta = async () => {
    try {
      const dadosPontoColeta = await PontoColetaService.obterPerfilPontoColeta(Number(id), user?.id!);
      setPontoColeta(dadosPontoColeta);
    } catch (error) {
      console.error('Erro ao carregar dados ponto de coleta:', error);
    }
  };
  
  const carregarFotoPerfilPontoColeta = async () => {
    try {
      if (pontoColeta) {
        setImage(await PontoColetaService.obterFoto(pontoColeta.idPontoColeta));
      }
    } catch (error) {
      console.error('Erro ao carregar foto de peril do ponto de coleta:', error);
    }
  };

  useEffect(() => {
    carregarDadosPontoColeta();
  }, []);
  
  useEffect(() => {
    carregarFotoPerfilPontoColeta();
  }, [pontoColeta]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.titulo}>Perfil Ponto de Coleta</Text>
        <View style={styles.perfilContainer}>
          <View style={styles.imagemContainer}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
              ) : (
              <MaterialCommunityIcons
                name="camera-off"
                size={64}
                color="black"
              />
            )}
          </View>
          <Text style={styles.nomePonto}>{pontoColeta?.nomePontoColeta}</Text>
          <View style={styles.rating}>
            <StarRating
                rating={pontoColeta?.avaliacao || 0}
                onChange={(valor) => {
                  alterarAvaliacao(valor);
                }}
                enableHalfStar
                starSize={34}
                style={styles.starRating}
            />
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.cabecalhoCard}>
            <TouchableOpacity onPress={() => toggleFavorito(!pontoColeta?.favoritado)}>
              <MaterialCommunityIcons
                name={pontoColeta?.favoritado ? "heart" : "heart-outline"}
                size={30}
                color={"green"}
              />
            </TouchableOpacity>
          </View>
            <Text style={styles.subtitulo}>Materiais</Text>
              <FlatList
                data={pontoColeta?.materiais}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.materialItem}>
                    <Text style={styles.materialText}>{TipoMaterial[item.tipoMaterial as keyof typeof TipoMaterial]}</Text>
                    <Text style={styles.materialText}>{obterPrecoFormatado(item.preco, item.medida)}</Text>
                  </View>
                )}
                numColumns={2}
                columnWrapperStyle={styles.materialRow}
              />
            <Text style={styles.subtitulo}>Descrição</Text>
            <Text style={styles.textoInformacoes}>
              {pontoColeta?.descricao}
            </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6dc06d", // Cor verde do fundo
    alignItems: "center",
    paddingTop: 40,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  perfilContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  imagemContainer: {
    width: 140,
    height: 140,
    borderRadius: 100,
    backgroundColor: "lightgray",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  nomePonto: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginVertical: 8,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  starRating: {
    marginTop: 4,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    width: "90%",
    marginTop: 20,
  },
  cabecalhoCard: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  botaoVerFotos: {
    borderColor: "green",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  botaoTexto: {
    color: "green",
    fontWeight: "bold",
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    marginVertical: 8,
  },
  textoInformacoes: {
    fontSize: 14,
    color: "black",
  },
  navegacaoInferior: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 60,
    backgroundColor: "#344E41", // Verde escuro
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  materialRow: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  materialItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    margin: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  materialText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  scrollContainer: {
    alignItems: "center",
  },
});

export default PerfilPontoColeta;
