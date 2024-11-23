import axios from 'axios';
import { PontoColeta } from "./models/pontoColeta";

const API_URL = 'https://localhost:7167/api/v1/pontocoleta'; 

export class PontoColetaService {
    static async obterPontosColeta(): Promise<PontoColeta[]> {
        const response = await axios.get<PontoColeta[]>(API_URL);
        return response.data;
      }

    static async createPontoColeta(pontoColeta: PontoColeta): Promise<PontoColeta> {
        const response = await axios.post<PontoColeta>(API_URL, pontoColeta);
        return response.data;
    }

    static async getPontoColeta(idUsuario: number): Promise<PontoColeta> {
        const response = await axios.get<PontoColeta>(`${API_URL}/${idUsuario}`);
        return response.data;
    }
}