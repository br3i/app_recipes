import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Recetas } from "./recetas.js";
import { Ingredientes } from "./ingredientes.js";

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
      references: {
        model: Recetas,
        key: "id_receta",
      },
    },
    id_ingrediente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Ingredientes,
        key: "id_ingrediente",
      },
    },
    cantidad: {
      type: DataTypes.DECIMAL,
    },
  },
  {
    timestamps: false,
  }
);

Recetas_Ingredientes.belongsTo(Recetas, { foreignKey: "id_receta" });
Recetas_Ingredientes.belongsTo(Ingredientes, { foreignKey: "id_ingrediente" });
