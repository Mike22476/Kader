const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const playerRoutes = require("./routes/players");
const authRoutes = require("./routes/auth");
const { sequelize } = require("./models/Player");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

sequelize.sync().then(() => console.log("SQLite connected"));

app.use("/api/auth", authRoutes);
app.use("/api/players", playerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));