import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ConfigProvider, theme, Button } from 'antd';
import { HiOutlineSun , HiOutlineMoon } from 'react-icons/hi';
import './styles/theme.css';
import Login from "./pages/Login";
import Accueil_CS from "./pages/ChefService/Accueil_CS";
import Accueil_Sec from "./pages/Secretaire/Accueil_Sec";
import Unauthorized from "./pages/Unauthorized";
import List_AO from "./pages/Secretaire/List_Docs/List_AO";
import List_Marche from "./pages/Secretaire/List_Docs/List_Marche";
import Add_Marche from "./pages/Secretaire/Add_Docs/Add_Marche";
import Add_AO from "./pages/Secretaire/Add_Docs/Add_AO";
import Add_OS from "./pages/Secretaire/Add_Docs/Add_OS";
import List_OS from "./pages/Secretaire/List_Docs/List_OS";
import RoleProtectedRoute from "./utils/RoleProtectedRoute";

function App() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  useEffect(() => {
    // Check system preference
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeQuery.matches);

    // Listen for changes
    const listener = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    darkModeQuery.addEventListener('change', listener);
    return () => darkModeQuery.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    document.body.className = isDarkMode ? 'theme-dark' : 'theme-light';
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <div className={`app-container ${isDarkMode ? 'theme-dark' : 'theme-light'}`}>
        <Button
          type="text"
          icon={isDarkMode ? <HiOutlineSun  /> : <HiOutlineMoon  />}
          onClick={toggleTheme}
          style={{
            position: 'fixed',
            top: '70px',
            right: '20px',
            zIndex: 1000,
            color: isDarkMode ? '#fff' : '#000'
          }}
        />
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route element={<RoleProtectedRoute allowedRoles={["CHEF_DE_SERVICE"]} />}>
              <Route path="/accueil-chef" element={<Accueil_CS />} />
            </Route>
            <Route element={<RoleProtectedRoute allowedRoles={["SECRETAIRE"]} />}>
              <Route path="/accueil-secretaire" element={<Accueil_Sec />} />
              <Route path="/add-ao" element={<Add_AO />} />
              <Route path="/list-ao" element={<List_AO />} />
              <Route path="/add-marche" element={<Add_Marche />} />
              <Route path="/list-marche" element={<List_Marche />} />
              <Route path="/add-os" element={<Add_OS />} />
              <Route path="/list-os" element={<List_OS />} />
            </Route>
          </Routes>
        </Router>
      </div>
    </ConfigProvider>

  );
}

export default App;
