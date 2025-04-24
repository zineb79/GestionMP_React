import api from "../utils/axiosInstance";
import { Marche } from "./MarcheService";
import { getNumOrdreMarche } from "./MarcheService";

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
  idMarche?: number;
  marche_OS_obj?: Marche;
}

export interface OrdreDeServiceWithNumOrdre extends OrdreDeService {
    numMarcheNumOrdre?: string;
}

export const getOrdresDeService = async (): Promise<OrdreDeServiceWithNumOrdre[]> => {
  try {
    const response = await api.get("/api/OS/get");
    const ordresDeService = response.data as OrdreDeService[];

    const ordresAvecNumMarche = await Promise.all(
      ordresDeService.map(async (os) => {
        const numOrdre = os.idMarche ? await getNumOrdreMarche(os.idMarche) : 'N/A';
        return { ...os, numMarcheNumOrdre: numOrdre ?? 'N/A' };
      })
    );

    return ordresAvecNumMarche;
  } catch (error) {
    console.error("Erreur lors de la récupération des ordres de service :", error);
    throw error;
  }
};

export const createOrdreDeService = async (
  ordreDeService: Omit<OrdreDeService, 'id_OS' | 'marche_OS_obj'>
): Promise<OrdreDeService> => {
  try {
    const payload = {
      numOrdre_OS: ordreDeService.numOrdre_OS,
      type_OS: ordreDeService.type_OS,
      date_OS: ordreDeService.date_OS,
      idMarche: ordreDeService.idMarche,
    };

    console.log(
      "Envoi des données au backend:",
      JSON.stringify(payload, null, 2)
    );
    const response = await api.post("/api/OS/add", payload);
    return response.data as OrdreDeService;
  } catch (error) {
    console.error("Erreur lors de la création de l'ordre de service :", error);
    if (error && typeof error === 'object' && 'response' in error) {
      console.error('Backend error response:', (error as any).response.data);
    }
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
  ordreDeService: Omit<OrdreDeService, 'id_OS' | 'marche_OS_obj'>
): Promise<OrdreDeService> => {
  try {
    const payload = {
      numOrdre_OS: ordreDeService.numOrdre_OS,
      type_OS: ordreDeService.type_OS,
      date_OS: ordreDeService.date_OS,
      idMarche: ordreDeService.idMarche,
    };
    console.log(
      "Mise à jour des données de l'ordre de service au backend:",
      JSON.stringify(payload, null, 2)
    );
    const response = await api.put(`/api/OS/update/${id_OS}`, payload);
    return response.data as OrdreDeService;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'ordre de service :", error);
    throw error;
  }
};
