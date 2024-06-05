import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

let Usuarios;

(async () => {
  const { Usuarios: UsuariosModule } = await import("./usuarios.js");
  Usuarios = UsuariosModule;
})();

export const Nutricionista = sequelize.define(
  "nutricionista",
  {
    id_nutricionista: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Usuarios,
        key: "id_usuario",
      },
    },
    especialista: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);
