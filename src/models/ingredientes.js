import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Ingredientes = sequelize.define(
  "ingredientes",
  {
    id_ingrediente: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoria: {
      type: DataTypes.STRING,
    },
    calorias: {
      type: DataTypes.DECIMAL,
    },
    proteinas: {
      type: DataTypes.DECIMAL,
    },
    carbohidratos: {
      type: DataTypes.DECIMAL,
    },
    grasas: {
      type: DataTypes.DECIMAL,
    },
    azucar: {
      type: DataTypes.DECIMAL,
    },
    fibra: {
      type: DataTypes.DECIMAL,
    },
    sodio: {
      type: DataTypes.DECIMAL,
    },
  },
  {
    timestamps: false,
  }
);
