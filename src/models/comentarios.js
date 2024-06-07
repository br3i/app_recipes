import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

let Usuarios;

(async () => {
  const { Usuarios: UsuariosModule } = await import("./usuarios.js");
  Usuarios = UsuariosModule;
})();

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
      references: {
        model: Usuarios,
        key: 'id_usuario'
      }
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
