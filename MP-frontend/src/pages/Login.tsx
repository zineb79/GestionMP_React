import React, {useState} from 'react';
import './login.css';
import email_icon from '../components/images/icon/mail.png';
import password_icon from '../components/images/icon/password.png';
import logo from '../components/images/img4.png';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (email && password) {
      navigate('/Accueil');
    } else {
      alert("Veuillez remplir tous les champs");
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
            <img src={logo} alt=''/>
          </div>
          <div className="header">
            <div className="text">Connexion</div>
            <div className="underligne"></div>
          </div>
          <div className="inputs">
            <div className="input">
              <img src={email_icon} alt="" />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className="input">
              <img src={password_icon} alt="" />
              <input type="password" placeholder="Mot de Passe" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>
          </div>
          <span>J’ai oublié mon mot de passe</span>
          <div className="btn">
            <div className="btn btn-primary btn-lg" onClick={handleLogin}>Se connecter</div>
          </div>
        </div>
      </div>
    </div>

  )
}


export default Login
