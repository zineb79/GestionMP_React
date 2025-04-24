import api from "../utils/axiosInstance";
import { Marche } from './MarcheService';

export enum TypePvReception {
    PROVISOIRE = 'PROVISOIRE',
    DEFINITIVE = 'DEFINITIVE'
}

export interface PvReception {
    id_PVR?: number;
    type_PVR: TypePvReception;
    date_PVR: string;
    marche_PVR? : number;
    marche_PVR_obj?: Marche;
}

export const createPvReception = async (
    pvReception: Omit<PvReception, 'id_PVR'>
  ): Promise<PvReception> => {
    try {
      const payload = {
        type_PVR: pvReception.type_PVR,
        date: pvReception.date_PVR,           // Adapter le nom du champ
        idMarche_PVR: pvReception.marche_PVR  // Adapter le nom du champ
      };
  
      console.log("Payload envoyé :", JSON.stringify(payload, null, 2));
  
      const response = await api.post("/api/PvReception/add", payload);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création de la notification :", error);
      throw error;
    }
  };
  

export const getPvReceptions = async (): Promise<PvReception[]> => {
    try {
        const response = await api.get("/api/PvReception/get");
        return response.data;
    } catch (error) {
        console.error('Error fetching PV receptions:', error);
        throw error;
    }
};

export const deletePvReception = async (id: number): Promise<void> => {
    try {
        await api.delete("/api/PvReception/delete/" + id);
    } catch (error) {
        console.error('Error deleting PV reception:', error);
        throw error;
    }
};

export const updatePvReception = async (pvReception: PvReception): Promise<PvReception> => {
    try {
        const response = await api.put("/api/PvReception/update/" + pvReception.id_PVR, pvReception);
        return response.data;
    } catch (error) {
        console.error('Error updating PV reception:', error);
        throw error;
    }
};
