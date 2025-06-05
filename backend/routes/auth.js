const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Hardcodierte Benutzerdaten (für Demo-Zwecke)
const ADMIN_USER = {
  username: "admin",
  password: "$2b$10$IfFWisjhn3TPvSNbEibdn.r5ApY8lj5j6L/2gM6GeQ4P507AjDt66", // Passwort: "admin123"
};

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (username !== ADMIN_USER.username) {
    return res.status(401).json({ error: "Ungültiger Benutzername" });
  }
  const isMatch = await bcrypt.compare(password, ADMIN_USER.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Ungültiges Passwort" });
  }
  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.status(200).json({ token });
});

module.exports = router;