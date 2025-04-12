import api from "../utils/axiosInstance";
import { Marche } from "./MarcheService";

export interface Notification {
  notificationAppr:{
    id_NOTIF: number;
    numOrdre_NOTIF: string;
    dateVisa_NOTIF: string;
    dateApprobation_NOTIF: string;
    marche_NOTIF: Marche;
  };
}

export const getNotifications = async (): Promise<Notification[]> => {
    try {
      const response = await api.get("/api/Notification/get");
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
      const response = await api.post("/api/Notification/add", notification);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création de la notification :", error);
      throw error;
    }
  };
  
  export const deleteNotification = async (num_Ordre_NOTIF: string): Promise<void> => {
    try {
      await api.delete(`/api/Notification/delete/${num_Ordre_NOTIF}`);
    } catch (error) {
      console.error("Erreur lors de la suppression de la notification :", error);
      throw error;
    }
  };

  export const updateNotification = async (id: number, notification: Notification): Promise<Notification> => {
    try {
      console.log('Updating Notification with data:', notification);
      const response = await api.put(`/api/Notification/update/${id}`, notification);
      console.log('Backend response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de la notification :", error);
      throw error;
    }
  };