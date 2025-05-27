import { Menu } from "antd";
import {
  HomeOutlined,
  SettingOutlined,
  FileTextOutlined,
  LogoutOutlined,
  BellOutlined,
  BankOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // Importer useNavigate
import "./sidebar.css";

const MenuList = () => {
  const navigate = useNavigate(); // Initialiser la navigation

  // Gestionnaire de clic
  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "deconnexion") {
      navigate("/login"); 
    } else if (key === "Home") {
      navigate("/accueil-secretaire"); 
    } else if (key === "AO") {
      navigate("/AO"); 
    } else if (key === "marche") {
      navigate("/Marche"); 
    } else if (key === "OS") {
      navigate("/OrdreService"); 
    } else if (key === "NOT") {
      navigate("/Notification"); 
    } else if (key === "PV") {
      navigate("/PV"); 
    } else if (key === "Decompte") {
      navigate("/Decompte"); 
    } else if (key === "Societe") {
      navigate("/Societe");
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
        { key: "PV", label: "PV de réception" },
        { key: "Decompte", label: "Décompte" },
      ],
    },
    {
      key: "Societe",
      icon: <TeamOutlined />,
      label: "Sociétés"
    },
    { key: "deconnexion", icon: <LogoutOutlined />, label: "Se déconnecter" },
  ];

  return (
    <Menu
      onClick={handleMenuClick}
      mode="inline"
      items={items}
      style={{background: '#c6c6c6'}}
    />
  );
};

export default MenuList;
