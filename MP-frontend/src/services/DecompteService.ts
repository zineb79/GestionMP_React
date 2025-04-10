import axios from 'axios';

export interface Decompte {
    id_D: number;
    nom_D: string;
    numOrdre_D: string;
    aCompte: number;
    somme_D: number;
    societe_D: {
        id_S: number;
        nom_S: string;
    };
    marche_D: {
        id_M: number;
        numOrdre_M: string;
    };
}

export const createDecompte = async (decompte: Omit<Decompte, 'id_D'>) => {
    try {
        const response = await axios.post('/api/decomptes', decompte);
        return response.data;
    } catch (error) {
        console.error('Error creating decompte:', error);
        throw error;
    }
};

export const getDecomptes = async (): Promise<Decompte[]> => {
    try {
        const response = await axios.get('/api/decomptes');
        return response.data;
    } catch (error) {
        console.error('Error fetching decomptes:', error);
        throw error;
    }
};

export const deleteDecompte = async (id: number): Promise<void> => {
    try {
        await axios.delete(`/api/decomptes/${id}`);
    } catch (error) {
        console.error('Error deleting decompte:', error);
        throw error;
    }
};

export const updateDecompte = async (decompte: Decompte): Promise<Decompte> => {
    try {
        const response = await axios.put(`/api/decomptes/${decompte.id_D}`, decompte);
        return response.data;
    } catch (error) {
        console.error('Error updating decompte:', error);
        throw error;
    }
};
