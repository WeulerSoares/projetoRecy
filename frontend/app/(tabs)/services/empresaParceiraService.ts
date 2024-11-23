import axios from 'axios';
import { EmpresaParceira } from './models/empresaParceira';

const API_URL = 'https://localhost:7167/api/v1/empresaParceira';

export class EmpresaParceiraService {
  static async obterEmpresas(): Promise<EmpresaParceira[]> {
    const response = await axios.get<EmpresaParceira[]>(`${API_URL}/paraFiltro`);
    return response.data;
  }  
  
  static async criarEmpresaParceira(empresaParceira: EmpresaParceira): Promise<{ message: string; }> {
    const formData = new FormData();

    formData.append("Cnpj", empresaParceira.cnpj);
    formData.append("Nome", empresaParceira.nome);
    formData.append("Email", empresaParceira.email);

    const response = await fetch(empresaParceira.logoPath);
    const blob = await response.blob();

    formData.append("Logo", blob, "logo.png");

    const result = await axios.post<{ message: string; }>(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return result.data;
  }
  
  static async obterLogo(idEmpresa: number): Promise<string> {
    const response = await axios.get<Blob>(`${API_URL}/${idEmpresa}/logo`, {
      responseType: "blob",
    });

    return URL.createObjectURL(response.data);
  }
}