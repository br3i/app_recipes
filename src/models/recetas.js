import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Objetivos_Nutricionales } from "./objetivos_nutricionales.js";

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
      references: {
        model: Objetivos_Nutricionales,
        key: "id_objetivo",
      },
    },
  },
  {
    timestamps: false,
  }
);

Recetas.belongsTo(Objetivos_Nutricionales, { foreignKey: "id_objetivo" });