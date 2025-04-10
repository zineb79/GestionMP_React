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
      navigate("/login"); 
    } else if (key === "AO") {
      navigate("/list-ao"); 
    } else if (key === "marche") {
      navigate("/list-marche"); 
    } else if (key === "OS") {
      navigate("/list-os"); 
    }
    else if (key === "NOT") {
      navigate("/list-notification"); 
    }
    else if (key === "PV") {
      navigate("/list-pv"); 
    }
    else if (key === "Decompte") {
      navigate("/list-decompte"); 
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
        { key: "NOT", label: "Notification d'approbation" },
        { key: "OS", label: "Ordre de service" },
        {
          key: "PV",
          label: "PV de réception",
          
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
