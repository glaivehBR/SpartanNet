import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="header">
      <h1 className="logo">SpartanNet</h1>
      <nav>
        <Link to="/">Feed</Link>
        {user ? (
          <>
            <Link to="/create-post">Novo Post</Link>
            <span>Olá, {user.username}</span>
            <button onClick={handleLogout}>Sair</button>
          </>
        ) : (
          <>
            <Link to="/login">Entrar</Link>
            <Link to="/register">Registrar</Link>
          </>
        )}
      </nav>
    </header>
  );
}
