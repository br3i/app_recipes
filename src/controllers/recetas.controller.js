import { sequelize } from "../database/database.js";
import { Recetas } from "../models/recetas.js";
import { Recetas_Ingredientes } from "../models/recetas_ingredientes.js";
import { Ingredientes } from "../models/ingredientes.js";
import { Objetivos_Nutricionales } from "../models/objetivos_nutricionales.js";
import RecetasService from "../services/recetas.service.js";

// Obtiene todas las recetas
export const getRecetas = async (req, res) => {
  try {
    console.log('GET /recetas');
    const recetas = await RecetasService.getAllRecetas();
    console.log('Sending response with recipes:', recetas);
    res.json(recetas);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtiene una receta por ID
export const getRecetaId = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`GET /recetas/${id}`);
    const receta = await RecetasService.getRecetaById(id);

    if (!receta) {
      console.log(`Recipe with ID: ${id} not found`);
      return res.status(404).json({ error: 'Receta no encontrada' });
    }

    console.log('Sending response with recipe:', receta);
    res.json(receta);
  } catch (error) {
    console.error(`Error fetching recipe with ID: ${id}`, error);
    res.status(500).json({ error: error.message });
  }
};

// Obtiene una receta por el nombre
export const getRecetaNombre = async (req, res) => {
  try {
    const { nombre } = req.params;
    console.log(`GET /recetas/nombre/${nombre}`);
    const receta = await Recetas.findOne({
      where: { nombre }, // Buscar por nombre de receta
      include: [
        {
          model: Objetivos_Nutricionales,
          as: 'objetivo'
        },
        {
          model: Recetas_Ingredientes,
          as: 'recetas_ingredientes',
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
      console.log(`Recipe with name: ${nombre} not found`);
      return res.status(404).json({ error: 'Receta no encontrada' });
    }

    console.log('Sending response with recipe:', receta);
    res.json(receta);
  } catch (error) {
    console.error(`Error fetching recipe with name: ${nombre}`, error);
    res.status(500).json({ error: error.message });
  }
};

// Crea una nueva receta
export const createReceta = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { nombre, instrucciones_prep, tiempo_coccion, calorias_totales, proteinas_totales, carbohidratos_totales, grasas_totales, azucares_totales, fibra_total, sodio_total, id_objetivo, ingredientes } = req.body;
    console.log(`POST /recetas`);
    console.log('Request body:', req.body);

    const newReceta = await RecetasService.createReceta({
      nombre,
      instrucciones_prep,
      tiempo_coccion,
      calorias_totales,
      proteinas_totales,
      carbohidratos_totales,
      grasas_totales,
      azucares_totales,
      fibra_total,
      sodio_total,
      id_objetivo
    }, ingredientes, transaction);

    await transaction.commit();
    console.log('Created recipe:', newReceta);
    res.json(newReceta);
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating recipe:', error);
    res.status(500).json({ error: error.message });
  }
};

// Actualiza una receta
export const updateReceta = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { nombre, instrucciones_prep, tiempo_coccion, calorias_totales, proteinas_totales, carbohidratos_totales, grasas_totales, azucares_totales, fibra_total, sodio_total, id_objetivo, ingredientes } = req.body;
    console.log(`PUT /recetas/${id}`);
    console.log('Request body:', req.body);

    const updatedReceta = await RecetasService.updateReceta(id, {
      nombre,
      instrucciones_prep,
      tiempo_coccion,
      calorias_totales,
      proteinas_totales,
      carbohidratos_totales,
      grasas_totales,
      azucares_totales,
      fibra_total,
      sodio_total,
      id_objetivo
    }, ingredientes, transaction);

    if (!updatedReceta) {
      console.log(`Recipe with ID: ${id} not found`);
      return res.status(404).json({ error: 'Receta no encontrada' });
    }

    await transaction.commit();
    console.log('Updated recipe:', updatedReceta);
    res.json(updatedReceta);
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating recipe:', error);
    res.status(500).json({ error: error.message });
  }
};

// Elimina una receta
export const deleteReceta = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    console.log(`DELETE /recetas/${id}`);

    const deletedMessage = await RecetasService.deleteReceta(id, transaction);

    await transaction.commit();
    console.log('Deleted recipe:', deletedMessage);
    res.json({ message: 'Receta eliminada' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting recipe:', error);
    res.status(500).json({ error: error.message });
  }
};
