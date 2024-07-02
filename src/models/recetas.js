import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Recetas = sequelize.define(
  "recetas",
  {
    id_receta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    instrucciones_prep: {
      type: DataTypes.TEXT,
    },
    tiempo_coccion: {
      type: DataTypes.INTEGER,
    },
    calorias_totales: {
      type: DataTypes.DECIMAL,
    },
    proteinas_totales: {
      type: DataTypes.DECIMAL,
    },
    carbohidratos_totales: {
      type: DataTypes.DECIMAL,
    },
    grasas_totales: {
      type: DataTypes.DECIMAL,
    },
    azucares_totales: {
      type: DataTypes.DECIMAL,
    },
    fibra_total: {
      type: DataTypes.DECIMAL,
    },
    sodio_total: {
      type: DataTypes.DECIMAL,
    },
    id_objetivo: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: false,
  }
);