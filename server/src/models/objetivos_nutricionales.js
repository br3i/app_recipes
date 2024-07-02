import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Objetivos_Nutricionales = sequelize.define(
  "objetivos_nutricionales",
  {
    id_objetivo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_objetivo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    descripcion: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: false,
  }
);