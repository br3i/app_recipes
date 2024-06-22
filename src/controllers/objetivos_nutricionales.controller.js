import { sequelize } from "../database/database.js";
import ObjetivosNutricionalesService from "../services/objetivos_nutricionales.service.js";

// Obtener todos los objetivos nutricionales
export const getObjetivosNutricionales = async (req, res) => {
  try {
    console.log('GET /objetivos-nutricionales');
    const objetivos = await ObjetivosNutricionalesService.getAllObjetivosNutricionales();
    console.log('Sending response with objectives:', objetivos);
    res.json(objetivos);
  } catch (error) {
    console.error('Error fetching nutritional objectives:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener un objetivo nutricional por ID
export const getObjetivoNutricionalId = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`GET /objetivos-nutricionales/${id}`);
    const objetivo = await ObjetivosNutricionalesService.getObjetivoNutricionalById(id);

    if (!objetivo) {
      console.log(`Nutritional objective with ID: ${id} not found`);
      return res.status(404).json({ error: 'Objetivo no encontrado' });
    }
    console.log('Sending response with nutritional objective:', objetivo);
    res.json(objetivo);
  } catch (error) {
    console.error(`Error fetching nutritional objective with ID: ${id}`, error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener un objetivo nutricional por nombre
export const getObjetivoNutricionalNombre = async (req, res) => {
  try {
    const { nombre } = req.params;
    console.log(`GET /objetivos-nutricionales/nombre/${nombre}`);
    const objetivos = await Objetivos_Nutricionales.findAll({ where: { nombre_objetivo: nombre } });

    if (objetivos.length === 0) {
      console.log(`Nutritional objectives with name: ${nombre} not found`);
      return res.status(404).json({ error: 'Objetivo no encontrado' });
    }
    console.log('Sending response with nutritional objectives:', objetivos);
    res.json(objetivos);
  } catch (error) {
    console.error(`Error fetching nutritional objectives with name: ${nombre}`, error);
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo objetivo nutricional
export const createObjetivoNutricional = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { nombre_objetivo, descripcion } = req.body;
    console.log(`POST /objetivos-nutricionales`);
    console.log('Request body:', req.body);

    const newObjetivo = await ObjetivosNutricionalesService.createObjetivoNutricional({
      nombre_objetivo,
      descripcion,
    }, transaction);

    await transaction.commit();
    console.log('Created nutritional objective:', newObjetivo);
    res.json(newObjetivo);
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating nutritional objective:', error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un objetivo nutricional
export const updateObjetivoNutricional = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { nombre_objetivo, descripcion } = req.body;
    console.log(`PUT /objetivos-nutricionales/${id}`);
    console.log('Request body:', req.body);

    const updatedObjetivo = await ObjetivosNutricionalesService.updateObjetivoNutricional(id, {
      nombre_objetivo,
      descripcion,
    }, transaction);

    if (!updatedObjetivo) {
      console.log(`Nutritional objective with ID: ${id} not found`);
      return res.status(404).json({ error: 'Objetivo no encontrado' });
    }

    await transaction.commit();
    console.log('Updated nutritional objective:', updatedObjetivo);
    res.json(updatedObjetivo);
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating nutritional objective:', error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un objetivo nutricional por ID
export const deleteObjetivoNutricional = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    console.log(`DELETE /objetivos-nutricionales/${id}`);

    const deletedMessage = await ObjetivosNutricionalesService.deleteObjetivoNutricional(id, transaction);

    await transaction.commit();
    console.log('Deleted nutritional objective:', deletedMessage);
    res.json({ message: 'Objetivo eliminado' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting nutritional objective:', error);
    res.status(500).json({ error: error.message });
  }
};
