import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPlayerList = () => {
  const [players, setPlayers] = useState([]);
  const [filter, setFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "number", direction: "asc" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Nicht eingeloggt. Bitte anmelden.");
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get("http://localhost:5000/api/players", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Geladene Spieler:", response.data);
        setPlayers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fehler beim Abrufen der Spieler:", error);
        setError("Fehler beim Laden der Spieler.");
        setLoading(false);
      });
  }, []);

  // Alter berechnen
  const calculateAge = (birthdate) => {
    if (!birthdate) return "-";
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Vertrag formatieren
  const formatContract = (contract) => {
    if (!contract) return "-";
    const date = new Date(contract);
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Sortierung
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedPlayers = [...players].sort((a, b) => {
    if (sortConfig.key === "name") {
      return sortConfig.direction === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortConfig.key === "value") {
      const valueA = a.value ? parseFloat(a.value.replace(/[^\d,.]/g, "").replace(",", ".")) : 0;
      const valueB = b.value ? parseFloat(b.value.replace(/[^\d,.]/g, "").replace(",", ".")) : 0;
      return sortConfig.direction === "asc" ? valueA - valueB : valueB - valueA;
    } else if (sortConfig.key === "age") {
      const ageA = a.age || calculateAge(a.birthdate) || 0;
      const ageB = b.age || calculateAge(b.birthdate) || 0;
      return sortConfig.direction === "asc" ? ageA - ageB : ageB - ageA;
    } else if (sortConfig.key === "contract") {
      const dateA = a.contract ? new Date(a.contract).getTime() : 0;
      const dateB = b.contract ? new Date(b.contract).getTime() : 0;
      return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
    }
    return sortConfig.direction === "asc"
      ? a[sortConfig.key] - b[sortConfig.key]
      : b[sortConfig.key] - a[sortConfig.key];
  });

  // Filterung
  const filteredPlayers = sortedPlayers.filter(
    (player) =>
      player.name.toLowerCase().includes(filter.toLowerCase()) &&
      (!positionFilter || player.specificPosition === positionFilter)
  );

  // Löschen eines Spielers
  const handleDelete = (id) => {
    const token = localStorage.getItem("token");
    axios
      .delete(`http://localhost:5000/api/players/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setPlayers(players.filter((p) => p.id !== id));
        setShowDeleteModal(null);
        setSuccessMessage("Spieler erfolgreich gelöscht.");
        setTimeout(() => setSuccessMessage(null), 3000);
      })
      .catch((error) => {
        console.error("Fehler beim Löschen:", error);
        setError("Löschen fehlgeschlagen: Nicht autorisiert oder Serverfehler.");
      });
  };

  // Einzigartige Positionen für Filter-Dropdown
  const positionOptions = [...new Set(players.map((p) => p.specificPosition).filter(Boolean))];

  if (loading) return <div className="text-center p-4">Lade Spieler...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Spielerübersicht</h2>
      {successMessage && (
        <div className="bg-green-500 text-white p-2 rounded">{successMessage}</div>
      )}
      <div className="flex flex-col sm:flex-row sm:space-x-4 items-center">
        <input
          type="text"
          placeholder="Spieler suchen..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input flex-1"
        />
        <select
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
          className="select"
        >
          <option value="">Alle Positionen</option>
          {positionOptions.map((pos) => (
            <option key={pos} value={pos}>
              {pos}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-9 gap-2 bg-primary text-secondary p-2 rounded-t">
          <div className="cursor-pointer" onClick={() => handleSort("number")}>
            Nr. {sortConfig.key === "number" && (sortConfig.direction === "asc" ? "↑" : "↓")}
          </div>
          <div>Position</div>
          <div>Nation</div>
          <div className="cursor-pointer" onClick={() => handleSort("name")}>
            Name {sortConfig.key === "name" && (sortConfig.direction === "asc" ? "↑" : "↓")}
          </div>
          <div>Spez. Pos.</div>
          <div className="cursor-pointer" onClick={() => handleSort("age")}>
            Alter {sortConfig.key === "age" && (sortConfig.direction === "asc" ? "↑" : "↓")}
          </div>
          <div className="cursor-pointer" onClick={() => handleSort("contract")}>
            Vertrag {sortConfig.key === "contract" && (sortConfig.direction === "asc" ? "↑" : "↓")}
          </div>
          <div className="cursor-pointer" onClick={() => handleSort("value")}>
            Marktwert {sortConfig.key === "value" && (sortConfig.direction === "asc" ? "↑" : "↓")}
          </div>
          <div>Aktionen</div>
        </div>
        {filteredPlayers.map((player) => (
          <div
            key={player.id}
            className="player-card grid grid-cols-9 gap-2 bg-card-bg p-2 rounded shadow hover:bg-accent"
          >
            <div>{player.number}</div>
            <div>
              {player.specificPosition ? (
                <span className={`specific-badge specific-${player.specificPosition.toLowerCase()}`}>
                  {player.specificPosition}
                </span>
              ) : (
                <span className="badge">{player.position || "-"}</span>
              )}
            </div>
            <div>
              {player.nation ? (
                <span
                  className={`flag-icon fi fi-${player.nation.toLowerCase()}`}
                  title={player.nation.toUpperCase()}
                ></span>
              ) : (
                "-"
              )}
            </div>
            <div>{player.name}</div>
            <div>{player.specificPosition || "-"}</div>
            <div>{player.age || calculateAge(player.birthdate) || "-"}</div>
            <div>{formatContract(player.contract)}</div>
            <div>
              <span className="value-badge">{player.value || "-"}</span>
            </div>
            <div className="flex space-x-2">
              <button className="button bg-primary text-secondary px-2 py-1">
                Bearbeiten
              </button>
              <button
                className="button bg-red-500 text-white px-2 py-1"
                onClick={() => setShowDeleteModal(player.id)}
              >
                Löschen
              </button>
            </div>
          </div>
        ))}
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-card-bg p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Spieler löschen?</h3>
            <p className="mt-2">Möchten Sie diesen Spieler wirklich löschen?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="button bg-gray-500 text-white px-4 py-2"
                onClick={() => setShowDeleteModal(null)}
              >
                Abbrechen
              </button>
              <button
                className="button bg-red-500 text-white px-4 py-2"
                onClick={() => handleDelete(showDeleteModal)}
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPlayerList;