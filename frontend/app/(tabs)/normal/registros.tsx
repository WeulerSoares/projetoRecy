import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
} from 'react-native';
import { useUser } from '@/components/UserContext';
import { RegistroColetaService } from '../services/registroColetaService';
import { RegisterItem } from '../services/interfaces/registerItem';
import { useFocusEffect } from 'expo-router';
import { TipoMaterial } from '../services/enums/tipoMaterial';

export default function TipoMaterialRecolhido() {

    const [items, setItems] = useState<RegisterItem[]>([]);
    const user = useUser();
    const groupedItems = groupByDate(items);

    const obterRegistros = async () => {
        try {
            if (user?.id) {
                const response = await RegistroColetaService.obterRegistrosUsuario(user?.id);

                const formattedData: RegisterItem[] = response.map((register: any) => ({
                    idRegistroColeta: register.idRegistroColeta,
                    nomePontoColeta: register.nomePontoColeta,
                    cpfCliente: register.cpfCliente,
                    tipoMaterial: TipoMaterial[register.tipoMaterial as keyof typeof TipoMaterial] || register.tipoMaterial,
                    tipoMedida: register.tipoMedida,
                    dataColeta: register.dataColeta,
                    peso: register.peso.toFixed(2),
                    total: register.total.toFixed(2)
                }));

                setItems(formattedData);
            }

        } catch (error) {

        }
    }

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
    
    const obterMedidaFormatado = (valor: number, tipoMedida: string) => {
        let medida = '';
    
        switch (tipoMedida) {
          case 'peso':
            medida = 'kg';
            break;
          case 'volume':
            medida = 'L';
            break;
          case 'unidade':
            medida = 'Unidades';
            break;
        }
    
        return `${valor.toFixed(2).replace('.', ',')} ${medida}`
      };

    const obterTipoMedidaFormatado = (tipoMedida: string) => {
        let tipoMedidaFormatado = '';
    
        switch (tipoMedida) {
          case 'peso':
            tipoMedidaFormatado = 'Peso';
            break;
          case 'volume':
            tipoMedidaFormatado = 'Volume';
            break;
          case 'unidade':
            tipoMedidaFormatado = 'Quantidade';
            break;
        }
    
        return tipoMedidaFormatado;
      };

    function groupByDate(items: RegisterItem[]): { [key: string]: RegisterItem[] } {
        return items.reduce((groups, item) => {
            const formattedDate = formatDate(item.dataColeta);
            if (!groups[formattedDate]) {
                groups[formattedDate] = [];
            }
            groups[formattedDate].push(item);
            return groups;
        }, {} as { [key: string]: RegisterItem[] });
    }

    useFocusEffect(
        useCallback(() => {
            obterRegistros();
        }, [])
    );

    return (
        <View style={styles.container}>
        <Text style={styles.header}>Registros</Text>
        <FlatList
            data={Object.keys(groupedItems)}
            renderItem={({ item: date }) => (
                <View>
                    <Text style={styles.dateLabel}>{date}</Text>
                    {groupedItems[date].map((item) => (
                        <View style={styles.card} key={item.idRegistroColeta}>
                            <Text style={styles.cardTitle}>{item.tipoMaterial}</Text>
                            <Text style={styles.cardPrice}><b>Ponto de coleta:</b> {formatCPF(item.nomePontoColeta)}</Text>
                            <Text style={styles.cardPrice}><b>{obterTipoMedidaFormatado(item.tipoMedida)}:</b> {obterMedidaFormatado(Number(item.peso), item.tipoMedida)}</Text>
                            <Text style={styles.cardPrice}><b>Total:</b> {formatCurrency(Number(item.total))}</Text>
                        </View>
                    ))}
                </View>
            )}
            keyExtractor={(item) => item}
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
        borderRadius: 15,
        alignItems: 'center',
        width: '100%',
        borderWidth: 1,
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