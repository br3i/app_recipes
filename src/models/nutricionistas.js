import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Nutricionista = sequelize.define(
  "nutricionista",
  {
    id_nutricionista: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    especialista: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);
