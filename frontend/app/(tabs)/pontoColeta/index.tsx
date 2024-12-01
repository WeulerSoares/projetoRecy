import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome5 } from '@expo/vector-icons';
import { UsuarioService } from '../services/usuarioService';
import { Usuario } from '../services/models/usuario';
import { MaterialColetaService } from '../services/materialColetaService';
import { useUser } from '@/components/UserContext';
import { PontoColetaService } from '../services/pontoColetaService';
import measureTypes from '../services/interfaces/measureType';
import { MaterialItem } from '../services/interfaces/materialItem';
import { RegistroColeta } from '../services/models/registroColeta';
import { RegistroColetaService } from '../services/registroColetaService';
import { useRouter } from "expo-router";
import { TipoMaterial } from '../services/enums/tipoMaterial';
import Alert from '@/components/Alert';

export default function RegistrarColeta() {
    const [tipoMaterial, setTipoMaterial] = useState('');
    const [measureType, setMeasureType] = useState('');
    const [cpf, setCpf] = useState('');
    const [usuario, setUsuario] = useState<Usuario>();
    const [items, setItems] = useState<MaterialItem[]>([]);
    const user = useUser();
    const [quantidade, setQuantidade] = useState('');
    const [preco, setPreco] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    
    const router = useRouter();

    async function checaPontoDeColetaExistente(userId: number) {
        try {
            const pontoColeta = await PontoColetaService.getPontoColeta(userId);

            if (pontoColeta !== null) {
                return;
            }

            router.replace("/(tabs)/pontoColeta/opcoesPerfil/profile");
            setShowAlert(true);
            setAlertMessage('É necessário que atualize suas informações para poder seguir com as funcionalidades!');

        } catch (error) {
            console.log(error);
        }

    }

    function resetaCampos() {
        setCpf('');
        setTipoMaterial('');
        setQuantidade('');
    }


    const formatarCPF = (cpfInput: string) => {
        return cpfInput
            .replace(/\D/g, '') // Remove tudo que não é número
            .replace(/(\d{3})(\d)/, '$1.$2') // Coloca ponto
            .replace(/(\d{3})(\d)/, '$1.$2') // Coloca ponto
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Coloca hífen
    };

    const getUserByCPF = async () => {
        try {
            
            const response = await UsuarioService.obterPeloCPF(cpf.replace(/\D/g, ''));

            if(!response) {
                setUsuario(undefined);
                setTipoMaterial('');
                setQuantidade('');
                return;
            }

            setUsuario(response);
            obterItens();
        }
        catch (error) {
            setUsuario(undefined);
            console.log(error);
        }
    }

    const obterItens = async () => {
        try {
            if (user?.id) {
                const pontoColeta = await PontoColetaService.getPontoColeta(user?.id)
                if (pontoColeta) {
                    const response = await MaterialColetaService.obterMateriais(pontoColeta.id);

                    const formattedData: MaterialItem[] = response.map((material: any) => ({
                        id: material.id.toString(),
                        tipo: material.tipoMaterial,
                        medida: material.medida,
                        preco: `R$ ${material.preco.toFixed(2)}`,
                    }));

                    setItems(formattedData);
                }

            }


        }
        catch (error) {
            console.log(error);
        }
    }

    function getTotal() {
        const precoFormatted = parseFloat(preco.replace("R$", "").trim());
        const valor = (parseFloat(quantidade) * precoFormatted).toFixed(2);
        return valor;
    }

    const RegistrarColeta = async () => {
        if(!cpf || !tipoMaterial || !quantidade) {
            setShowAlert(true);
            setAlertMessage('Insira todos os dados para registrar a coleta!');
            return;
        }
        try {
            if (user?.id) {
                const pontoColeta = await PontoColetaService.getPontoColeta(user?.id);
                const usuario = await UsuarioService.obterPeloCPF(cpf.replace(/\D/g, ''));
                if (pontoColeta && usuario) {
                    const registroColeta = {
                        idPontoColeta: pontoColeta.id,
                        idUsuario: usuario.id,
                        idTipoMaterial: parseInt(tipoMaterial),
                        CPFCliente: usuario.cpf,
                        total: parseFloat(getTotal()),
                        peso: parseFloat(quantidade),
                        dataDaColeta: new Date()
                    } as RegistroColeta;

                    const response = await RegistroColetaService.criarRegistroColeta(registroColeta);

                    if (response) {
                        AddPontos();
                        resetaCampos();
                        setShowAlert(true);
                        setAlertMessage('Registro realizado com sucsso!');
                    }
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const AddPontos = async () => {
        try {
            const cliente = await UsuarioService.obterPeloCPF(cpf.replace(/\D/g, ''));
            const usuario = {
                id: cliente!?.id,
                firebaseUid: cliente!.firebaseUid,
                nome: cliente!.nome,
                email: cliente!.email,
                dataNascimento: cliente!.dataNascimento,
                pontosAcumulados: (cliente!.pontosAcumulados + 50),
                tipoUsuario: cliente!.tipoUsuario,
                cpf: cliente!.cpf,
                cnpj: cliente!.cnpj,
                fotoPath: cliente!.fotoPath
            } as Usuario

            if (usuario.id) {
                console.log(usuario.id);
                const response = await UsuarioService.atualizarUsuario(usuario.id, usuario)

                if (response) {
                    setShowAlert(true);
                    setAlertMessage('Você recebeu 50 pontos, parabens!');
                }
            }


        }
        catch (error) {

        }
    }

    useEffect(() => {
        obterItens();
        if (user?.id)
            checaPontoDeColetaExistente(user.id)
    }, []);

    useState(() => {
        if (user?.id)
            checaPontoDeColetaExistente(user.id)

    })

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registrar Coleta</Text>
            <View style={styles.inputContainer}>
                <FontAwesome5 name="id-card" size={18} color="#558C40" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Informe o CPF do reciclador"
                    placeholderTextColor="#558C40"
                    value={cpf}
                    onChangeText={(text) => {
                        const textoFormatado = formatarCPF(text);
                        setCpf(textoFormatado);
                    }}
                    onBlur={() => {
                        let formatarCPF = cpf.replace(/\D/g, '')
                        if (formatarCPF.length == 11)
                            getUserByCPF();
                    }}
                    maxLength={14}
                />
            </View>

            {
                usuario && cpf &&
                <Text style={styles.helperText}>Cliente: {usuario.nome}</Text>

            }

            {
                !usuario && cpf &&
                <Text style={styles.helperText}>Usuario não encontrado na base de dados</Text>
            }

            {
                usuario && (
                    <View style={styles.inputContainer}>
                        <FontAwesome5 name="recycle" size={18} color="#558C40" style={styles.icon} />
                        <View style={styles.pickerWrapper}>
                            <Picker
                                selectedValue={tipoMaterial}
                                onValueChange={(itemValue) => {
                                    setTipoMaterial(itemValue);
                                    obterItens();

                                    const selectedMaterial = items.find((item) => String(item.id) === String(itemValue));

                                    setQuantidade('');

                                    if (selectedMaterial) {
                                        setMeasureType(selectedMaterial.medida);
                                        setPreco(selectedMaterial.preco);
                                    } else {
                                        setMeasureType('');
                                        setPreco('');
                                    }
                                }}
                                style={styles.picker}
                                dropdownIconColor="#558C40" // Ícone do dropdown
                                placeholder="Selecione o tipo de material"
                            >
                                {
                                    !tipoMaterial &&
                                    <Picker.Item label="Selecione o tipo de material" value="" />
                                }
                                {items.map((item) => (
                                    <Picker.Item
                                        key={item.id}
                                        label={`${TipoMaterial[item.tipo as keyof typeof TipoMaterial] || item.tipo} - ${item.preco}`}
                                        value={item.id.toString()}
                                    />
                                ))}
                            </Picker>
                        </View>
                    </View>)
            }

            {
                tipoMaterial && (
                    <TouchableOpacity style={styles.inputContainer}>
                        <FontAwesome5 name="weight" size={18} color="#558C40" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder={`${measureTypes[measureType as keyof typeof measureTypes] || 'Informe o valor'}`}
                            placeholderTextColor="#558C40"
                            keyboardType="numeric"
                            value={quantidade.replace(/[^\d,.-]/g, '').replace(',', '.') || ''}
                            onChangeText={(quantidade) => {
                                setQuantidade(quantidade);
                            }}
                        />
                    </TouchableOpacity>)
            }


            {
                quantidade &&
                <Text style={styles.helperText}>Valor total: R${getTotal()}</Text>
            }

            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    RegistrarColeta();
                }}>
                <Text style={styles.buttonText}>CADASTRAR</Text>
            </TouchableOpacity>

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
        backgroundColor: '#6dc06d',
        paddingHorizontal: 20,
        paddingVertical: 40,
        alignItems: 'center'
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 30,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#8FFB8F',
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 20,
        width: '100%',
        
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#558C40',
        fontWeight: 'bold',
    },
    inputText: {
        flex: 1,
        fontSize: 16,
        color: '#558C40',
    },
    helperText: {
        fontSize: 20,
        color: '#fff',
        marginBottom: 40,
        marginTop: 12,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#559555',
        paddingVertical: 14,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 10,
        width: "50%"
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    pickerWrapper: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#8FFB8F',
        borderRadius: 25, // Borda arredondada
        overflow: 'hidden', // Para garantir que o conteúdo fique dentro da borda arredondada
    },
    picker: {
        width: '100%',
        color: '#558C40',
        backgroundColor: '#8FFB8F',
        borderColor: '#8FFB8F',
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold'
    },
});
