import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Recetas_Ingredientes } from "./recetas_ingredientes.js";

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

// Relaciones Ingredientes - Recetas_Ingredientes

Ingredientes.hasMany(Recetas_Ingredientes, { foreignKey: "id_ingrediente", as: "recetas_ingredientes" });
Recetas_Ingredientes.belongsTo(Ingredientes, { foreignKey: "id_ingrediente", as: "ingrediente" });