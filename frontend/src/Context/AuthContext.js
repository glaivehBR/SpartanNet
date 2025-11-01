import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // tenta pegar o usuário do localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("spartanUser");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = (username) => {
    const u = { username };
    setUser(u);
    localStorage.setItem("spartanUser", JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("spartanUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
