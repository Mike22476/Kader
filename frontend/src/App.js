import React, { useState, useEffect } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import PlayerList from "./components/PlayerList";
import AdminPanel from "./components/AdminPanel";
import JsonImport from "./components/JsonImport";
import Login from "./components/Login";
import "./App.css";
import AdminPlayerList from "./components/AdminPlayerList";

const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <div className="min-h-screen">
      <header className="header">
        <h1 className="text-xl font-bold">VfL Bochum Kader-Management</h1>
        <nav className="flex items-center space-x-2">
          <Link to="/" className="nav-link">Kader</Link>
          {token ? (
            <>
              <Link to="/admin" className="nav-link">Admin</Link>
              <Link to="/import" className="nav-link">JSON-Import</Link>
              <button onClick={handleLogout} className="nav-link text-red-300 hover:text-red-400">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-link">Login</Link>
          )}
          <button
            onClick={toggleTheme}
            className="button px-4 py-2"
          >
            {theme === "light" ? "Darkmode" : "Lightmode"}
          </button>
        </nav>
      </header>
      <main className="container py-6">
        <Routes>
          <Route path="/" element={<PlayerList />} />
          <Route
            path="/admin"
            element={token ? <AdminPanel token={token} /> : <Navigate to="/login" />}
          />
          <Route
            path="/import"
            element={token ? <JsonImport token={token} /> : <Navigate to="/login" />}
          />
          <Route path="/login" element={<Login setToken={setToken} />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;