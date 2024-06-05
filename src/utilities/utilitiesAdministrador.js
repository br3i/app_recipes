import { Administradores } from '../models/administradores.js';

// Crear un Administrador
export const createAdmin = async ({ id_usuario }, transaction) => {
  try {
    await Administradores.create({ id_usuario }, { transaction });
  } catch (error) {
    throw new Error(`Error al crear usuario: ${error.message}`);
  }
};

// Actualiza un Administrador
export const updateAdmin = async (id_usuario, transaction) => {
  try {
    const admin = await Administradores.findOne({ where: { id_usuario }, transaction });
    if (!admin) {
      throw new Error("Administrador no encontrado");
    }
    await admin.save({ transaction });
  } catch (error) {
    throw new Error("Error al actualizar administrador: " + error.message);
  }
};

// Elimina un Administrador
export const deleteAdmin = async (id_usuario, transaction) => {
  try {
    const admin = await Administradores.findOne({ where: { id_usuario }, transaction });
    if (admin) {
      await admin.destroy({ transaction });
    }
  } catch (error) {
    throw new Error("Error al eliminar administrador: " + error.message);
  }
};

