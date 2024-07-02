import { Objetivos_Nutricionales } from "../models/objetivos_nutricionales.js";
import { Op } from 'sequelize';

class ObjetivosNutricionalesService {
  async getAllObjetivosNutricionales() {
    console.log('Fetching all nutritional objectives...');
    const objetivos = await Objetivos_Nutricionales.findAll();
    console.log('Fetched objectives:', objetivos);
    return objetivos;
  }

  async getObjetivoNutricionalById(id) {
    console.log(`Fetching nutritional objective with ID: ${id}`);
    const objetivo = await Objetivos_Nutricionales.findByPk(id);
    if (!objetivo) {
      console.log(`Nutritional objective with ID: ${id} not found`);
    } else {
      console.log('Fetched nutritional objective:', objetivo);
    }
    return objetivo;
  }

  async getObjetivoNutricionalByNombre(nombre_objetivo) {
    console.log(`Fetching objetive with nombre: ${nombre_objetivo}`);
    const objetivo = await Objetivos_Nutricionales.findOne({ where: { nombre_objetivo } });
    if (!objetivo) {
      console.log(`Objetive with nombre: ${nombre_objetivo} not found`);
    } else {
      console.log('Fetched objetive:', objetivo);
    }
    return objetivo;
  }

  async getObjetivoNutricionalByDescripcion(descripcion) {
    try {
      console.log(`Fetching nutritional objectives with description containing: ${descripcion}`);
      const objetivos = await Objetivos_Nutricionales.findAll({
        where: {
          descripcion: {
            [Op.like]: `%${descripcion}%`
          }
        }
      });
      console.log('Found nutritional objectives:', objetivos);
      return objetivos;
    } catch (error) {
      console.error('Error fetching nutritional objectives by description:', error);
      throw error;
    }
  }

  async createObjetivoNutricional(objetivoNutricionalData) {
    try {
      console.log('Creating new nutritional objective with data:', objetivoNutricionalData);
      const newObjetivo = await Objetivos_Nutricionales.create(objetivoNutricionalData);
      console.log('Created nutritional objective:', newObjetivo);
      return newObjetivo;
    } catch(error){
      console.error('Error creando objetivo nutricional:', error);
      throw error;
    }
  }

  async updateObjetivoNutricionalId(id, objetivoNutricionalData, transaction) {
    try {
      console.log(`Updating nutritional objective with ID: ${id}`);
      const objetivoNutricional = await Objetivos_Nutricionales.findByPk(id, { transaction });
      if (!objetivoNutricional) {
        throw new Error('Objetivo Nutricional not found');
      }
      console.log('Nutritional objective found:', objetivoNutricional);
      const updatedObjetivo = await objetivoNutricional.update(objetivoNutricionalData, { transaction });
      console.log('Updated nutritional objective:', updatedObjetivo);
      return updatedObjetivo;
    } catch(error) {
      console.error('Error actualizando el objetivo nutricional:', error);
      throw new Error(error.message);
    }
  }

  async updateObjetivoNutricionalNombre(nombre_objetivo, objetivoNutricionalData, transaction) {
    try {
      console.log(`Updating nutritional objective with Nombre: ${nombre_objetivo}`);
      const objetivoNutricional = await Objetivos_Nutricionales.findOne({ where: { nombre_objetivo }, transaction});
      if (!objetivoNutricional) {
        throw new Error(`Objetivo Nutricional con nombre ${nombre_objetivo} no encontrado`);
      }
      console.log('Nutritional objective found:', objetivoNutricional);
      const updatedObjetivo = await objetivoNutricional.update(objetivoNutricionalData, { transaction });
      console.log('Updated nutritional objective:', updatedObjetivo);
      return updatedObjetivo;
    } catch(error) {
      console.error('Error actualizando el objetivo nutricional:', error);
      throw new Error(error.message);
    }
  }

  async deleteObjetivoNutricionalId(id, transaction) {
    console.log(`Deleting nutritional objective with ID: ${id}`);
    const objetivoNutricional = await Objetivos_Nutricionales.findByPk(id, { transaction });
    if (!objetivoNutricional) {
      throw new Error('Objetivo Nutricional not found');
    }
    console.log('Nutritional objective found:', objetivoNutricional);
    await objetivoNutricional.destroy({ transaction });
    console.log(`Nutritional objective with ID: ${id} deleted`);
    return { message: 'Objetivo eliminado' };
  }

  async deleteObjetivoNutricionalNombre(nombre_objetivo, transaction) {
    try {
      console.log(`Eliminando objetivo con nombre: ${nombre_objetivo}`);
      const objetivoNutricional = await Objetivos_Nutricionales.findOne({ where: { nombre_objetivo }, transaction });

      if (!objetivoNutricional) {
        throw new Error(`Objetivo con nombre: ${nombre_objetivo} no encontrado`);
      }

      console.log('Objetivo encontrado:', objetivoNutricional);
      await objetivoNutricional.destroy({ transaction });
      console.log(`Objetivo Nutricional: ${nombre_objetivo}`);
      return { message: `Objetivo Nutricional con el nombre ${nombre_objetivo} eliminado` };
    } catch (error) {
      await transaction.rollback();
      console.error('Error deleting nutricional objetive by name:', error);
      throw new Error(error.message);
    }
  }
}

export default new ObjetivosNutricionalesService();
