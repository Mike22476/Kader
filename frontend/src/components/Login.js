import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("token", token);
      setToken(token);
      navigate("/admin");
    } catch (error) {
      setError("Ungültiger Benutzername oder Passwort");
    }
  };

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Admin-Login</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Benutzername</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Passwort</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input w-full"
            required
          />
        </div>
        <button type="submit" className="button w-full">
          Einloggen
        </button>
      </form>
    </div>
  );
};

export default Login;