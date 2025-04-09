import { Menu } from "antd";
import {
  HomeOutlined,
  SettingOutlined,
  FileTextOutlined,
  LogoutOutlined,
  BellOutlined,
  TeamOutlined,
  BankOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // Importer useNavigate
import "./sidebar.css";
import React from "react";

interface MenuListProps {
  darkTheme?: boolean;
}

const MenuList: React.FC<MenuListProps> = ({ darkTheme = false }) => {
  const navigate = useNavigate();

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "deconnexion") {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate("/login");
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
        {
          key: "OS",
          label: "Ordre de service",
          children: [
            { key: "OSC", label: "de commencement" },
            { key: "OSA", label: "d'arrêt" },
          ],
        },
        {
          key: "PV",
          label: "PV de réception",
          children: [
            { key: "PVP", label: "Provisoire" },
            { key: "PVD", label: "Définitive" },
          ],
        },
        { key: "Decompte", label: "Décompte" },
      ],
    },
    { key: "notif", icon: <BellOutlined />, label: "Notification" },
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
