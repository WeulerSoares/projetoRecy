import axios from 'axios';
import { Cupom } from './models/cupom';

const API_URL = 'https://localhost:7167/api/v1/cupom';

export class CupomService {
  static async obterCupons(): Promise<Cupom[]> {
    const response = await axios.get<Cupom[]>(API_URL);
    return response.data;
  }

  static async criarCupom(cupom: Cupom): Promise<Cupom> {
    const response = await axios.post<Cupom>(API_URL, cupom);
    return response.data;
  }
}