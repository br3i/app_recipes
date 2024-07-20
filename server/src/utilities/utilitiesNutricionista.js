import { Nutricionista } from '../models/nutricionistas.js'

// Crea un Nutricionista
export const createNutricionista = async ({ id_usuario, especialidad }, transaction) => {
  try {
    await Nutricionista.create({ id_usuario, especialidad }, { transaction });
  } catch (error) {
    throw new Error(`Error al crear nutricionista: ${error.message}`);
  }
};

// Actualiza un Nutricionista
export const updateNutricionistaId = async (id_usuario, especialidad, transaction) => {
  console.log(`\n\n\n\nAqui llego a el update de Nutri: ${especialidad}`);
  try {
    const nutricionista = await Nutricionista.findOne({ where: { id_usuario }, transaction });
    if (!nutricionista) {
      throw new Error("Nutricionista no encontrado");
    }
    nutricionista.especialidad = especialidad;
    await nutricionista.save({ transaction });
  } catch (error) {
    throw new Error("Error al actualizar nutricionista: " + error.message);
  }
};

// Actualiza un nutricionista por email
export const updateNutricionistaEmail = async (email, especialista, transaction) => {
  try {
    const usuario = await Usuarios.findOne({ where: { email }, transaction });
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    const nutricionista = await Nutricionista.findOne({ where: { id_usuario: usuario.id_usuario }, transaction });
    if (!nutricionista) {
      throw new Error("Nutricionista no encontrado");
    }

    nutricionista.especialista = especialista;
    await nutricionista.save({ transaction });
  } catch (error) {
    throw new Error("Error al actualizar nutricionista por email: " + error.message);
  }
};

// Elimina un Nutricionista
export const deleteNutricionistaId = async (id_usuario, transaction) => {
  try {
    const nutricionista = await Nutricionista.findOne({ where: { id_usuario }, transaction });
    if (nutricionista) {
      await nutricionista.destroy({ transaction });
    }
  } catch (error) {
    throw new Error("Error al eliminar nutricionista: " + error.message);
  }
};

//Elimina un nutricionista por email
export const deleteNutricionistaEmail = async (email, transaction) => {
  try {
    const usuario = await Usuarios.findOne({ where: { email }, transaction });
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    const nutricionista = await Nutricionista.findOne({ where: { id_usuario: usuario.id_usuario }, transaction });
    if (nutricionista) {
      await nutricionista.destroy({ transaction });
    }
  } catch (error) {
    throw new Error("Error al eliminar nutricionista por email: " + error.message);
  }
};

