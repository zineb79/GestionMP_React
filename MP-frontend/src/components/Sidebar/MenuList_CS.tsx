import { Menu, Badge } from "antd";
import {
  HomeOutlined,
  SettingOutlined,
  FileTextOutlined,
  LogoutOutlined,
  BellOutlined,
  TeamOutlined,
  BankOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUnreadNotificationsCount } from "../../services/MarcheDocumentNotificationService";
import "./sidebar.css";
import React from "react";

interface MenuListProps {
  darkTheme?: boolean;
}

const MenuList: React.FC<MenuListProps> = ({ darkTheme = false }) => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        const count = await getUnreadNotificationsCount();
        setUnreadCount(count);
      } catch (error) {
        console.error("Error fetching unread notifications count:", error);
      }
    };

    fetchUnreadNotifications();
    // Refresh unread count every 30 seconds
    const interval = setInterval(fetchUnreadNotifications, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "deconnexion") {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate("/login");
    }
    else if (key === "Home") {
      navigate("/accueil-chef");
    }
    else if (key === "membre") {
      navigate("/gestionComptes");
    }
    else if (key === "AO") {
      navigate("/DocAO");
    }
    else if (key === "NA") {
      navigate("/DocNotif");
    }
    else if (key === "OS") {
      navigate("/DocOS");
    }
    else if (key === "PV") {
      navigate("/DocPV");
    }
    else if (key === "Decompte") {
      navigate("/DocDecompte");
    }
    else if (key === "dashboard") {
      navigate("/Dashboard");
    }
  };

  const items = [
    { key: "Home", icon: <HomeOutlined />, label: "Accueil" },
    { key: "dashboard", icon: <FileTextOutlined />, label: "Tableau de bord" },
    { key: "marche", icon: <BankOutlined />, label: "Marché" },
    {
      key: "Doc",
      icon: <FileTextOutlined />,
      label: "Documents",
      children: [
        { key: "AO", label: "Appel d'offre" },
        { key: "NA", label: "Notification d'approbation" },
        { key: "OS", label: "Ordre de service" },
        { key: "PV", label: "PV de réception" },
        { key: "Decompte", label: "Décompte" },
      ],
    },
    {
      key: "notif",
      icon: <Badge count={unreadCount} offset={[10, 0]}><BellOutlined /></Badge>,
      label: "Notification",
    },
    { key: "setting", icon: <SettingOutlined />, label: "Paramètres" },
    { key: "membre", icon: <TeamOutlined />, label: "Comptes secrétaires" },
    { key: "deconnexion", icon: <LogoutOutlined />, label: "Se déconnecter" },
  ];

  return (
    <Menu
      theme={darkTheme ? "dark" : "light"}
      mode="inline"
      className="menubar"
      items={items}
      onClick={handleMenuClick} // Ajout de l'événement onClick
    />
  );
};

export default MenuList;
