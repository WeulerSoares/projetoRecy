import axios from 'axios';
import { Usuario } from './models/usuario';

const API_URL = 'https://localhost:7167/api/v1/usuario'; // Altere para o IP correto

export class UsuarioService {
  static async getUsuario(firebaseUid: string): Promise<Usuario> {
    const response = await axios.get<Usuario>(`${API_URL}/${firebaseUid}`);
    return response.data;
  }

  static async criarUsuario(usuario: Usuario): Promise<Usuario> {
    const response = await axios.post<Usuario>(API_URL, usuario);
    return response.data;
  }
}