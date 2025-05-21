import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { login } from "../services/AuthService";
import "./login.css";
import email_icon from "../components/images/icon/mail.png";
import password_icon from "../components/images/icon/password.png";
import logo from "../components/images/img4.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await login(email, password);
      console.log("Token reçu:", token); // Debug 1
  
      if (authContext) {
        const refreshToken = localStorage.getItem("refreshToken");
        const role = localStorage.getItem("role");
        console.log("Rôle:", role); // Debug 2
        authContext.login(token, refreshToken || "", role || "");
      }
  
      const role = localStorage.getItem("role");
      console.log("Redirection vers:", role); // Debug 3
  
      if (role === "CHEF_DE_SERVICE") navigate("/accueil-chef");
      else if (role === "SECRETAIRE") navigate("/accueil-secretaire");
      else navigate("/unauthorized");
    } catch (error) {
      console.error("Erreur de connexion:", error); // Debug 4
      alert("Email ou mot de passe invalide");
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="left-bar">
          <p>Service de l'administration général</p>
        </div>
        <div className="right-section">
          <div className="logo-img">
            <img src={logo} alt="" />
          </div>
          <div className="header">
            <div className="text">Connexion</div>
            <div className="underligne"></div>
          </div>
          <form onSubmit={handleLogin} className="inputs">
            <div className="input">
              <img src={email_icon} alt="" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input">
              <img src={password_icon} alt="" />
              <input
                type="password"
                placeholder="Mot de Passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <span>J’ai oublié mon mot de passe</span>
            <div className="btn">
              <button type="submit" className="btn btn-primary btn-lg">
                Se connecter
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;