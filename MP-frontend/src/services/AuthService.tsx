import axios from "axios";
import api from '../utils/axiosInstance';

const API_URL = "https://localhost:8443/auth/login"; // Adjust this to match your backend URL

interface LoginResponse {
  token: string;
  role: string;
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

    const { token, role } = response.data;

    if (!token || !role) {
      throw new Error("Token or Role missing in response");
    }

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    return token;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};


//Liste des appel d'offre
interface AppelOffre {
  num_Ordre_AO: number;
  type_AO: string;
  date_AO: string;
  coutEstime_AO: number;
  cautionProvisoire_AO: number;
  statut_AO: string;
}

export const getAppelsOffre = async (): Promise<AppelOffre[]> => {
  try {
    const response = await api.get("/list"); // Remplacez par l'endpoint de votre API
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des appels d'offre :", error);
    throw error;
  }
};

