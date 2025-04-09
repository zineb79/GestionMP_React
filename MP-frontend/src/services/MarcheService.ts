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
