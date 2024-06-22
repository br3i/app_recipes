import { Ingredientes } from "../models/ingredientes.js";

class IngredientesService {
  async getAllIngredientes() {
    console.log('Fetching all ingredients...');
    const ingredientes = await Ingredientes.findAll();
    console.log('Fetched ingredients:', ingredientes);
    return ingredientes;
  }

  async getIngredienteById(id) {
    console.log(`Fetching ingredient with ID: ${id}`);
    const ingrediente = await Ingredientes.findByPk(id);
    if (!ingrediente) {
      console.log(`Ingredient with ID: ${id} not found`);
    } else {
      console.log('Fetched ingredient:', ingrediente);
    }
    return ingrediente;
  }

  async createIngrediente(ingredienteData) {
    console.log('Creating new ingredient with data:', ingredienteData);
    const newIngrediente = await Ingredientes.create(ingredienteData);
    console.log('Created ingredient:', newIngrediente);
    return newIngrediente;
  }

  async updateIngrediente(id, ingredienteData) {
    console.log(`Updating ingredient with ID: ${id}`);
    const ingrediente = await Ingredientes.findByPk(id);
    if (!ingrediente) {
      throw new Error('Ingrediente not found');
    }
    console.log('Ingredient found:', ingrediente);
    const updatedIngrediente = await ingrediente.update(ingredienteData);
    console.log('Updated ingredient:', updatedIngrediente);
    return updatedIngrediente;
  }

  async deleteIngrediente(id) {
    console.log(`Deleting ingredient with ID: ${id}`);
    const ingrediente = await Ingredientes.findByPk(id);
    if (!ingrediente) {
      throw new Error('Ingrediente not found');
    }
    console.log('Ingredient found:', ingrediente);
    await ingrediente.destroy();
    console.log(`Ingredient with ID: ${id} deleted`);
    return { message: 'Ingrediente eliminado' };
  }
}

export default new IngredientesService();
