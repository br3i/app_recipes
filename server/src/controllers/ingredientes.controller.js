import { sequelize } from "../database/database.js";
import IngredientesService from "../services/ingredientes.service.js";

// Obtiene todos los Ingredientes
export const getIngredientes = async (req, res) => {
  try {
    console.log('GET /ingredientes');
    const ingredientes = await IngredientesService.getAllIngredientes();
    console.log('Sending response with ingredients:', ingredientes);
    res.json(ingredientes);
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtiene un Ingrediente por Id de ingrediente
export const getIngredienteId = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`GET /ingredientes/${id}`);

    if (isNaN(id)) {
      console.log('ID is not a number');
      return res.status(400).json({ error: 'El ID debe ser un número' });
    }

    const ingrediente = await IngredientesService.getIngredienteById(id);

    if (!ingrediente) {
      console.log(`Ingredient with ID: ${id} not found`);
      return res.status(404).json({ error: 'Ingrediente no encontrado' });
    }
    console.log('Sending response with ingredient:', ingrediente);
    res.json(ingrediente);
  } catch (error) {
    console.error(`Error fetching ingredient with ID: ${req.params.id}`, error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener un Ingrediente por Nombre
export const getIngredienteNbr = async (req, res) => {
  try {
    const { nombre } = req.params;
    console.log(`GET /ingredientes/nombre/${nombre}`);
    const ingrediente = await IngredientesService.getIngredienteByNombre(nombre);
  
    if (!ingrediente) {
      console.log(`Ingredient with name: ${nombre} not found`);
      return res.status(404).json({ error: 'Ingrediente no encontrado' });
    }
    console.log('Sending response with ingredient:', ingrediente);
    res.json(ingrediente);
  } catch (error) {
    console.error(`Error fetching ingredient with name: ${nombre}`, error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener Ingredientes por Categoría
export const getIngredienteCtg = async (req, res) => {
  try {
    const { categoria } = req.params;
    console.log(`GET /ingredientes/categoria/${categoria}`);
    const ingredientes = await IngredientesService.getIngredientesByCategoria(categoria);
    console.log('Sending response with ingredients:', ingredientes);
    res.json(ingredientes);
  } catch (error) {
    if (error.message.includes('No se encontraron ingredientes para la categoría')) {
      console.error(`No ingredients found for category: ${req.params.categoria}`);
      return res.status(404).json({ error: error.message });
    } else {
      console.error(`Error fetching ingredients for category: ${req.params.categoria}`, error);
      return res.status(500).json({ error: error.message });
    }
  }
};

// Obtiene un ingrediente bajo un parámetro de condición
export const getIngredientesByComparison = async (req, res) => {
  try {
    const { comparison, parameter, value } = req.params;
    console.log(`GET /ingredientes/${comparison}/${parameter}/${value}`);

    // Validación para parámetros no permitidos
    if (parameter === 'id_ingrediente' || parameter === 'nombre') {
      console.log(`Parameter '${parameter}' not allowed for comparison`);
      return res.status(400).json({ error: `No se puede buscar por el parámetro '${parameter}'` });
    }

    const ingredientes = await IngredientesService.getIngredientesByComparison(comparison, parameter, value);

    if (!ingredientes || ingredientes.length === 0) {
      console.log(`No ingredients found for ${comparison} ${parameter} ${value}`);
      return res.status(404).json({ error: 'No se encontraron ingredientes que coincidan con los criterios' });
    }

    console.log('Sending response with ingredients:', ingredientes);
    res.json(ingredientes);
  } catch (error) {
    console.error(`Error fetching ingredients with ${req.body.comparison} ${req.body.parameter} ${req.body.value}`, error);
    res.status(500).json({ error: error.message });
  }
};

// Crear un Ingrediente

export const createIngredientes = async (req, res) => {
  try {
    const data = req.body; // Suponiendo que req.body puede ser un array o un objeto
    console.log(`POST /ingredientes`);
    console.log('Request body:', req.body);

    const ingredientesArray = Array.isArray(data) ? data : [data]; // Convertir a array si es un solo objeto
    const createdIngredientes = [];
    const failedIngredientes = [];

    for (const ingrediente of ingredientesArray) {
      const { nombre, categoria, calorias, proteinas, carbohidratos, grasas, azucar, fibra, sodio } = ingrediente;

      try {
        // Verificar si el ingrediente ya existe antes de intentar crearlo
        const existingIngrediente = await IngredientesService.getIngredienteByNombre(nombre);
        if (existingIngrediente) {
          failedIngredientes.push(nombre);
          continue; // Saltar la creación si ya existe
        }

        const newIngrediente = await IngredientesService.createIngrediente({
          nombre,
          categoria,
          calorias,
          proteinas,
          carbohidratos,
          grasas,
          azucar,
          fibra,
          sodio,
        });

        createdIngredientes.push(newIngrediente);
      } catch (error) {
        console.error(`Error creating ingredient ${nombre}:`, error);
        failedIngredientes.push(nombre);
      }
    }

    let responseMessage = {};

    if (failedIngredientes.length > 0) {
      responseMessage.error = `Llaves duplicadas violan restricción de unicidad. Estos ingredientes no se insertaron en la base de datos: ${failedIngredientes.join(', ')}`;
    }

    if (createdIngredientes.length > 0) {
      responseMessage.exito = `Estos ingredientes se crearon: ${createdIngredientes.map(ing => ing.nombre).join(', ')}`;
    }

    if (failedIngredientes.length > 0 && createdIngredientes.length > 0) {
      res.status(207).json(responseMessage);
    } else if (failedIngredientes.length > 0) {
      res.status(400).json(responseMessage);
    } else {
      res.json(responseMessage);
    }
  } catch (error) {
    console.error('Error creating ingredients:', error);
    res.status(500).json({ error: error.message });
  }
};


// Actualiza un Ingrediente por Id
export const updateIngredientesId = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params; // Obtener el id del parámetro de la URL
    const ingredienteData = req.body; // Asumir que el cuerpo contiene un solo objeto, no un array

    if (Array.isArray(ingredienteData)) {
      return res.status(400).json({ error: 'El cuerpo de la solicitud debe contener un único objeto de datos del ingrediente' });
    }

    console.log(`PUT /ingredientes/id/${id}`);
    console.log('Request body:', ingredienteData);

    const updatedIngrediente = await IngredientesService.updateIngredientesId(id, ingredienteData, transaction);

    if (!updatedIngrediente) {
      console.log(`Ingredient with ID: ${id} not found`);
      return res.status(404).json({ error: `Ingrediente con ID ${id} no encontrado` });
    }

    await transaction.commit();
    console.log('Updated ingredient:', updatedIngrediente);
    res.json(updatedIngrediente);
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating ingredient:', error);
    res.status(500).json({ error: error.message });
  }
};

// Actualiza un Ingrediente por Nombre
export const updateIngredientesNombre = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { nombre } = req.params; // Obtener el nombre del parámetro de la URL
    const ingredienteData = req.body; // Asumir que el cuerpo contiene un solo objeto, no un array

    if (Array.isArray(ingredienteData)) {
      return res.status(400).json({ error: 'El cuerpo de la solicitud debe contener un único objeto de datos del ingrediente' });
    }

    console.log(`PUT /ingredientes/nombre/${nombre}`);
    console.log('Request body:', ingredienteData);

    const updatedIngrediente = await IngredientesService.updateIngredienteNombre(nombre, ingredienteData, transaction);

    if (!updatedIngrediente) {
      console.log(`Ingredient with nombre: ${nombre} not found`);
      await transaction.rollback();
      return res.status(404).json({ error: `Ingrediente con nombre ${nombre} no encontrado` });
    }

    await transaction.commit();
    console.log('Updated ingredient:', updatedIngrediente);
    res.json(updatedIngrediente);
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating ingredient:', error);
    res.status(500).json({ error: error.message });
  }
};

// Elimina un Ingrediente por id_ingrediente
export const deleteIngredientesId = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params; // Detect if single ID or array of IDs
    console.log(`DELETE /ingredientes/${id}`);
    console.log('Request body:', req.body);

    const deletedMessage = await IngredientesService.deleteIngredienteId(id, transaction);

    if (!deletedMessage || deletedMessage.error) {
      console.log(`El ingrediente con id: ${id} no ha sido encontradoo no ha sido eliminado`);
      await transaction.rollback();
      return res.status(404).json({ error: `Ingrediente con ID ${id} no encontrado o no eliminado` });
    }

    await transaction.commit();
    console.log(`Ingrediente con id: ${id} eliminado`);
    res.json({ message: `Ingrediente con ID ${id} eliminado` });
  } catch (error) {
    await transaction.rollback();
    console.error('Error eliminando ingrediente:', error);
    res.status(500).json({ error: error.message });
  }
};

// Elimina un ingrediente por Nombre
export const deleteIngredientesByNombre = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { nombre } = req.params; // Detectar si es un solo nombre o un array de nombres
    console.log(`DELETE /ingredientes/nombre`);
    console.log('Request body:', req.body);

    const deletedMessage = await IngredientesService.deleteIngredienteByNombre(nombre, transaction);

    if (!deletedMessage || deletedMessage.error) {
      console.log(`Ingrediente con nombre: ${nombre} no encontrado`);
      await transaction.rollback();
      return res.status(404).json({ error: `Ingrediente con nombre ${nombre} no encontrado o no eliminado` });
    }

    await transaction.commit();
    console.log(`Deleted ingredient with name: ${nombre}`);
    res.json({ message: `Ingrediente con nombre ${nombre} eliminado` });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting ingredient by name:', error);
    res.status(500).json({ error: error.message });
  }
};
