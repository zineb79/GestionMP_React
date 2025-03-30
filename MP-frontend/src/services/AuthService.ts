import axios from "axios";
import api from "../utils/axiosInstance";

const API_URL = "https://localhost:8443/auth/login"; // Adjust this to match your backend URL

interface LoginResponse {
  token: string;
  role: string;
  nom: string;
  prenom: string;
}

export const login = async (
  email: string,
  password: string
): Promise<string> => {
  try {
    const response = await axios.post<LoginResponse>(
      API_URL,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    const { token, role, nom, prenom } = response.data;

    if (!token || !role || !nom || !prenom) {
      throw new Error("Token or Role missing in response");
    }

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("nom", nom);
    localStorage.setItem("prenom", prenom);

    return token;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};

//Liste des appel d'offre
interface AppelOffre {
  num_Ordre_AO: string; // Changed to string since it's used as String in backend
  type_AO: string;
  date_AO: string;
  coutEstime_AO: number;
  cautionProvisoire_AO: number;
  statut_AO: string;
  idMarche: number;
}

export const getAppelsOffre = async (): Promise<AppelOffre[]> => {
  try {
    const response = await api.get("/list");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des appels d'offre :", error);
    throw error;
  }
};

export const createAppelOffre = async (
  appelOffre: AppelOffre
): Promise<AppelOffre> => {
  try {
    console.log(
      "Envoi des données au backend:",
      JSON.stringify(appelOffre, null, 2)
    );
    const response = await api.post("/list/add", appelOffre);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de l'appel d'offre :", error);
    throw error;
  }
};

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



