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
import { MaterialItem } from '../services/interfaces/materialItem';

export default function TipoMaterialRecolhido() {

    const [items, setItems] = useState<MaterialItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<MaterialItem | null>(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [tipoMaterial, setTipoMaterial] = useState('');
    const [preco, setPreco] = useState('');
    const [medida, setMedida] = useState('');
    const user = useUser();

    function resetAddInputs() {
        setTipoMaterial('');
        setPreco('');
        setMedida('');
    }

    const addMaterialColeta = async () => {
        if(!tipoMaterial || !medida || !preco) {
            alert("Informe todos os campos para registrar um novo material");
            return;
        }
        try {
            if (user?.id) {
                const pontoColeta = await PontoColetaService.getPontoColeta(user?.id);
                if (pontoColeta) {
                    const materialColeta = {
                        idPontoColeta: pontoColeta.id,
                        medida: medida,
                        tipoMaterial: tipoMaterial,
                        preco: toFloat(preco)
                    } as MaterialColeta;

                    const response = await MaterialColetaService.addMaterialColeta(materialColeta);

                    if (response) {
                        console.log('Material cadastrado com sucesso!', response);
                        obterItens();
                        setAddModalVisible(false);
                        setTipoMaterial('');
                        setPreco('');
                        setMedida('');
                    }
                }
            }
        }

        catch (error) {
            console.log(error);
        }
    }

    const updateMaterialColeta = async () => {
        if(selectedItem && !selectedItem.medida || !selectedItem?.preco) {
            alert("Informe todos os campos para registrar um novo material");
            return;
        }
        try {
            if (selectedItem && user?.id) {
                const pontoColeta = await PontoColetaService.getPontoColeta(user?.id);
                if (pontoColeta) {
                    const precoFormatado = selectedItem.preco.replace(/[^\d,.-]/g, '').replace(',', '.');
                    const materialColeta = {
                        id: selectedItem.id,
                        idPontoColeta: pontoColeta.id,
                        tipoMaterial: selectedItem.tipo,
                        medida: selectedItem.medida,
                        preco: toFloat(precoFormatado)
                    } as MaterialColeta

                    const response = await MaterialColetaService.atualizarMaterial(selectedItem.id, materialColeta);
                    if (response) {
                        alert('Material atualizado com sucesso!');
                        obterItens();
                        setEditModalVisible(false);
                    }
                }
            }

        }
        catch (error) {
            console.log(error);
        }

    }

    const obterItens = async () => {
        try {
            if (user?.id) {
                const pontoColeta = await PontoColetaService.getPontoColeta(user?.id);
                if (pontoColeta) {
                    const response = await MaterialColetaService.obterMateriais(pontoColeta.id);

                    const formattedData: MaterialItem[] = response.map((material: any) => ({
                        id: material.id.toString(),
                        tipo: material.tipoMaterial,
                        medida: material.medida,
                        preco: `R$ ${material.preco.toFixed(2)}/${material.medida}`,
                    }));

                    setItems(formattedData);
                }
            }


        }
        catch (error) {
            console.log(error);
        }
    }

    const deletarMaterial = async () => {
        try {
            if (selectedItem) {
                const response = await MaterialColetaService.deletarMaterial(selectedItem.id);
                alert('Material deletado com sucesso!');
                obterItens();
                setEditModalVisible(false);
            }
        }
        catch (error) {

        }
    }

    useEffect(() => {
        obterItens();
    }, []);

    const renderItem = ({ item }: { item: MaterialItem }) => {
        const label = materialLabels[item.tipo as keyof typeof materialLabels] || item.tipo;
        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => {
                    setSelectedItem(item);
                    setEditModalVisible(true);
                }}
            >
                <Text style={styles.cardTitle}>{label}</Text>
                <Text style={styles.cardPrice}>{item.preco}</Text>
            </TouchableOpacity>
        )
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Materiais Aceitos</Text>
            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={styles.list}
            />

            {/* Botão de adicionar */}
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setAddModalVisible(true)}
            >
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>

            {/* Modal de edição */}
            <Modal
                visible={editModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>
                        Editar {selectedItem?.tipo || ''}
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Preço"
                        keyboardType="numeric"
                        value={selectedItem?.preco.replace(/[^\d,.-]/g, '').replace(',', '.') || ''}
                        onChangeText={(text) =>
                            setSelectedItem((prev) =>
                                prev ? { ...prev, preco: text } : null
                            )
                        }
                    />
                    <Picker
                        style={styles.input}
                        selectedValue={selectedItem?.medida}
                        onValueChange={(value) =>
                            setSelectedItem((prev) =>
                                prev ? { ...prev, medida: value } : null
                            )
                        }
                        dropdownIconColor="#558C40">
                        <Picker.Item label='KG' value="kg" />
                        <Picker.Item label='Volume' value="volume" />
                        <Picker.Item label='Unidade' value="unidade" />
                    </Picker>

                    <View style={styles.modalActions}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={updateMaterialColeta}
                        >
                            <Text style={styles.buttonText}>Salvar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.deleteButton]}
                            onPress={deletarMaterial}
                        >
                            <Text style={styles.buttonText}>Excluir</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={[styles.closeButton, styles.setPadding]}
                        onPress={() => setEditModalVisible(false)}
                    >
                        <Text style={styles.closeButtonText}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* Modal de adição */}
            <Modal
                visible={addModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setAddModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Adicionar Material</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            style={styles.picker}
                            selectedValue={tipoMaterial}
                            onValueChange={(itemValue) => setTipoMaterial(itemValue)}
                            dropdownIconColor="#558C40">
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
                        placeholder="Preço"
                        value={preco.replace(/[^\d,.-]/g, '').replace(',', '.') || ''}
                        keyboardType="numeric"
                        onChangeText={setPreco}
                    />
                    <View style={styles.pickerContainer}>
                        <Picker
                            style={styles.picker}
                            selectedValue={medida}
                            onValueChange={(itemValue) => setMedida(itemValue)}
                            dropdownIconColor="#558C40">
                            <Picker.Item label='Selecione o tipo de medida ▼' value="" />
                            <Picker.Item label='KG' value="kg" />
                            <Picker.Item label='Volume' value="volume" />
                            <Picker.Item label='Unidade' value="unidade" />
                        </Picker>
                    </View>
                    <View style={styles.modalActions}>
                        <TouchableOpacity
                            style={styles.buttonAdd}
                            onPress={addMaterialColeta}
                        >
                            <Text style={styles.buttonText}>Adicionar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => { setAddModalVisible(false), resetAddInputs() }}
                        >
                            <Text style={styles.closeButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#6dc06d',
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#fff',
        marginBottom: 16,
    },
    list: {
        paddingBottom: 80,
    },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        marginVertical: 8,
        borderRadius: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardPrice: {
        fontSize: 14,
        color: '#555',
    },
    addButton: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#4caf50',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButtonText: {
        fontSize: 36,
        color: '#fff',
    },
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
    input: {
        width: '100%',
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 16,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-evenly', // Espaça uniformemente os botões
        alignItems: 'center',           // Alinha verticalmente
        marginTop: 16,                  // Adiciona um espaço acima dos botões
        gap: 8,                         // Espaçamento entre os botões
    },
    button: {
        paddingVertical: 12,            // Ajuste do padding vertical
        paddingHorizontal: 16,          // Ajuste do padding horizontal
        backgroundColor: '#4caf50',
        borderRadius: 8,
        alignItems: 'center',
        width: 120,                     // Define uma largura fixa
    },
    deleteButton: {
        backgroundColor: '#f44336',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    closeButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#888',
        borderRadius: 8,
        alignItems: 'center',
        width: 120,                     // Mesma largura que o botão "Adicionar"
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    buttonAdd: {
        paddingVertical: 12,            // Ajuste do padding vertical
        paddingHorizontal: 16,          // Ajuste do padding horizontal
        backgroundColor: '#4caf50',
        borderRadius: 8,
        alignItems: 'center',
        width: 120,
    },
    setPadding: {
        marginTop: 10
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
        borderRadius: 50,
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
    }
});