import axios from "axios";
import api from "../utils/axiosInstance";

const API_URL = "https://localhost:8443/auth/login";

export interface Notification {
    id_NOTIF: number;
    numOrdre_NOTIF: string;
    dateVisa_NOTIF: string; // Will be sent as ISO string
    dateApprobation_NOTIF: string; // Will be sent as ISO string
}

export const getNotifications = async (): Promise<Notification[]> => {
    try {
      const response = await api.get("/api/Notifications");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications :", error);
      throw error;
    }
  };
  
  export const createNotification = async (
    notification: Notification
  ): Promise<Notification> => {
    try {
      console.log(
        "Envoi des données au backend:",
        JSON.stringify(notification, null, 2)
      );
      const response = await api.post("/api/Notifications/add", notification);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création de la notification :", error);
      throw error;
    }
  };
  
  export const deleteNotification = async (num_Ordre_NOTIF: string): Promise<void> => {
    try {
      await api.delete(`/api/Notifications/delete/${num_Ordre_NOTIF}`);
    } catch (error) {
      console.error("Erreur lors de la suppression de la notification :", error);
      throw error;
    }
  };

  export const updateNotification = async (id: number, notification: Notification): Promise<Notification> => {
    try {
      console.log('Updating Notification with data:', notification);
      const response = await api.put(`/api/Notifications/update/${id}`, notification);
      console.log('Backend response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de la notification :", error);
      if (error.response) {
        console.error('Backend error response:', error.response.data);
      }
      throw error;
    }
  };
  