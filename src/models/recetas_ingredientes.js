import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Recetas_Ingredientes = sequelize.define(
  "recetas_ingredientes",
  {
    id_recetas_ingredientes: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_receta: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_ingrediente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.DECIMAL,
    },
  },
  {
    timestamps: false,
  }
);
