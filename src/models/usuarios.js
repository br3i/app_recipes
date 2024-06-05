import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Nutricionista } from "./nutricionistas.js";
import { Administradores } from "./administradores.js";

export const Usuarios = sequelize.define("usuarios", {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  contrasena: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo_usuario: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  informacion_contacto: {
    type: DataTypes.TEXT,
  },
}, {
  timestamps: false,
  tableName: 'usuarios'
});

Usuarios.hasOne(Administradores, 
  { foreignKey: "id_usuario",
    as: 'administrador' 
  });

Usuarios.hasOne(Nutricionista,{
  foreignKey: "id_usuario",
  as: 'nutricionista'
})
