import React, { useState, useEffect } from 'react';
import Sidebare from '../../components/Sidebar/Sidebar_CS';
import api from '../../utils/axiosInstance'; // Importez votre instance axios configurée

interface Notification {
  id: number;
  nomMarche: string;
  statut: string;
  destinataire: number;
  dateEnvoi: string;
  vue: boolean;
}

const MessageInterface: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Récupération de l'ID de l'utilisateur connecté (à adapter selon votre auth)
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const destinataireId = userData.id || 1; // Fallback à 1 si non trouvé
        
        const response = await api.get(`/api/notifications/non-vues?destinataire=${destinataireId}`);
        setNotifications(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des notifications');
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (notification: Notification) => {
    try {
      await api.post('/api/notifications/marquer-vue', [notification.id]);
      
      // Mise à jour optimiste de l'état local
      setNotifications(prev => prev.map(n => 
        n.id === notification.id ? { ...n, vue: true } : n
      ));
      setSuccess('Notification marquée comme lue');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erreur lors du marquage comme lu');
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.vue) {
      markAsRead(notification);
    }
    setSelectedNotification(notification);
  };

  const handleBackToList = () => {
    setSelectedNotification(null);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  if (loading) return <Sidebare><div className="text-center">Chargement en cours...</div></Sidebare>;
  if (error) return <Sidebare><div className="text-red-500">{error}</div></Sidebare>;

  return (
    <Sidebare>
      <div className="p-4">
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        
        {selectedNotification ? (
          <div className="bg-white rounded-lg shadow p-6">
            <button 
              onClick={handleBackToList}
              className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour à la liste
            </button>
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Mise à jour marché: {selectedNotification.nomMarche}
              </h2>
              <div className="text-sm text-gray-500 mt-2">
                Reçu le: {formatDate(selectedNotification.dateEnvoi)}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-gray-700">
                <span className="font-semibold">Nouveau statut:</span> {selectedNotification.statut}
              </p>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Notifications</h1>
            
            {notifications.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500">Aucune nouvelle notification</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-all hover:shadow-md ${
                      notification.vue ? 'opacity-90' : 'border-l-4 border-blue-500'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Mise à jour marché: {notification.nomMarche}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Statut: {notification.statut}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatDate(notification.dateEnvoi)}
                        </p>
                      </div>
                      {!notification.vue && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          Nouveau
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Sidebare>
  );
};

export default MessageInterface;