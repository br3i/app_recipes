import { Administradores } from '../models/administradores.js';

// Crear un Administrador
export const createAdmin = async ({ id_usuario }, transaction) => {
  try {
    await Administradores.create({ id_usuario }, { transaction });
  } catch (error) {
    throw new Error(`Error al crear usuario: ${error.message}`);
  }
};

// Actualiza un Administrador por id
export const updateAdminId = async (id_usuario, transaction) => {
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

//Actualizar admin por email
export const updateAdminEmail = async (id_usuario, transaction) => {
  try {
    const usuario = await Usuarios.findOne({ where: { email }, transaction });
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    const admin = await Administradores.findOne({ where: { id_usuario: usuario.id_usuario }, transaction });
    if (!admin) {
      throw new Error("Administrador no encontrado");
    }

    // Aquí podrías realizar las actualizaciones específicas para Administrador si fuera necesario

    await admin.save({ transaction });
  } catch (error) {
    throw new Error("Error al actualizar administrador por email: " + error.message);
  }
}

// Elimina un Administrador por id
export const deleteAdminId = async (id_usuario, transaction) => {
  try {
    const admin = await Administradores.findOne({ where: { id_usuario }, transaction });
    if (admin) {
      await admin.destroy({ transaction });
    }
  } catch (error) {
    throw new Error("Error al eliminar administrador: " + error.message);
  }
};

//Eliminar Admin por email
export const deleteAdminEmail = async (email, transaction) => {
  try {
    const usuario = await Usuarios.findOne({ where: { email }, transaction });
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    const admin = await Administradores.findOne({ where: { id_usuario: usuario.id_usuario }, transaction });
    if (admin) {
      await admin.destroy({ transaction });
    }
  } catch (error) {
    throw new Error("Error al eliminar administrador por email: " + error.message);
  }
};

