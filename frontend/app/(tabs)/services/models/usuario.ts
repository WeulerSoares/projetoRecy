// Defina o tipo do produto com base no retorno da API
export interface Usuario {
    id?: number;
    nome: string;
    cpf: string;
    cnpj: string;
    firebaseUid: string;
    email: string;
    tipoUsuario: string;
    pontosAcumulados: number;
    dataNascimento?: Date;
  }