import api from "../utils/axiosInstance";
import { Marche } from "./MarcheService";

export enum Type_OS {
  COMMENCEMENT = "COMMENCEMENT",
  ARRET = "ARRET",
  REPRISE = "REPRISE",
  CESSION = "CESSION"
}

export interface OrdreDeService {
  id_OS: number;
  numOrdre_OS: string;
  type_OS: Type_OS;
  date_OS: string;
  marche_OS?: number;
  marche_OS_obj? : Marche;
}

export const getOrdresDeService = async (): Promise<OrdreDeService[]> => {
  try {
    const response = await api.get("/api/OS/get");
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
    const response = await api.post("/api/OS/add", ordreDeService);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de l'ordre de service :", error);
    throw error;
  }
};

export const deleteOrdreDeService = async (id_OS: number): Promise<void> => {
  try {
    await api.delete(`/api/OS/delete/${id_OS}`);
  } catch (error) {
    console.error("Erreur lors de la suppression de l'ordre de service :", error);
    throw error;
  }
};

export const updateOrdreDeService = async (
  id_OS: number,
  ordreDeService: Omit<OrdreDeService, 'id_OS'>
): Promise<OrdreDeService> => {
  try {
    console.log(
      "Mise à jour des données de l'ordre de service au backend:",
      JSON.stringify(ordreDeService, null, 2)
    );
    const response = await api.put(`/api/OS/update/${id_OS}`, ordreDeService);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'ordre de service :", error);
    throw error;
  }
};
