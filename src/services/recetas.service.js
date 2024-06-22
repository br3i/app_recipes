import { Recetas } from "../models/recetas.js";
import { Recetas_Ingredientes } from "../models/recetas_ingredientes.js";

class RecetasService {
  async getAllRecetas() {
    console.log('Fetching all recipes...');
    const recetas = await Recetas.findAll();
    console.log('Fetched recipes:', recetas);
    return recetas;
  }

  async getRecetaById(id) {
    console.log(`Fetching recipe with ID: ${id}`);
    const receta = await Recetas.findByPk(id);
    if (!receta) {
      console.log(`Recipe with ID: ${id} not found`);
    } else {
      console.log('Fetched recipe:', receta);
    }
    return receta;
  }

  async createReceta(recetaData, ingredientes) {
    console.log('Creating new recipe with data:', recetaData);
    const receta = await Recetas.create(recetaData);

    if (ingredientes && ingredientes.length > 0) {
      await receta.setIngredientes(ingredientes);
    }
    console.log('Created recipe:', receta);
    return receta;
  }

  async updateReceta(id, recetaData, ingredientes) {
    console.log(`Updating recipe with ID: ${id}`);
    const receta = await Recetas.findByPk(id);
    if (!receta) {
      throw new Error('Recipe not found');
    }
    await receta.update(recetaData);

    if (ingredientes && ingredientes.length > 0) {
      await Recetas_Ingredientes.destroy({ where: { id_receta: id } });
      await receta.setIngredientes(ingredientes);
    }
    console.log('Updated recipe:', receta);
    return receta;
  }

  async deleteReceta(id) {
    console.log(`Deleting recipe with ID: ${id}`);
    const receta = await Recetas.findByPk(id);
    if (!receta) {
      throw new Error('Recipe not found');
    }
    await Recetas_Ingredientes.destroy({ where: { id_receta: id } });
    await receta.destroy();
    console.log(`Recipe with ID: ${id} deleted`);
    return { message: 'Receta eliminada' };
  }

  async recommendRecetasByIngredientes(ingredientes) {
    // Aquí implementarías la lógica para recomendar recetas basadas en los ingredientes
    // usando el modelo de IA que entrenarás y la conexión con la base de datos.
  }
}

export default new RecetasService();
