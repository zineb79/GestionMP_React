import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Accueil_CS from "./pages/ChefService/Accueil_CS";
import Accueil_Sec from "./pages/Secretaire/Accueil_Sec";
import Unauthorized from "./pages/Unauthorized";
import Add from "./pages/Secretaire/Add_AO";
import List from "./pages/Secretaire/List_AO";
import RoleProtectedRoute from "./utils/RoleProtectedRoute";

function App() {
  return (
    <Router>
  <Routes>
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
      <Route path="/list" element={<List />} />
      <Route path="/add" element={<Add />} />
    </Route>
    
  </Routes>
</Router>
  );
}

export default App;
