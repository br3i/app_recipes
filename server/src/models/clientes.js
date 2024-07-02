import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Cliente = sequelize.define(
  "cliente",
  {
    id_cliente: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_cliente: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    ingredientes_cantidad: {
      type: DataTypes.JSONB,
    },
  },
  {
    timestamps: false,
  }
);