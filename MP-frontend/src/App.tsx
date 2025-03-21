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
