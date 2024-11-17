import axios from 'axios';
import { PontoColeta } from "./models/pontoColeta";

const API_URL = 'https://localhost:7167/api/v1/pontocoleta'; 

export class PontoColetaService {
    static async createPontoColeta(pontoColeta: PontoColeta): Promise<PontoColeta> {
        const response = await axios.post<PontoColeta>(API_URL, pontoColeta);
        return response.data;
    }
}