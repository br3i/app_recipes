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
export const updateNutricionista = async (id_usuario, especialista, transaction) => {
  try {
    const nutricionista = await Nutricionista.findOne({ where: { id_usuario }, transaction });
    if (!nutricionista) {
      throw new Error("Nutricionista no encontrado");
    }
    nutricionista.especialista = especialista;
    await nutricionista.save({ transaction });
  } catch (error) {
    throw new Error("Error al actualizar nutricionista: " + error.message);
  }
};

// Elimina un Nutricionista
export const deleteNutricionista = async (id_usuario, transaction) => {
  try {
    const nutricionista = await Nutricionista.findOne({ where: { id_usuario }, transaction });
    if (nutricionista) {
      await nutricionista.destroy({ transaction });
    }
  } catch (error) {
    throw new Error("Error al eliminar nutricionista: " + error.message);
  }
};

