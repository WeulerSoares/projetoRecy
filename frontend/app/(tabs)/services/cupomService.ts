import axios from 'axios';
import { Cupom } from './models/cupom';
import { CupomVisualizacao } from './models/cupomVisualizacao';

const API_URL = 'https://localhost:7167/api/v1/cupom';

export class CupomService {
  static async obterCupons(): Promise<CupomVisualizacao[]> {
    const response = await axios.get<CupomVisualizacao[]>(API_URL);
    return response.data;
  }
  
  static async criarCupom(cupom: Cupom): Promise<{ message: string; }> {
    const response = await axios.post<{ message: string; }>(API_URL, cupom);
    return response.data;
  }
  
  static async resgatarCupom(idUsuario: number, idCupom: number): Promise<{ message: string; }> {
    const response = await axios.post<{ message: string; }>(`${API_URL}/${idCupom}/usuario/${idUsuario}`);
    return response.data;
  }
}