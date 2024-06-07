import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

let Recetas;
let Ingredientes

(async () => {
  const { Recetas: RecetasModule } = await import("./recetas.js");
  const { Ingredientes: IngredientesModule } = await import("./ingredientes.js");
  Recetas = RecetasModule;
  Ingredientes = IngredientesModule;
})();

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
