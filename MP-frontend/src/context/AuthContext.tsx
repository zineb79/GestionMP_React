import { createContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  token: string | null;
  user: any;
  role: string | null; // Ajout du rôle
  login: (newToken: string) => void; // Mise à jour pour inclure le rôle
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(localStorage.getItem("role")); // Ajout du rôle

  const parseJwt = (token: string): any => {
    try {
      return jwtDecode(token);
    } catch (e) {
      console.log("Token is invalid");
      return null;
    }
  };

  useEffect(() => {
    if (token) {
      const decodedUser = parseJwt(token);
      if (decodedUser) {
        setUser(decodedUser);
      } else {
        logout();
      }
    }
  }, [token]);

  const login = (newToken: string) => {
    const decodedUser = parseJwt(newToken);
    const userRole = localStorage.getItem("role"); // Récupérer le rôle du localStorage

    setToken(newToken);
    setRole(userRole); // Mettre à jour le rôle dans le contexte
    localStorage.setItem("token", newToken);
    setUser(decodedUser);
  };

  const logout = () => {
    setToken(null);
    setRole(null); // Réinitialiser le rôle
    localStorage.removeItem("token");
    localStorage.removeItem("role"); // Supprimer le rôle du localStorage
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;