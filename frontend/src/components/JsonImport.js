import React, { useState } from "react";
import axios from "axios";

const JsonImport = ({ token }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post("http://localhost:5000/api/players/import", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Kader erfolgreich importiert!");
      setFile(null);
    } catch (error) {
      alert("Fehler beim Hochladen der Datei");
    }
  };

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">JSON-Kader importieren</h2>
      <input
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="input w-full mb-4"
      />
      <button
        onClick={handleUpload}
        disabled={!file}
        className="button w-full"
      >
        Hochladen
      </button>
    </div>
  );
};

export default JsonImport;