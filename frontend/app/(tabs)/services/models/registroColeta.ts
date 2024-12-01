export interface RegistroColeta {
    idPontoColeta: number,
    idUsuario: number,
    idTipoMaterial: number,
    CPFCliente: string,
    total: number,
    peso: number,
    dataDaColeta: Date
}