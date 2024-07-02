import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Administradores = sequelize.define(
  "administradores",
  {
    id_administrador: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },
  {
    timestamps: false,
  }
);
