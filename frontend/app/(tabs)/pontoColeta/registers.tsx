import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    TextInput,
    FlatList,
} from 'react-native';
import { MaterialColeta } from '../services/models/materialColeta';
import { toFloat } from 'validator';
import { MaterialColetaService } from '../services/materialColetaService';
import { useUser } from '@/components/UserContext';
import { Picker } from '@react-native-picker/picker';
import { PontoColetaService } from '../services/pontoColetaService';
import materialLabels from '../services/interfaces/materialLabels';
import { RegistroColetaService } from '../services/registroColetaService';
import { RegisterItem } from '../services/interfaces/registerItem';

export default function TipoMaterialRecolhido() {

    const [items, setItems] = useState<RegisterItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<RegisterItem | null>(null);
    const [tipoMateriais, setTipoMateriais] = useState<{ [key: number]: string }>({});
    const user = useUser();
    const groupedItems = groupByDate(items);

    const obterRegistros = async () => {
        try {

            if (user?.id) {
                const pontoColeta = await PontoColetaService.getPontoColeta(user?.id);
                const response = await RegistroColetaService.obterRegistrosPontoColeta(pontoColeta.id);
                let teste;

                const formattedData: RegisterItem[] = response.map((register: any) => ({
                    id: register.id,
                    idTipoMaterial: register.idTipoMaterial,
                    cpfCliente: register.cpfCliente,
                    dataColeta: register.dataColeta,
                    peso: register.peso.toFixed(2),
                    total: register.total.toFixed(2)
                }));

                setItems(formattedData);
                // getTypeMaterial(formattedData[0].idTipoMaterial)
            }

        } catch (error) {

        }
    }

    async function getTypeMaterial(idTipoMaterial: number) {
        if (tipoMateriais[idTipoMaterial]) {
            return; // Evita buscar se já existe no estado
        }

        try {
            const response = await MaterialColetaService.obterMaterial(idTipoMaterial);
            setTipoMateriais((prev) => ({
                ...prev,
                [idTipoMaterial]: response.tipoMaterial, // Atualiza o mapeamento
            }));
        } catch (error) {
            console.error(`Erro ao obter tipo de material para ID ${idTipoMaterial}:`, error);
        }
    }


    useEffect(() => {
        async function fetchAllMaterials() {
            await obterRegistros();

            // Para cada registro, busque o tipo de material
            items.forEach((item) => {
                getTypeMaterial(item.idTipoMaterial);
            });
        }

        fetchAllMaterials();
    }, []);

    function formatDate(date: string): string {
        try {
            const parsedDate = new Date(date);
            return parsedDate.toLocaleDateString('pt-BR');
        } catch {
            return "Data inválida";
        }
    }

    function formatCPF(cpf: string): string {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    function formatCurrency(value: number): string {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }
    
    function formatWeight(weight: number): string {
        return `${weight.toFixed(2).replace('.', ',')} kg`;
    }

    function groupByDate(items: RegisterItem[]): { [key: string]: RegisterItem[] } {
        return items.reduce((groups, item) => {
            const formattedDate = formatDate(item.dataColeta);
            if (!groups[formattedDate]) {
                groups[formattedDate] = [];
            }
            getTypeMaterial(item.idTipoMaterial);
            groups[formattedDate].push(item);
            return groups;
        }, {} as { [key: string]: RegisterItem[] });
    }

    return (
        <View style={styles.container}>
        <Text style={styles.header}>Registros - {user?.nome}</Text>
        <FlatList
            data={Object.keys(groupedItems)}
            renderItem={({ item: date }) => (
                <View>
                    <Text style={styles.dateLabel}>{date}</Text>
                    {groupedItems[date].map((item) => (
                        <View style={styles.card} key={item.id}>
                            <Text style={styles.cardTitle}>
                                {tipoMateriais && 
                                    tipoMateriais[item.idTipoMaterial] && 
                                    tipoMateriais[item.idTipoMaterial].charAt(0).toUpperCase() + tipoMateriais[item.idTipoMaterial].slice(1) || "Carregando..."}
                            </Text>
                            <Text style={styles.cardPrice}>CPF: {formatCPF(item.cpfCliente)}</Text>
                            <Text style={styles.cardPrice}>Peso/Quantidade/Volume: {formatWeight(Number(item.peso))}</Text>
                            <Text style={styles.cardPrice}>Total: {formatCurrency(Number(item.total))}</Text>
                        </View>
                    ))}
                </View>
            )}
            keyExtractor={(item) => item}
            // contentContainerStyle={styles.list}
        />
    </View>
    );
};

const styles = StyleSheet.create({
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#fff',
        marginBottom: 16,
    },
    container: {
        flex: 1,
        backgroundColor: '#6dc06d',
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        marginVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%'
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardPrice: {
        fontSize: 14,
        color: '#555',
    },
    
    dateLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 8,
        color: '#333',
        backgroundColor: '#6dc06d',
        padding: 8,
        borderRadius: 8,
        textAlign: 'center',
    },
});