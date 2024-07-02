import { Ingredientes } from "../models/ingredientes.js";
import { Recetas } from "../models/recetas.js";
import { Recetas_Ingredientes } from "../models/recetas_ingredientes.js";
import { recomendarRecetas } from "./recommendation.service.js"; // Importa la función recomendarRecetas

class RecetasService {
  async getAllRecetas() {
    console.log('Fetching all recipes...');
    const recetas = await Recetas.findAll({
      include: [
        {
          model: Ingredientes,
          as: 'ingredientes', // Especifica el alias utilizado en la asociación
          through: { attributes: [] } // Excluir los atributos de la tabla de unión
        }
      ]
    });
    console.log('Fetched recipes with ingredients:', recetas);
    return recetas;
  }

  async getRecetaById(id) {
    console.log(`Fetching recipe with ID: ${id}`);
    const receta = await Recetas.findByPk(id, {
      include: [
        {
          model: Ingredientes,
          as: 'ingredientes', // Especifica el alias utilizado en la asociación
          through: { attributes: [] } // Excluir los atributos de la tabla de unión
        }
      ]
    });
    if (!receta) {
      console.log(`Recipe with ID: ${id} not found`);
    } else {
      console.log('Fetched recipe:', receta);
    }
    return receta;
  }

  /*async createReceta(recetaData, ingredientes) {
    console.log('Creating new recipe with data:', recetaData);
    const receta = await Recetas.create(recetaData);

    if (ingredientes && ingredientes.length > 0) {
      await receta.setIngredientes(ingredientes);
    }
    console.log('Created recipe:', receta);
    return receta;
  }*/

  async createReceta(recetaData, ingredientes) {
    console.log('Creating new recipe with data:', recetaData);
    const receta = await Recetas.create(recetaData);

    if (ingredientes && ingredientes.length > 0) {
      const ingredientesInstances = await Ingredientes.findAll({
        where: { id: ingredientes }
      });
      await receta.setIngredientes(ingredientesInstances);
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

  async recommendRecetasByIngredientes(ingredientesUsuario, objetivoNutricional) {
    try {
      const recetasRecomendadas = await recomendarRecetas(ingredientesUsuario, objetivoNutricional);
      return recetasRecomendadas;
    } catch (error) {
      console.error('Error recommending recipes:', error);
      throw error;
    }
  }
}

export default new RecetasService();
