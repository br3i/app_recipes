import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Comentarios = sequelize.define(
  "comentarios",
  {
    id_comentario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: false,
  }
);
