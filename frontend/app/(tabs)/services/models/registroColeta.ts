export interface RegistroColeta {
    idPontoColeta: number,
    idFirebaseCliente: string,
    idTipoMaterial: number,
    CPFCliente: string,
    total: number,
    peso: number,
    dataDaColeta: Date
}