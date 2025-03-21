import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Accueil_CS from "./pages/ChefService/Accueil_CS";
import Accueil_Sec from "./pages/Secretaire/Accueil_Sec";
import Unauthorized from "./pages/Unauthorized";
import Add from "./pages/Secretaire/Add_AO";
import List from "./pages/Secretaire/List_AO";
import RoleProtectedRoute from "./utils/RoleProtectedRoute";

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Accueil from './pages/Accueil';
import Sidebar from './components/Sidebar/Sidebar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/accueil" element={<Accueil />} />
      </Routes>
    </Router>
  );

}

export default App;
