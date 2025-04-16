import api from "../utils/axiosInstance";
import { Societe } from './SocieteService';

export interface Decompte {
    id_D?: number;
    numOrdre_D: string;
    aCompte: number;
    somme_D: number;
    dateFait_D: string;
    datePaiement: string;
    societe_D: number;
    societe_D_obj?: Societe;
    idMarche?: number;
    marche?: any;
}

export const createDecompte = async (
    decompte: Decompte
  ): Promise<Decompte> => {
    try {
      console.log(
        "Envoi des données au backend:",
        JSON.stringify(decompte, null, 2)
      );
      const response = await api.post("/api/decompte/add", decompte);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création du décompte :", error);
      throw error;
    }
  };
export const getDecomptes = async (): Promise<Decompte[]> => {
    try {
        const response = await api.get('/api/decompte/get');
        return response.data;
    } catch (error) {
        console.error('Error fetching decomptes:', error);
        throw error;
    }
};

export const deleteDecompte = async (id: number): Promise<void> => {
    try {
        await api.delete(`/api/decompte/delete/${id}`);
    } catch (error) {
        console.error('Error deleting decompte:', error);
        throw error;
    }
};

export const updateDecompte = async (decompte: Decompte): Promise<Decompte> => {
    try {
        const response = await api.put(`/api/decompte/update/${decompte.id_D}`, decompte);
        return response.data;
    } catch (error) {
        console.error('Error updating decompte:', error);
        throw error;
    }
};
