import axios from 'axios';
import { PontoColeta } from "./models/pontoColeta";

const API_URL = 'https://localhost:7167/api/v1/pontocoleta';

export class PontoColetaService {
    static async createPontoColeta(pontoColeta: PontoColeta): Promise<PontoColeta> {
        const response = await axios.post<PontoColeta>(API_URL, pontoColeta);
        return response.data;
    }

    static async updatePontoColeta(pontoColeta: PontoColeta) {
        const response = await axios.put(`${API_URL}`, pontoColeta);
        return response.data;
    }
    
    static async getPontoColeta(idUsuario: number): Promise<PontoColeta | null | undefined> {
        const response = await axios.get<PontoColeta>(`${API_URL}/${idUsuario}`);
        return response.data && Object.keys(response.data).length > 0 ? response.data : null;
    }

    static async getPontosColetaByRange(raio: number, latitude: number, longitude: number): Promise<PontoColeta[] | null | undefined> {
        const response = await axios.get<PontoColeta[]>(`${API_URL}/range/${raio}/${latitude}/${longitude}`);
        return response.data && Object.keys(response.data).length > 0 ? response.data : null;
    }

}