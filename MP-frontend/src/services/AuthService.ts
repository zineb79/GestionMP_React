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




