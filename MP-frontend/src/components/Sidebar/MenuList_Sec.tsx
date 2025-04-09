import { Menu } from "antd";
import {
  HomeOutlined,
  SettingOutlined,
  FileTextOutlined,
  LogoutOutlined,
  BellOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // Importer useNavigate
import "./sidebar.css";
import React from "react";

const MenuList = () => {
  const navigate = useNavigate(); // Initialiser la navigation

  // Gestionnaire de clic
  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "deconnexion") {
      // Ici, tu peux aussi ajouter la logique pour supprimer le token de l'utilisateur
      navigate("/login"); // Redirection vers la page de connexion
    } else if (key === "AO") {
      navigate("/list-ao"); // Redirection vers la page List_AO
    } else if (key === "marche") {
      navigate("/list-marche"); // Redirection vers la page List_Marche
    } else if (key === "OS") {
      navigate("/list-os"); // Redirection vers la page List_OS
    }
  };

  const items = [
    { key: "Home", icon: <HomeOutlined />, label: "Accueil" },
    { key: "marche", icon: <BankOutlined />, label: "Marché" },
    {
      key: "Doc",
      icon: <FileTextOutlined />,
      label: "Documents",
      children: [
        { key: "AO", label: "Appel d'offre" },
        { key: "NA", label: "Notification d'approbation" },
        { key: "OS", label: "Ordre de service" },
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
    { key: "deconnexion", icon: <LogoutOutlined />, label: "Se déconnecter" },
  ];

  return (
    <Menu
      onClick={handleMenuClick}
      mode="inline"
      items={items}
    />
  );
};

export default MenuList;
