import React, { useState, useEffect } from "react";
import axios from "axios";

const PlayerList = () => {
  const [players, setPlayers] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "number", direction: "asc" });
  const [view, setView] = useState("cards");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/players")
      .then((response) => {
        console.log("Geladene Spieler:", response.data);
        setPlayers(response.data);
      })
      .catch((error) => console.error("Fehler beim Abrufen der Spieler:", error));
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
    if (sortConfig.key === "position") {
      const positionOrder = ["Torwart", "Abwehr", "Mittelfeld", "Sturm"];
      return sortConfig.direction === "asc"
        ? positionOrder.indexOf(a.position) - positionOrder.indexOf(b.position)
        : positionOrder.indexOf(b.position) - positionOrder.indexOf(a.position);
    } else if (sortConfig.key === "name") {
      return sortConfig.direction === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortConfig.key === "age") {
      const ageA = a.age || calculateAge(a.birthdate) || 0;
      const ageB = b.age || calculateAge(b.birthdate) || 0;
      return sortConfig.direction === "asc" ? ageA - ageB : ageB - ageA;
    } else if (sortConfig.key === "contract") {
      const dateA = a.contract ? new Date(a.contract).getTime() : 0;
      const dateB = b.contract ? new Date(b.contract).getTime() : 0;
      return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
    } else if (sortConfig.key === "value") {
      const valueA = a.value ? parseFloat(a.value.replace(/[^\d,.]/g, "").replace(",", ".")) : 0;
      const valueB = b.value ? parseFloat(b.value.replace(/[^\d,.]/g, "").replace(",", ".")) : 0;
      return sortConfig.direction === "asc" ? valueA - valueB : valueB - valueA;
    }
    return sortConfig.direction === "asc"
      ? a[sortConfig.key] - b[sortConfig.key]
      : b[sortConfig.key] - a[sortConfig.key];
  });

  const filteredPlayers = sortedPlayers.filter((player) =>
    player.name.toLowerCase().includes(filter.toLowerCase())
  );

  // Berechne Kaderwert
  const calculateKaderValue = () => {
    return filteredPlayers
      .reduce((total, player) => {
        if (!player.value) return total;
        const value = player.value.replace(/[^\d,.]/g, "").replace(",", ".");
        return total + parseFloat(value) * (player.value.includes("Mio") ? 1 : 0.001);
      }, 0)
      .toFixed(2)
      .replace(".", ",") + " Mio. €";
  };

  return (
    <div className="space-y-6">
         <div className="flex flex-col sm:flex-row sm:space-x-4 items-center">
        <input
          type="text"
          placeholder="Spieler suchen..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input flex-1"
        />
        <select
          value={sortConfig.key}
          onChange={(e) => handleSort(e.target.value)}
          className="select"
        >
          <option value="number">Nach Nummer sortieren</option>
          <option value="name">Nach Name sortieren</option>
          <option value="position">Nach Position sortieren</option>
          <option value="age">Nach Alter sortieren</option>
          <option value="contract">Nach Vertrag sortieren</option>
          <option value="value">Nach Marktwert sortieren</option>
        </select>
        <div className="flex space-x-2">
          <button
            onClick={() => setView("cards")}
            className={`button px-4 py-2 ${view === "cards" ? "bg-primary" : "bg-accent"}`}
          >
            Karten
          </button>
          <button
            onClick={() => setView("table")}
            className={`button px-4 py-2 ${view === "table" ? "bg-primary" : "bg-accent"}`}
          >
            Tabelle
          </button>
        </div>
      </div>
      {view === "cards" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredPlayers.map((player) => (
            <div key={player.id} className="card">
              <div className="flex justify-between items-start">
                <h3 className="text-base font-semibold">{player.name}</h3>
                <span className="text-xs font-medium text-gray-500">Nr. {player.number}</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p><strong>Position:</strong> {player.position}</p>
                  {player.specificPosition && (
                    <p>
                      <strong>Spez. Position:</strong>{" "}
                      <span className={`specific-badge specific-${player.specificPosition.toLowerCase()}`}>
                        {player.specificPosition}
                      </span>
                    </p>
                  )}
                </div>
                <div>
                  <p>
                    <strong>Nation:</strong>{" "}
                    {player.nation ? (
                      <span
                        className={`flag-icon fi fi-${player.nation.toLowerCase()}`}
                        title={player.nation.toUpperCase()}
                      ></span>
                    ) : (
                      "-"
                    )}
                  </p>
                  <p><strong>Alter:</strong> {player.age || calculateAge(player.birthdate) || "-"}</p>
                  <p><strong>Vertrag:</strong> {formatContract(player.contract)}</p>
                  <p><strong>Wert:</strong> {player.value || "-"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary text-secondary">
                <th
                  className="p-2 text-left cursor-pointer"
                  onClick={() => handleSort("number")}
                >
                  Nr. {sortConfig.key === "number" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th className="p-2 text-left">Position</th>
                <th className="p-2 text-left">Nation</th>
                <th
                  className="p-2 text-left cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Name {sortConfig.key === "name" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="p-2 text-left cursor-pointer"
                  onClick={() => handleSort("age")}
                >
                  Alter {sortConfig.key === "age" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="p-2 text-left cursor-pointer"
                  onClick={() => handleSort("contract")}
                >
                  Vertrag {sortConfig.key === "contract" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="p-2 text-left cursor-pointer"
                  onClick={() => handleSort("value")}
                >
                  Marktwert {sortConfig.key === "value" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayers.map((player) => (
                <tr key={player.id} className="border-b hover:bg-accent">
                  <td className="p-2">{player.number}</td>
                  <td className="p-2">
                    {player.specificPosition ? (
                      <span className={`specific-badge specific-${player.specificPosition.toLowerCase()}`}>
                        {player.specificPosition}
                      </span>
                    ) : (
                      <span className="badge">{player.position || "-"}</span>
                    )}
                  </td>
                  <td className="p-2">
                    {player.nation ? (
                      <span
                        className={`flag-icon fi fi-${player.nation.toLowerCase()}`}
                        title={player.nation.toUpperCase()}
                      ></span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-2">{player.name}</td>
                  <td className="p-2">{player.age || calculateAge(player.birthdate) || "-"}</td>
                  <td className="p-2">{formatContract(player.contract)}</td>
                  <td className="p-2">
                    <span className="value-badge">{player.value || "-"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="kader-value">
        Gesamtkaderwert: {calculateKaderValue()}
      </div>
    </div>
  );
};

export default PlayerList;