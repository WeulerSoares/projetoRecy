import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from "react-native";
import { CupomService } from "../services/cupomService";
import { CupomVisualizacao } from "../services/models/cupomVisualizacao";
import { EmpresaParceiraService } from "../services/empresaParceiraService";
import { useUser } from '@/components/UserContext';
import { UsuarioService } from "../services/usuarioService";
import Alert from "@/components/Alert";

export default function CuponsScreen() {
  const [cupons, setCupons] = useState<CupomVisualizacao[]>([]);
  const [pontosAcumulados, setPontosAcumulados] = useState<Number>(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const user = useUser();

  const carregarCupons = async () => {
    try {
      const dados = await CupomService.obterCupons();

      for (const f of dados) {
        f.logo = await EmpresaParceiraService.obterLogo(f.idEmpresa);
      }

      setCupons(dados);
    } catch (error) {
      console.error('Erro ao carregar cupons:', error);
    }
  };
  
  const carregarPontosAcumulados = async () => {
    try {
      const pontosAcumulados = await UsuarioService.obterPontosAcumulados(user?.id!);

      setPontosAcumulados(pontosAcumulados);
    } catch (error) {
      console.error('Erro ao carregar pontos acumulados:', error);
    }
  };

  useEffect(() => {
    carregarPontosAcumulados();
    carregarCupons();

    const interval = setInterval(() => {
      carregarCupons();
    }, 60000);
  
    return () => clearInterval(interval);
  }, []);

  const resgatarCupom = async (idCupom: number) => {
    try {
      const response = await CupomService.resgatarCupom(user?.id!, idCupom);
      
      if (response) {
        setShowAlert(true);
        setAlertMessage(response.message);
        carregarPontosAcumulados();
        carregarCupons();
      }
    } catch (error: any) {
      console.error("Erro ao resgatar cupom:", error);

      if (error.response && error.response.data && error.response.data.message) {
        setShowAlert(true);
        setAlertMessage(error.response.data.message);
      } else {
        setShowAlert(true);
        setAlertMessage('Erro inesperado ao resgatar cupom');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Cupons</Text>
      <View style={styles.pointsContainer}>
        <Text style={styles.pointsText}>
          Pontos acumulados: <Text style={styles.pointsValue}>{ pontosAcumulados.toString() }</Text>
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {cupons.map((cupom) => (
          <View key={cupom.idCupom} style={styles.couponCard}>
            <View style={styles.couponHeader}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: cupom.logo }} style={styles.image} />
              </View>
              <Text style={styles.couponTitle}>{cupom.nomeEmpresa}</Text>
            </View>
            <Text style={styles.couponText}>Pontos para troca: {cupom.pontos}</Text>
            <Text style={styles.couponText}>Valor: R$ {cupom.valor.toFixed(2)}</Text>
            <TouchableOpacity style={styles.button} onPress={ () => resgatarCupom(cupom.idCupom)}>
              <Text style={styles.buttonText}>Trocar pontos</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

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
    backgroundColor: "#6dc06d",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 16,
  },
  pointsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  pointsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  pointsValue: {
    color: "#FFA500",
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  couponCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 16,
    paddingTop: 0,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  couponHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#D9D9D9",
    marginRight: 12,
  },
  couponTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginLeft: 20
  },
  couponText: {
    fontSize: 16,
    color: "#555555",
    marginBottom: 4,
  },
  button: {
    backgroundColor: "#559555",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
