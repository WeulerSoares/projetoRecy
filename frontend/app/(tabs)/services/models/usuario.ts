// Defina o tipo do produto com base no retorno da API
export interface Usuario {
    firebaseUid: string;
    nome: string;
    email: string;
    dataNascimento?: Date;
    pontosAcumulados: number;
    tipoUsuario: string;
    cpf: string;
    cnpj: string;
  }