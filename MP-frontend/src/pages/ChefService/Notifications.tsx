import React, { useState, useEffect } from 'react';
import Sidebare from '../../components/Sidebar/Sidebar_CS';
import api from '../../utils/axiosInstance';

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

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const destinataireId = userData.id || 1;
        
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
      setNotifications(prev => prev.map(n => 
        n.id === notification.id ? { ...n, vue: true } : n
      ));
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
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  if (loading) return <Sidebare><div className="text-center">Chargement en cours...</div></Sidebare>;
  if (error) return <Sidebare><div className="text-red-500">{error}</div></Sidebare>;

  return (
    <Sidebare>
      <div className="message-interface">
        {selectedNotification ? (
          <div className="message-detail">
            <button 
              onClick={handleBackToList}
              className="back-button"
            >
              ← Retour à la liste
            </button>
            
            <div className="message-header">
              <h2>Mise à jour marché: {selectedNotification.nomMarche}</h2>
              <div className="message-meta">
                <span>Reçu le: {formatDate(selectedNotification.dateEnvoi)}</span>
              </div>
            </div>
            
            <div className="message-content">
              <p>
                <strong>Nouveau statut:</strong> {selectedNotification.statut}
              </p>
            </div>
          </div>
        ) : (
          <div className="message-list">
            <h1>Boîte de réception</h1>
            
            {notifications.length === 0 ? (
              <div className="text-center">
                <p>Aucune nouvelle notification</p>
              </div>
            ) : (
              <ul>
                {notifications.map(notification => (
                  <li
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`message-item ${!notification.vue ? 'unread' : ''}`}
                  >
                    <div className="message-preview">
                      <h3>Mise à jour Marché {notification.nomMarche}</h3>
                      <p className="sender">{notification.statut}</p>
                      <p className="date">{formatDate(notification.dateEnvoi)}</p>
                    </div>
                    {!notification.vue && (
                      <div className="unread-badge">Nouveau</div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </Sidebare>
  );
};

export default MessageInterface;