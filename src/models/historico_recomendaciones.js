import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Historico_Recomendaciones = sequelize.define(
  "historico_recomendaciones",
  {
    id_historico_recomendaciones: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_objetivo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_recetas_ingredientes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_ingrediente_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);
