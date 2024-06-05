import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Ingrediente_Usuario = sequelize.define(
  "ingrediente_usuario",
  {
    id_ingrediente_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_usuario: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    codigo_usuario: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nombre_ingrediente: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cantidad_ingrediente: {
      type: DataTypes.DECIMAL,
    },
  },
  {
    timestamps: false,
  }
);
