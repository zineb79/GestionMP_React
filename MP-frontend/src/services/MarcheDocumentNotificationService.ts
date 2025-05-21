import api from "../utils/axiosInstance";

export interface MarcheModification {
  id: number;
  numMarche: string;
  dateModification: string;
  typeModification: 'creation' | 'modification' | 'suppression';
  description: string;
  statut: 'en_attente' | 'validé' | 'rejeté';
}

export interface DocumentModification {
  id: number;
  typeDocument: 'AO' | 'NA' | 'OS' | 'PV' | 'Decompte';
  numDocument: string;
  dateModification: string;
  typeModification: 'creation' | 'modification' | 'suppression';
  description: string;
  statut: 'en_attente' | 'validé' | 'rejeté';
}

export interface MarcheDocumentNotification {
  id: number;
  marcheModification?: MarcheModification;
  documentModification?: DocumentModification;
  dateNotification: string;
  lu: boolean;
  idUtilisateur: number;
}

export const getMarcheNotifications = async (): Promise<MarcheDocumentNotification[]> => {
  try {
    const response = await api.get("/api/MarcheNotification/get");
    return response.data as MarcheDocumentNotification[];
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications de marché:", error);
    throw error;
  }
};

export const getDocumentNotifications = async (): Promise<MarcheDocumentNotification[]> => {
  try {
    const response = await api.get("/api/DocumentNotification/get");
    return response.data as MarcheDocumentNotification[];
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications de document:", error);
    throw error;
  }
};

export const getUnreadNotificationsCount = async (): Promise<number> => {
  try {
    const response = await api.get("/api/MarcheDocumentNotification/getUnreadCount");
    return response.data as number;
  } catch (error) {
    console.error("Erreur lors de la récupération du nombre de notifications non lues:", error);
    throw error;
  }
};

export const markNotificationAsRead = async (id: number): Promise<void> => {
  try {
    await api.put(`/api/MarcheDocumentNotification/markAsRead/${id}`);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut de la notification:", error);
    throw error;
  }
};
