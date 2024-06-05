import Sequelize from "sequelize";

export const sequelize = new Sequelize(
  "SmartPlate", // db name,
  "postgres", // username
  "1234", // password
  {
    host: "localhost",
    dialect: "postgres",
  }
);

// True: se regenera toda la base de datos
// False: se mantiene la base de datos actual
export const regenerarBD = false;