import { Op } from "sequelize";
import { Ingredientes } from "../models/ingredientes.js";
import { Objetivos_Nutricionales } from "../models/objetivos_nutricionales.js";
import { Recetas } from "../models/recetas.js";
import { Recetas_Ingredientes } from "../models/recetas_ingredientes.js";
import objetivos_nutricionalesService from "./objetivos_nutricionales.service.js";
import { recomendarRecetas } from "./recommendation.service.js"; // Importa la función recomendarRecetas

class RecetasService {
  async getAllRecetas() {
    console.log('Fetching all recipes...');
    const recetas = await Recetas.findAll({
      include: [
        {
          model: Objetivos_Nutricionales,
          as: 'objetivo',
          attributes: ['nombre_objetivo'] // Incluir solo el nombre del objetivo
        },
        {
          model: Ingredientes,
          as: 'ingredientes', // Especifica el alias utilizado en la asociación
          through: {
            attributes: ['cantidad'], // Incluir el atributo cantidad de la tabla de unión
          },
          attributes: ['id_ingrediente', 'nombre', 'calorias', 'proteinas', 'carbohidratos', 'grasas', 'azucar', 'fibra', 'sodio'], // Atributos específicos de ingredientes
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
          model: Objetivos_Nutricionales,
          as: 'objetivo',
          attributes: ['nombre_objetivo'] // Incluir solo el nombre del objetivo
        },
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

  async getRecetaByNombre(nombre) {
    console.log(`Fetching receta with nombre: ${nombre}`);
    const receta = await Recetas.findOne({
      where: { nombre },
      include: [
        {
          model: Objetivos_Nutricionales,
          as: 'objetivo',
          attributes: ['nombre_objetivo'] 
        },
        {
          model: Recetas_Ingredientes,
          as: 'recetaIngredientes',
          include: [
            {
              model: Ingredientes,
              as: 'ingrediente'
            }
          ]
        }
      ]
    });
    if (!receta) {
      console.log(`Receta with nombre: ${nombre} not found`);
    } else {
      console.log('Fetched receta:', receta);
    }
    return receta;
  }

  async getRecetaByObjetivo(nombre_objetivo){
    console.log(`Fetching recetas with objetivo nombre: ${nombre_objetivo}`);
    const objetivo = await Objetivos_Nutricionales.findOne({ where: { nombre_objetivo: nombre_objetivo } });

    if (!objetivo || objetivo.length === 0) {
      console.log(`Objetivo nutricional with nombre: ${nombre_objetivo} not found`);
      throw new Error(`No existe el Objetivo Nutricional con nombre: ${nombre_objetivo}`);
    }

    const recetas = await Recetas.findAll({
      where: { id_objetivo: objetivo.id_objetivo },
      include: [
        {
          model: Objetivos_Nutricionales,
          as: 'objetivo',
          attributes: ['nombre_objetivo']
        },
        {
          model: Recetas_Ingredientes,
          as: 'recetaIngredientes',
          include: [
            {
              model: Ingredientes,
              as: 'ingrediente'
            }
          ]
        }
      ]
    });

    if (!recetas || recetas.length === 0) {
      console.log(`No recetas found with objetivo nombre: ${nombre_objetivo}`);
      throw new Error(`Recetas con el nombre de objetivo: ${nombre_objetivo} no existen`);
    }

    console.log('Fetched recetas:', recetas);
    return recetas;
  };

  async getRecetasByComparison(comparison, parameter, value) {
    console.log(`Fetching recetas with ${comparison} ${parameter} ${value}`);
    
    const operators = {
      mayor: Op.gt,
      menor: Op.lt,
      igual: Op.eq
    };

    const operator = operators[comparison];

    if (!operator) {
      throw new Error(`Este operador no está permitido: ${comparison}`);
    }

    const recetas = await Recetas.findAll({
      where: {
        [parameter]: {
          [operator]: value
        }
      },
      include:[{
        model: Objetivos_Nutricionales,
        as: 'objetivo',
        attributes: ['nombre_objetivo']
      }]
    });

    console.log('Fetched recetas:', recetas);
    return recetas;
  }

  async createReceta(recetaData, ingredientes, transaction) {
    console.log('Creating new recipe with data:', recetaData);

    const existingReceta = await this.getRecetaByNombre(recetaData.nombre);
    
    if (existingReceta) {
      console.log(`Receta with name: ${recetaData.nombre} already exists`);
      throw new Error(`Receta con el nombre: ${recetaData.nombre} ya existe`);
    }
    
    const objetivoNutricional = await objetivos_nutricionalesService.getObjetivoNutricionalById(recetaData.id_objetivo)
    
    if (!objetivoNutricional) {
      console.log(`Objetivo nutricional with ID: ${recetaData.id_objetivo} not found`);
      throw new Error(`Objetivo nutricional with ID: ${recetaData.id_objetivo} not found`);
    }
    
    const receta = await Recetas.create(recetaData, { transaction });

    for (const ingrediente of ingredientes) {
      await Recetas_Ingredientes.create({
        id_receta: receta.id_receta,
        id_ingrediente: ingrediente.id_ingrediente,
        cantidad: ingrediente.cantidad
      }, { transaction });
    }
    
    console.log('Receta creada:', receta);
    return receta;
  }

  async updateRecetaId(id, recetaData, ingredientes, transaction) {
    try {
      console.log(`Acutalizando receta con ID: ${id}`);
      const receta = await Recetas.findByPk(id, { transaction });
      if (!receta) {
        throw new Error('Recipe not found');
      }
      console.log('Recipe found:', receta);
      await receta.update(recetaData, { transaction });

      if (ingredientes && ingredientes.length > 0) {
        await Recetas_Ingredientes.destroy({ where: { id_receta: id }, transaction });

        await Recetas_Ingredientes.bulkCreate(ingredientes.map(ingrediente => ({
          id_receta: id,
          id_ingrediente: ingrediente.id_ingrediente,
          cantidad: ingrediente.cantidad
        })), { transaction });
      }

      // Obtener la receta actualizada después de la actualización de ingredientes
      const recetaActualizada = await Recetas.findByPk(id, {
        include: [{ model: Ingredientes, as: 'ingredientes', through: Recetas_Ingredientes }]
      });

      console.log('Receta actualizada:', recetaActualizada);
      return recetaActualizada;
    } catch (error) {
      console.error('Error actualizando la receta:', error);
      throw new Error(error.message);
    }
  }

  async updateRecetaNombre(nombre, recetaData, ingredientes, transaction) {
  try {
    console.log(`Actualizando receta con nombre: ${nombre}`);
    
    // Buscar la receta por nombre dentro de la transacción
    const receta = await Recetas.findOne({ where: { nombre }, transaction });

    if (!receta) {
      throw new Error(`Receta con nombre ${nombre} no encontrada`);
    }

    console.log('Receta encontrada:', receta);

    // Actualizar la receta con los nuevos datos
    await receta.update(recetaData, { transaction });

    // Eliminar los ingredientes actuales asociados a la receta dentro de la transacción
    await Recetas_Ingredientes.destroy({ where: { id_receta: receta.id_receta }, transaction });

    // Crear los nuevos registros de ingredientes asociados a la receta dentro de la transacción
    await Recetas_Ingredientes.bulkCreate(ingredientes.map(ingrediente => ({
      id_receta: receta.id_receta,
      id_ingrediente: ingrediente.id_ingrediente,
      cantidad: ingrediente.cantidad
    })), { transaction });

    // Obtener la receta actualizada con los ingredientes
    const recetaActualizada = await Recetas.findByPk(receta.id_receta, {
      include: [{ model: Ingredientes, as: 'ingredientes', through: Recetas_Ingredientes }]
    });

    console.log('Receta actualizada:', recetaActualizada);
    return recetaActualizada;
  } catch (error) {
    console.error('Error actualizando receta por nombre:', error);
    throw new Error(error.message);
  }
}
  async deleteRecetaId(id, transaction) {
    try {
      console.log(`Deleting recipe with ID: ${id}`);

      // Buscar la receta por ID dentro de la transacción
      const receta = await Recetas.findByPk(id, { transaction });
      if (!receta) {
        throw new Error('Recipe not found');
      }

      // Eliminar los registros de recetas_ingredientes asociados a esta receta dentro de la transacción
      await Recetas_Ingredientes.destroy({ where: { id_receta: id }, transaction });

      // Eliminar la receta dentro de la transacción
      await receta.destroy({ transaction });

      console.log(`Recipe with ID: ${id} deleted`);
      return { message: 'Receta eliminada' };
    } catch (error) {
      console.error('Error deleting recipe:', error);
      throw new Error(error.message); // Propagar el error para manejarlo en el controlador
    }
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
