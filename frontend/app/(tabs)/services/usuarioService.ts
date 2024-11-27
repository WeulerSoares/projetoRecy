import axios from 'axios';
import { Usuario } from './models/usuario';
import { PontoColetaFavorito } from './models/pontoColetaFavorito';

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

  static async obterPeloCPF(cpf: string): Promise<Usuario | null | undefined> {
    const response = await axios.get<Usuario>(`${API_URL}/${cpf}/cpf`);
    return response.data && Object.keys(response.data).length > 0 ? response.data : null;
  }

  static async atualizarUsuario(idUsuario: number, usuario: Usuario) {
    const response = await axios.put(`${API_URL}/${idUsuario}`, usuario);
    return response.data;
  }

  static async obterPontosColetaFavoritos(idUsuario: number): Promise<PontoColetaFavorito[]> {
    const response = await axios.get<PontoColetaFavorito[]>(`${API_URL}/${idUsuario}/favoritos/pontosColeta`);
    return response.data;
  }

  static async alterarFavoritoPontoColeta(idUsuario: number, idPontoColeta: number) {
    const response = await axios.patch(`${API_URL}/${idUsuario}/favoritos/${idPontoColeta}`);
    return response.data;
  }

  static async alterarAvaliacaoPontoColeta(idUsuario: number, idPontoColeta: number, avaliacao: number) {
    const response = await axios.patch(`${API_URL}/avaliacao`, {
      idUsuario: idUsuario,
      idPontoColeta: idPontoColeta,
      avaliacao: avaliacao
    });
    return response.data;
  }
}