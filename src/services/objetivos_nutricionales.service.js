import { Objetivos_Nutricionales } from "../models/objetivos_nutricionales.js";

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

  async createObjetivoNutricional(objetivoNutricionalData) {
    console.log('Creating new nutritional objective with data:', objetivoNutricionalData);
    const newObjetivo = await Objetivos_Nutricionales.create(objetivoNutricionalData);
    console.log('Created nutritional objective:', newObjetivo);
    return newObjetivo;
  }

  async updateObjetivoNutricional(id, objetivoNutricionalData) {
    console.log(`Updating nutritional objective with ID: ${id}`);
    const objetivoNutricional = await Objetivos_Nutricionales.findByPk(id);
    if (!objetivoNutricional) {
      throw new Error('Objetivo Nutricional not found');
    }
    console.log('Nutritional objective found:', objetivoNutricional);
    const updatedObjetivo = await objetivoNutricional.update(objetivoNutricionalData);
    console.log('Updated nutritional objective:', updatedObjetivo);
    return updatedObjetivo;
  }

  async deleteObjetivoNutricional(id) {
    console.log(`Deleting nutritional objective with ID: ${id}`);
    const objetivoNutricional = await Objetivos_Nutricionales.findByPk(id);
    if (!objetivoNutricional) {
      throw new Error('Objetivo Nutricional not found');
    }
    console.log('Nutritional objective found:', objetivoNutricional);
    await objetivoNutricional.destroy();
    console.log(`Nutritional objective with ID: ${id} deleted`);
    return { message: 'Objetivo eliminado' };
  }
}

export default new ObjetivosNutricionalesService();
