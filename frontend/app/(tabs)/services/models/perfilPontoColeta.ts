export default interface PerfilPontoColeta {
    idPontoColeta: number;
    nomePontoColeta: string;
    favoritado: boolean;
    avaliacao?: number;
    materiais: Material[];
    descricao: string; 
}

interface Material {
    id: number;
    tipoMaterial: string;
    medida: string;
    preco: number;
}