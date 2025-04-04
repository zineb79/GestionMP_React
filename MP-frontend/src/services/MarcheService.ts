import axios from "axios";
import api from "../utils/axiosInstance";

const API_URL = "https://localhost:8443/auth/login";


interface Marche {
    id_Marche: number;
    numOrdre: string;
    type_Marche: string;
    objet_marche: string;
    statut: string;
    idSociete: number | null;
    idNotification: number | null;
  }
  
  export const getMarches = async (): Promise<Marche[]> => {
    try {
      const response = await api.get("/marche");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des marchés :", error);
      throw error;
    }
  };
  
  export const deleteMarche = async (numOrdre: string): Promise<void> => {
    try {
      await api.delete(`/marche/delete/${numOrdre}`);
    } catch (error) {
      console.error("Erreur lors de la suppression du marché :", error);
      throw error;
    }
  };
  

  export const createMarche = async (marche: Marche): Promise<Marche> => {
    try {
      const response = await api.post("/marche/add", marche);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création du marché :", error);
      throw error;
    }
  };
  

export const updateMarche = async (numOrdre: string, marche: Marche): Promise<Marche> => {
  try {
    const response = await api.put(`/marche/update/${numOrdre}`, marche);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du marché :", error);
    throw error;
  }
};
