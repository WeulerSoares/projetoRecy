import axios from 'axios';
import { PontoColeta } from "./models/pontoColeta";
import PerfilPontoColeta from './models/perfilPontoColeta';

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
        const response = await axios.get<PontoColeta>(`${API_URL}/usuario/${idUsuario}`);
        return response.data;
    }

    static async obterPerfilPontoColeta(idPontoColeta: number, idUsuario: number): Promise<PerfilPontoColeta> {
        const response = await axios.get<PerfilPontoColeta>(`${API_URL}/${idPontoColeta}/usuario/${idUsuario}`);
        return response.data;
    }

    static async obterFoto(idEmpresa: number): Promise<string> {
        const response = await axios.get<Blob>(`${API_URL}/${idEmpresa}/foto`, {
          responseType: "blob",
        });
    
        return URL.createObjectURL(response.data);
    }
}