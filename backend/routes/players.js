const express = require("express");
const multer = require("multer");
const fs = require("fs").promises;
const Player = require("../models/Player"); // Änderung: Direktes Importieren von Player
const authMiddleware = require("../middleware/auth");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/", async (req, res) => {
  try {
    const players = await Player.findAll();
    res.status(200).json(players);
  } catch (error) {
    console.error("Fehler in GET /api/players:", error);
    res.status(500).json({ error: "Serverfehler", details: error.message });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const player = await Player.create(req.body);
    res.status(201).json(player);
  } catch (error) {
    console.error("Fehler in POST /api/players:", error);
    res.status(400).json({ error: "Fehler beim Hinzufügen des Spielers", details: error.message });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id);
    if (!player) return res.status(404).json({ error: "Spieler nicht gefunden" });
    await player.update(req.body);
    res.status(200).json(player);
  } catch (error) {
    console.error("Fehler in PUT /api/players/:id:", error);
    res.status(400).json({ error: "Fehler beim Bearbeiten des Spielers", details: error.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id);
    if (!player) return res.status(404).json({ error: "Spieler nicht gefunden" });
    await player.destroy();
    res.status(200).json({ message: "Spieler gelöscht" });
  } catch (error) {
    console.error("Fehler in DELETE /api/players/:id:", error);
    res.status(400).json({ error: "Fehler beim Löschen des Spielers", details: error.message });
  }
});

router.post("/import", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Keine Datei hochgeladen" });
    }
    const jsonData = JSON.parse(await fs.readFile(req.file.path, "utf8"));
    if (!Array.isArray(jsonData)) {
      return res.status(400).json({ error: "JSON muss ein Array sein" });
    }
    for (const player of jsonData) {
      if (!player.number || !player.name || !player.position) {
        return res.status(400).json({ error: "Fehlende Pflichtfelder: number, name, position" });
      }
      if (!["Torwart", "Abwehr", "Mittelfeld", "Sturm"].includes(player.position)) {
        return res.status(400).json({ error: `Ungültige Position: ${player.position}` });
      }
      if (
        player.specificPosition &&
        !["TW", "IV", "LV", "RV", "LAV", "RAV", "RM", "LM", "ZM", "DM", "OM", "LA", "RA", "ST"].includes(
          player.specificPosition
        )
      ) {
        return res.status(400).json({ error: `Ungültige spezifische Position: ${player.specificPosition}` });
      }
    }
    await Player.bulkCreate(jsonData);
    await fs.unlink(req.file.path);
    res.status(200).json({ message: "Kader erfolgreich importiert" });
  } catch (error) {
    console.error("Import-Fehler:", error);
    res.status(400).json({ error: `Ungültiges JSON-Format oder Serverfehler: ${error.message}` });
  }
});

module.exports = router;