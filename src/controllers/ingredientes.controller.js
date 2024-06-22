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
    const ingrediente = await IngredientesService.getIngredienteById(id);

    if (!ingrediente) {
      console.log(`Ingredient with ID: ${id} not found`);
      return res.status(404).json({ error: 'Ingrediente no encontrado' });
    }
    console.log('Sending response with ingredient:', ingrediente);
    res.json(ingrediente);
  } catch (error) {
    console.error(`Error fetching ingredient with ID: ${id}`, error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener un Ingrediente por Nombre
export const getIngredienteNbr = async (req, res) => {
  try {
    const { nombre } = req.params;
    console.log(`GET /ingredientes/nombre/${nombre}`);
    const ingrediente = await Ingredientes.findOne({
      where: { nombre }
    });

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
    const ingredientes = await Ingredientes.findAll({
      where: { categoria }
    });

    if (ingredientes.length === 0) {
      console.log(`No ingredients found for category: ${categoria}`);
      return res.status(404).json({ error: 'No se encontraron ingredientes para esta categoría' });
    }
    console.log('Sending response with ingredients:', ingredientes);
    res.json(ingredientes);
  } catch (error) {
    console.error(`Error fetching ingredients for category: ${categoria}`, error);
    res.status(500).json({ error: error.message });
  }
};

// Crear un Ingrediente
export const createIngrediente = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { nombre, categoria, calorias, proteinas, carbohidratos, grasas, azucar, fibra, sodio } = req.body;
    console.log(`POST /ingredientes`);
    console.log('Request body:', req.body);

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
    }, transaction);

    await transaction.commit();
    console.log('Created ingredient:', newIngrediente);
    res.json(newIngrediente);
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating ingredient:', error);
    res.status(500).json({ error: error.message });
  }
};

// Actualiza un Ingrediente
export const updateIngrediente = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const ingredienteData = req.body;
    console.log(`PUT /ingredientes/${id}`);
    console.log('Request body:', req.body);

    const updatedIngrediente = await IngredientesService.updateIngrediente(id, ingredienteData, transaction);

    if (!updatedIngrediente) {
      console.log(`Ingredient with ID: ${id} not found`);
      return res.status(404).json({ error: 'Ingrediente no encontrado' });
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
export const deleteIngrediente = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    console.log(`DELETE /ingredientes/${id}`);

    const deletedMessage = await IngredientesService.deleteIngrediente(id, transaction);

    await transaction.commit();
    console.log('Deleted ingredient:', deletedMessage);
    res.json({ message: 'Ingrediente eliminado' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting ingredient:', error);
    res.status(500).json({ error: error.message });
  }
};
