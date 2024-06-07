import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Nutricionista } from "./nutricionistas.js";
import { Administradores } from "./administradores.js";
import { Comentarios } from "./comentarios.js";

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

// Relaciones Usuarios - Administradores

Usuarios.hasOne(Administradores, 
  { foreignKey: "id_usuario",
  as: 'administrador' 
});

Administradores.belongsTo(Usuarios, {
  foreignKey: "id_usuario"
});

// Relaciones Usuarios - Nutricionistas

Usuarios.hasOne(Nutricionista,{
  foreignKey: "id_usuario",
  as: 'nutricionista'
});

Nutricionista.belongsTo(Usuarios, {
  foreignKey: "id_usuario"
});

// Relaciones Usuarios - Comentarios

Usuarios.hasMany(Comentarios, {
  foreignKey: "id_usuario",
  as: 'comentarios'
});

Comentarios.belongsTo(Usuarios, {
  foreignKey: "id_usuario"
});