import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Objetivos_Nutricionales } from "./objetivos_nutricionales.js";
import { Recetas_Ingredientes } from "./recetas_ingredientes.js";
import { Ingrediente_Usuario } from "./ingrediente_usuario.js";

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
      references: {
        model: Objetivos_Nutricionales,
        key: "id_objetivo",
      },
    },
    id_recetas_ingredientes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Recetas_Ingredientes,
        key: "id_recetas_ingredientes",
      },
    },
    id_ingrediente_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Ingrediente_Usuario,
        key: "id_ingrediente_usuario",
      },
    },
  },
  {
    timestamps: false,
  }
);

Historico_Recomendaciones.belongsTo(Objetivos_Nutricionales, { foreignKey: "id_objetivo" });
Historico_Recomendaciones.belongsTo(Recetas_Ingredientes, { foreignKey: "id_recetas_ingredientes" });
Historico_Recomendaciones.belongsTo(Ingrediente_Usuario, { foreignKey: "id_ingrediente_usuario" });
