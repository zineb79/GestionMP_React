import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
  return (
    <Router>
  <Routes>
    <Route path="/." element={<Login />} />
    <Route path="/login" element={<Login />} />
    <Route path="/unauthorized" element={<Unauthorized />} />
    <Route
      element={<RoleProtectedRoute allowedRoles={["CHEF_DE_SERVICE"]} />}
    >
      <Route path="/accueil-chef" element={<Accueil_CS />} />
    </Route>
    <Route
      element={<RoleProtectedRoute allowedRoles={["SECRETAIRE"]} />}
    >
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
  );
}

export default App;
