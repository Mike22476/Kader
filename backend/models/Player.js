const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Player = sequelize.define("Player", {
  number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  position: {
    type: DataTypes.ENUM("Torwart", "Abwehr", "Mittelfeld", "Sturm"),
    allowNull: false,
  },
  specificPosition: {
    type: DataTypes.ENUM(
      "TW",
      "IV",
      "LV",
      "RV",
      "LAV",
      "RAV",
      "RM",
      "LM",
      "ZM",
      "DM",
      "OM",
      "LA",
      "RA",
      "ST"
    ),
    allowNull: true,
  },
  birthdate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  nation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contract: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  value: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Player;