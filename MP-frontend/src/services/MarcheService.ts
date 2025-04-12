import api from "../utils/axiosInstance";
import { Societe } from "./SocieteService";

export enum TypeMarche {
  TRAVAUX,
  FOURNITURE,
  PRESTATION_SERVICE
}

export enum StatutMarche {
  EN_PREPARATION,
  EN_COURS_TRAITEMENT,
  ADJUGE,
  EN_COURS_DE_VISA,
  EN_COURS_D_APPROBATION,
  EN_ARRET,
  EN_COURS_D_EXECTION,
  HORS_DELAI,
  ACHEVE,
  NOTIFIE,
  CLOTURE
}


export interface Marche {
  id_Marche: number;
  numOrdre: string;
  type_Marche: TypeMarche;
  objet_marche: string;
  statut: StatutMarche;
  delaisGarantie: number;
  delaisMarche: string; // date in YYYY-MM-DD format
  chefServiceConcerne: string | null;
  serviceConcerne: string | null;
  montantFinal: number | null;
  isArchived: boolean;
  societe: Societe;
  appel_offres?: any[];
  notificationAppr?: any;
  ordreDeServices?: any[];
  pvReceptions?: any[];
  decomptes?: any[];
}

export const getMarches = async (): Promise<Marche[]> => {
  try {
    const response = await api.get("/api/marche/get");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des marchés :", error);
    throw error;
  }
};

export const deleteMarche = async (numOrdre: string): Promise<void> => {
  try {
    console.log('Deleting marche with numOrdre:', numOrdre);
    await api.delete(`/api/marche/delete/byNum/${numOrdre}`);
    console.log('Marche deleted successfully');
  } catch (error: any) {
    console.error("Erreur lors de la suppression du marché :", error);
    if (error.response) {
      console.error('Backend error response:', error.response.data);
    }
    throw error;
  }
};

export const createMarche = async (marche: Marche): Promise<Marche> => {
  try {
    const response = await api.post("/api/marche/add", marche);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la création du marché :", error);
    if (error.response) {
      console.error('Backend error response:', error.response.data);
    }
    throw error;
  }
};

export const updateMarche = async (id: number, marche: Marche): Promise<Marche> => {
  try {
    console.log('Updating marche with ID:', id);
    console.log('Marche data:', marche);
    
    // Make sure id_Marche matches the URL parameter
    const marcheToUpdate = {
      ...marche,
      id_Marche: id
    };
    
    const response = await api.put(`/api/marche/update/${id}`, marcheToUpdate);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour du marché :", error);
    if (error.response) {
      console.error('Backend error response:', error.response.data);
    }
    throw error;
  }
};
