import axios from 'axios';
import { RegistroColeta } from './models/registroColeta';

const API_URL = 'https://localhost:7167/api/v1/registroColeta'; 

export class RegistroColetaService {
    static async obterRegistrosPontoColeta(idPontoColeta: number): Promise<RegistroColeta[]> {
        const response = await axios.get<RegistroColeta[]>(`${API_URL}/${idPontoColeta}`);
        return response.data;
    }

    static async criarRegistroColeta(registroColeta: RegistroColeta): Promise<RegistroColeta> {
        const response = await axios.post<RegistroColeta>(`${API_URL}`,registroColeta);
        return response.data;
    }
}