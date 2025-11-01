import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/auth/login", { username, password });
      const user = res.data.user;
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user)); // <-- salva login localmente
      setMessage("Login realizado com sucesso!");
      navigate("/");
    } catch (err) {
      setMessage("Erro ao logar!");
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleLogin} className="form">
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Usuário" required />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Senha" required />
      <button type="submit">Login</button>
      {message && <p>{message}</p>}
    </form>
  );
}
