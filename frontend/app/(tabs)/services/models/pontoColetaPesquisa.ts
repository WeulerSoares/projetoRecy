export interface PontoColetaPesquisa {
    idPontoColeta: number;
    nomePontoColeta: string;
    favoritado: boolean;
    avaliacao?: number;
    endereco: string;
    foto: string | null;
  }