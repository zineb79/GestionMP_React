import axios from 'axios';

export enum TypePvReception {
    PROVISOIRE = 'PROVISOIRE',
    DEFINITIVE = 'DEFINITIVE'
}

export interface PvReception {
    id_PVR: number;
    type_PVR: TypePvReception;
    date_PVR: string;
    marche_PVR: {
        id_M: number;
        numOrdre_M: string;
    };
}

export const createPvReception = async (pvReception: Omit<PvReception, 'id_PVR'>) => {
    try {
        const response = await axios.post('/api/pv-receptions', pvReception);
        return response.data;
    } catch (error) {
        console.error('Error creating PV reception:', error);
        throw error;
    }
};

export const getPvReceptions = async (): Promise<PvReception[]> => {
    try {
        const response = await axios.get('/api/pv-receptions');
        return response.data;
    } catch (error) {
        console.error('Error fetching PV receptions:', error);
        throw error;
    }
};

export const deletePvReception = async (id: number): Promise<void> => {
    try {
        await axios.delete(`/api/pv-receptions/${id}`);
    } catch (error) {
        console.error('Error deleting PV reception:', error);
        throw error;
    }
};

export const updatePvReception = async (pvReception: PvReception): Promise<PvReception> => {
    try {
        const response = await axios.put(`/api/pv-receptions/${pvReception.id_PVR}`, pvReception);
        return response.data;
    } catch (error) {
        console.error('Error updating PV reception:', error);
        throw error;
    }
};
