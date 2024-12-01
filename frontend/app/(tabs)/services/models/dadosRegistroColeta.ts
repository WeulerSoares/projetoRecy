export interface DadosRegistroColeta {
    idRegistroColeta: number,
    nomePontoColeta: string;
    cpfCliente: string,
    tipoMaterial: string,
    tipoMedida: string,
    total: number,
    peso: number,
    dataColeta: Date
}