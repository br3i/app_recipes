import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Comentarios = sequelize.define(
  "comentarios",
  {
    id_comentario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
     id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: false,
    tableName: 'comentarios'
  }
);
