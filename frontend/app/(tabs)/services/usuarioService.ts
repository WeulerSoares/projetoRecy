import axios from 'axios';
import { Usuario } from './models/usuario';

const API_URL = 'https://localhost:7167/api/v1/usuario';

export class UsuarioService {
  static async getUsuario(firebaseUid: string): Promise<Usuario> {
    const response = await axios.get<Usuario>(`${API_URL}/${firebaseUid}`);
    return response.data;
  }

  static async criarUsuario(usuario: Usuario): Promise<{ message: string; }> {
    const response = await axios.post<{ message: string; }>(API_URL, usuario);
    return response.data;
  }

  static async obterFoto(idUsuario: number): Promise<string> {
    const response = await axios.get<Blob>(`${API_URL}/${idUsuario}/foto`, {
      responseType: "blob",
    });

    return URL.createObjectURL(response.data);
  }

  static async adicionarFoto(idUsuario: number, fotoPath: string) {
    const formData = new FormData();

    formData.append("IdUsuario", idUsuario.toString());

    const response = await fetch(fotoPath);
    const blob = await response.blob();

    formData.append("Foto", blob, "foto.png");

    const result = await axios.post(`${API_URL}/foto`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return result.data;
  }

  static async obterPontosAcumulados(idUsuario: number): Promise<number> {
    const response = await axios.get<number>(`${API_URL}/${idUsuario}/pontos`);
    return response.data;
  }
}