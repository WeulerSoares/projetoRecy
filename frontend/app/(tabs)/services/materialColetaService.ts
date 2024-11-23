import { MaterialColeta } from "./models/materialColeta";
import axios from 'axios';

const API_URL = 'https://localhost:7167/api/v1/materialColeta';

export class MaterialColetaService {
    static async addMaterialColeta(materialColeta: MaterialColeta): Promise<MaterialColeta> {
        const response = await axios.post<MaterialColeta>(API_URL, materialColeta);
        return response.data;
    }

    static async obterMateriais(idPontoColeta: number): Promise<MaterialColeta[]> {
        const response = await axios.get<MaterialColeta[]>(`${API_URL}/${idPontoColeta}`);
        return response.data;
    }

    static async obterMaterial(idMaterialColeta: number): Promise<MaterialColeta> {
        const response = await axios.get<MaterialColeta>(`${API_URL}/${idMaterialColeta}/tipoMaterial`);
        return response.data;
    }

    static async atualizarMaterial(idMaterialColeta : number, materialColeta : MaterialColeta) {
        const response = await axios.put(`${API_URL}/${idMaterialColeta}`, materialColeta);
        return response.data;
    }

    static async deletarMaterial(idMaterialColeta: number){
        const response = await axios.delete(`${API_URL}/${idMaterialColeta}`);
        return response.data;
    }
}