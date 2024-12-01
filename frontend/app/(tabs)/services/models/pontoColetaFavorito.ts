export interface PontoColetaFavorito {
    idPontoColeta: number;
    nomePontoColeta: string;
    favoritado: boolean;
    avaliacao?: number;
    foto: string | null;
  }