export interface Usuario {
  id?: number;
  firebaseUid: string;
  nome: string;
  email: string;
  dataNascimento?: Date;
  tipoUsuario: number;
  cpf: string;
  cnpj: string;
  fotoPath: string;
  }