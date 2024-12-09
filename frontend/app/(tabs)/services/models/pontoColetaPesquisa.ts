export interface PontoColetaPesquisa {
    idPontoColeta: number;
    nomePontoColeta: string;
    favoritado: boolean;
    avaliacao?: number;
    endereco: string;
    tipoMaterial: string;
    precoMaterial?: number;
    tipoMedida: string;
    foto: string | null;
  }