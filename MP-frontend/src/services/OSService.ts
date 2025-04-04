import axios from "axios";
import api from "../utils/axiosInstance";

const API_URL = "https://localhost:8443/auth/login";

interface OrdreDeService {
  id_OS: number;
  type_OS: string;
  marche_OS: {
    id_Marche: number;
    numOrdre: string;
    objet_marche: string;
  };
}

export const getOrdresDeService = async (): Promise<OrdreDeService[]> => {
  try {
    const response = await api.get("/os");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des ordres de service :", error);
    throw error;
  }
};

export const createOrdreDeService = async (
  ordreDeService: Omit<OrdreDeService, 'id_OS'>
): Promise<OrdreDeService> => {
  try {
    console.log(
      "Envoi des données au backend:",
      JSON.stringify(ordreDeService, null, 2)
    );
    const response = await api.post("/os/add", ordreDeService);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de l'ordre de service :", error);
    throw error;
  }
};

export const deleteOrdreDe = async (numOrdreAO: string): Promise<void> => {
  try {
    await api.delete(`/list/delete/${numOrdreAO}`);
  } catch (error) {
    console.error("Erreur lors de la suppression de l'appel d'offre :", error);
    throw error;
  }
};
  
  
  
  