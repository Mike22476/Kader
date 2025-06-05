import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPanel = ({ token }) => {
  const [players, setPlayers] = useState([]);
  const [editPlayer, setEditPlayer] = useState(null);
  const [formData, setFormData] = useState({
    number: "",
    name: "",
    position: "",
    specificPosition: "",
    birthdate: "",
    age: "",
    nation: "",
    contract: "",
    value: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/players", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setPlayers(response.data))
      .catch((error) => console.error("Fehler beim Abrufen der Spieler:", error));
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editPlayer) {
        await axios.put(`http://localhost:5000/api/players/${editPlayer.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Spieler aktualisiert!");
      } else {
        await axios.post("http://localhost:5000/api/players", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Spieler hinzugefügt!");
      }
      setFormData({
        number: "",
        name: "",
        position: "",
        specificPosition: "",
        birthdate: "",
        age: "",
        nation: "",
        contract: "",
        value: "",
      });
      setEditPlayer(null);
      axios
        .get("http://localhost:5000/api/players", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setPlayers(response.data));
    } catch (error) {
      alert("Fehler beim Speichern des Spielers");
    }
  };

  const handleEdit = (player) => {
    setEditPlayer(player);
    setFormData(player);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/players/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Spieler gelöscht!");
      setPlayers(players.filter((player) => player.id !== id));
    } catch (error) {
      alert("Fehler beim Löschen des Spielers");
    }
  };

  return (
    <div className="space-y-8">
      <div className="card">
        <h2 className="text-xl font-bold mb-4">
          {editPlayer ? "Spieler bearbeiten" : "Spieler hinzufügen"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Trikotnummer</label>
            <input
              type="number"
              name="number"
              placeholder="Trikotnummer"
              value={formData.number}
              onChange={handleChange}
              className="input w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="input w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Position</label>
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="select w-full"
              required
            >
              <option value="">Position wählen</option>
              <option value="Torwart">Torwart</option>
              <option value="Abwehr">Abwehr</option>
              <option value="Mittelfeld">Mittelfeld</option>
              <option value="Sturm">Sturm</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Spezifische Position</label>
            <select
              name="specificPosition"
              value={formData.specificPosition}
              onChange={handleChange}
              className="select w-full"
            >
              <option value="">Keine</option>
              <option value="TW">Torwart (TW)</option>
              <option value="IV">Innenverteidiger (IV)</option>
              <option value="LV">Linker Verteidiger (LV)</option>
              <option value="RV">Rechter Verteidiger (RV)</option>
              <option value="LAV">Linker Außenverteidiger (LAV)</option>
              <option value="RAV">Rechter Außenverteidiger (RAV)</option>
              <option value="RM">Rechtes Mittelfeld (RM)</option>
              <option value="LM">Linkes Mittelfeld (LM)</option>
              <option value="ZM">Zentrales Mittelfeld (ZM)</option>
              <option value="DM">Defensives Mittelfeld (DM)</option>
              <option value="OM">Offensives Mittelfeld (OM)</option>
              <option value="LA">Linker Außenstürmer (LA)</option>
              <option value="RA">Rechter Außenstürmer (RA)</option>
              <option value="ST">Stürmer (ST)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Geburtsdatum</label>
            <input
              type="text"
              name="birthdate"
              placeholder="z.B. 12.05.1993"
              value={formData.birthdate}
              onChange={handleChange}
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Alter</label>
            <input
              type="number"
              name="age"
              placeholder="Alter"
              value={formData.age}
              onChange={handleChange}
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nation</label>
            <input
              type="text"
              name="nation"
              placeholder="z.B. de"
              value={formData.nation}
              onChange={handleChange}
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Vertrag bis</label>
            <input
              type="text"
              name="contract"
              placeholder="z.B. 2026"
              value={formData.contract}
              onChange={handleChange}
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Marktwert</label>
            <input
              type="text"
              name="value"
              placeholder="z.B. 800 Tsd. €"
              value={formData.value}
              onChange={handleChange}
              className="input w-full"
            />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="button w-full">
              {editPlayer ? "Aktualisieren" : "Hinzufügen"}
            </button>
          </div>
        </form>
      </div>
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Spielerliste</h2>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Nr.</th>
                <th>Name</th>
                <th>Position</th>
                <th>Spezifische Position</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.id}>
                  <td>{player.number}</td>
                  <td>{player.name}</td>
                  <td>{player.position}</td>
                  <td>{player.specificPosition || "-"}</td>
                  <td className="space-x-2">
                    <button
                      onClick={() => handleEdit(player)}
                      className="button bg-yellow-500 hover:bg-yellow-600 px-3 py-1"
                    >
                      Bearbeiten
                    </button>
                    <button
                      onClick={() => handleDelete(player.id)}
                      className="button bg-red-500 hover:bg-red-600 px-3 py-1"
                    >
                      Löschen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;