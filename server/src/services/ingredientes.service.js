import { Ingredientes } from "../models/ingredientes.js";
import { sequelize } from "../database/database.js";
import { Op } from 'sequelize';

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

  async getIngredienteByNombre(nombre) {
    console.log(`Fetching ingredient with nombre: ${nombre}`);
    const ingrediente = await Ingredientes.findOne({ where: { nombre } });
    if (!ingrediente) {
      console.log(`Ingredient with nombre: ${nombre} not found`);
    } else {
      console.log('Fetched ingredient:', ingrediente);
    }
    return ingrediente;
  }

  async getIngredientesByCategoria(categoria) {
    console.log(`Fetching ingredients with categoria: ${categoria}`);
    try {
      const ingredientes = await Ingredientes.findAll({ where: { categoria } });
      if (ingredientes.length === 0) {
        throw new Error(`No se encontraron ingredientes para la categoría: ${categoria}`);
      } else {
        console.log('Fetched ingredients:', ingredientes);
      }
      return ingredientes;
    } catch (error) {
      console.error('Error fetching ingredients by categoria:', error);
      throw new Error(`${error.message}`);
    }
  }



  async getIngredientesByComparison(comparison, parameter, value) {
    console.log(`Fetching ingredients with ${comparison} ${parameter} ${value}`);
    
    const operators = {
      mayor: Op.gt,
      menor: Op.lt,
      igual: Op.eq
    };

    const operator = operators[comparison];

    if (!operator) {
      throw new Error(`Este operador no está permitido: ${comparison}`);
    }

    // Validación adicional para evitar crash por valor no numérico
    if (isNaN(value) && (comparison === 'mayor' || comparison === 'menor')) {
      throw new Error(`El valor '${value}' no es un número válido para la comparación`);
    }

    const ingredientes = await Ingredientes.findAll({
      where: {
        [parameter]: {
          [operator]: value
        }
      }
    });

    console.log('Fetched ingredients:', ingredientes);
    return ingredientes;
  }


  async createIngrediente(ingredienteData) {
    try {
      console.log('Creating new ingredient with data:', ingredienteData);
      const newIngrediente = await Ingredientes.create(ingredienteData);
      console.log('Created ingredient:', newIngrediente);
      return newIngrediente;
    } catch (error) {
      console.error('Error creating ingredient:', error);
      throw error; // Reenviar el error para ser manejado por el controlador
    }
  }


  async updateIngredientesId(id, ingredienteData) {
    const transaction = await sequelize.transaction();
    try {
      console.log(`Updating ingredient with ID: ${id}`);
      const ingrediente = await Ingredientes.findByPk(id, { transaction });
      if (!ingrediente) {
        throw new Error(`No se encontró un ingrediente con este ${id}`);
      }
      console.log('Ingredient found:', ingrediente);
      const updatedIngrediente = await ingrediente.update(ingredienteData, { transaction });
      await transaction.commit();
      console.log('Updated ingredient:', updatedIngrediente);
      return updatedIngrediente;
    } catch (error) {
      await transaction.rollback();
      console.error('Error updating ingredient:', error);
      throw new Error(error.message);
    }
  }

  async updateIngredienteNombre(nombre, ingredienteData) {
    const transaction = await sequelize.transaction();
    try {
      console.log(`Updating ingredient with nombre: ${nombre}`);
      const ingrediente = await Ingredientes.findOne({ where: { nombre }, transaction });
      if (!ingrediente) {
        throw new Error(`El ingrediente con nombre ${nombre}, no ha sido encontrado`);
      }
      console.log('Ingredient found:', ingrediente);
      const updatedIngrediente = await ingrediente.update(ingredienteData, { transaction });
      await transaction.commit();
      console.log('Updated ingredient:', updatedIngrediente);
      return updatedIngrediente;
    } catch (error) {
      await transaction.rollback();
      console.error('Error updating ingredient:', error);
      throw new Error(error.message);
    }
  }

  async deleteIngredienteId(id) {
    const transaction = await sequelize.transaction();
    try {
      console.log(`Eliminando ingrediente con id: ${id}`);
      const ingrediente = await Ingredientes.findByPk(id, { transaction });
      if (!ingrediente) {
        throw new Error('Ingrediente no encontrado');
      }
      console.log('Ingrediente encontrado:', ingrediente);
      await ingrediente.destroy({ transaction });
      await transaction.commit();
      console.log(`Ingrediente con id: ${id} eliminado`);
      return { message: 'Ingrediente eliminado' };
    } catch (error) {
      await transaction.rollback();
      console.error('Error deleting ingredient:', error);
      throw new Error(error.message);
    }
  }

  async deleteIngredienteByNombre(nombre) {
    const transaction = await sequelize.transaction();
    try {
      console.log(`Eliminando ingrediente con nombre: ${nombre}`);
      const ingrediente = await Ingredientes.findOne({ where: { nombre }, transaction });

      if (!ingrediente) {
        throw new Error(`Ingrediente con nombre: ${nombre} no encontrado`);
      }

      console.log('Ingrediente encontrado:', ingrediente);
      await ingrediente.destroy({ transaction });
      await transaction.commit();
      console.log(`Deleted ingredient with name: ${nombre}`);
      return { message: `Ingrediente con el nombre ${nombre} eliminado` };
    } catch (error) {
      await transaction.rollback();
      console.error('Error deleting ingredient by name:', error);
      throw new Error(error.message);
    }
  }
}

export default new IngredientesService();
