import { sequelize } from "../database/database.js";
import { trim } from "../utilities/trim.js"
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

    if (!/^\d+$/.test(trim(id))) {
      console.log('ID is not a number');
      return res.status(400).json({ error: 'El ID debe ser un número' });
    }

    const objetivo = await ObjetivosNutricionalesService.getObjetivoNutricionalById(trim(id));

    if (!objetivo) {
      console.log(`Nutritional objective with ID: ${id} not found`);
      return res.status(404).json({ error: 'Objetivo no encontrado' });
    }
    console.log('Sending response with nutritional objective:', objetivo);
    res.json(objetivo);
  } catch (error) {
    console.error(`Error fetching nutritional objective with ID: ${req.params.id}`, error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener un objetivo nutricional por nombre
export const getObjetivoNutricionalNombre = async (req, res) => {
  try {
    const { nombre } = req.params;
    console.log(`GET /objetivos-nutricionales/nombre/${nombre}`);
    const objetivos = await ObjetivosNutricionalesService.getObjetivoNutricionalByNombre(trim(nombre));

    if (!objetivos) {
      console.log(`Nutritional objectives with name: ${nombre} not found`);
      return res.status(404).json({ error: 'Objetivo no encontrado' });
    }
    console.log('Sending response with nutritional objectives:', objetivos);
    res.json(objetivos);
  } catch (error) {
    console.error(`Error fetching nutritional objectives with name: ${req.body.nombre}`, error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener un objetivo nutricional por una palabra en la descripción
export const getObjetivoNutricionalDescripcion = async (req, res) => {
  try {
    const { descripcion } = req.params;
    console.log(`GET /objetivos-nutricionales/descripcion/${descripcion}`);

    const objetivos = await ObjetivosNutricionalesService.getObjetivoNutricionalByDescripcion(trim(descripcion));

    if (!objetivos || objetivos.length === 0) {
      console.log(`No nutritional objectives found with description containing: ${descripcion}`);
      return res.status(404).json({ error: 'No se encontraron objetivos con esa descripción' });
    }
    console.log('Sending response with nutritional objectives:', objetivos);
    res.json(objetivos);
  } catch (error) {
    console.error(`Error fetching nutritional objectives with description containing: ${req.body.descripcion}`, error);
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo objetivo nutricional
export const createObjetivoNutricional = async (req, res) => {
  try {
    const data = req.body; // Suponiendo que req.body puede ser un array o un objeto
    console.log(`POST /objetivos-nutricionales`);
    console.log('Request body:', req.body);

    const objetivosArray = Array.isArray(data) ? data : [data]; // Convertir a array si es un solo objeto
    const createdObjetivos = [];
    const failedObjetivos = [];

    for (const objetivo of objetivosArray) {
      const { nombre_objetivo, descripcion } = objetivo;

      try {
        // Verificar si el objetivo ya existe antes de intentar crearlo
        const existingObjetivo = await ObjetivosNutricionalesService.getObjetivoNutricionalByNombre(trim(nombre_objetivo));
        if (existingObjetivo) {
          failedObjetivos.push(nombre_objetivo);
          continue; // Saltar la creación si ya existe
        }

        const newObjetivo = await ObjetivosNutricionalesService.createObjetivoNutricional({
          nombre_objetivo,
          descripcion,
        });

        createdObjetivos.push(newObjetivo);
      } catch (error) {
        console.error(`Error creating nutritional objective ${nombre_objetivo}:`, error);
        failedObjetivos.push(nombre_objetivo);
      }
    }

    let responseMessage = {};

    if (failedObjetivos.length > 0) {
      responseMessage.error = `Llaves duplicadas violan restricción de unicidad. Estos objetivos no se insertaron en la base de datos: ${failedObjetivos.join(', ')}`;
    }

    if (createdObjetivos.length > 0) {
      responseMessage.exito = `Estos objetivos se crearon: ${createdObjetivos.map(obj => obj.nombre_objetivo).join(', ')}`;
    }

    if (failedObjetivos.length > 0 && createdObjetivos.length > 0) {
      res.status(207).json(responseMessage);
    } else if (failedObjetivos.length > 0) {
      res.status(400).json(responseMessage);
    } else {
      res.json(responseMessage);
    }
  } catch (error) {
    console.error('Error creating nutritional objectives:', error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un objetivo nutricional por ID
export const updateObjetivoNutricionalId = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const objetivosData = req.body;

    console.log(`PUT /objetivos-nutricionales/${id}`);
    console.log('Request body:', req.body);

    if (!/^\d+$/.test(trim(id))) {
      console.log('ID is not a number');
      return res.status(400).json({ error: 'El ID debe ser un número' });
    }

    if (Array.isArray(objetivosData)) {
      return res.status(400).json({ error: 'El cuerpo de la solicitud debe contener un único objeto de datos del objetivo nutricional' });
    }

    const updatedObjetivo = await ObjetivosNutricionalesService.updateObjetivoNutricionalId(trim(id), objetivosData, transaction);

    if (!updatedObjetivo) {
      await transaction.rollback();
      console.log(`Objetivo nutricional con ID: ${id} no encontrado`);
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

// Actualizar un objetivo nutricional por Nombre
export const updateObjetivoNutricionalNombre = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { nombre } = req.params;
    const objetivosData = req.body;

    if(Array.isArray(objetivosData)){
      return res.status(400).json({ error: 'El cuerpo de la solicitud debe contener un único objeto de datos del objetivo nutricional'});
    }

    console.log(`PUT /objetivos/nombre/${nombre}`);
    console.log('Request body:', objetivosData);

    const updatedObjetivo = await ObjetivosNutricionalesService.updateObjetivoNutricionalNombre(trim(nombre), objetivosData, transaction);

    if(!updatedObjetivo){
      console.log(`Objetivo nutricional con nombre ${nombre} no encontrado`);
      await transaction.rollback();
      return res.status(404).json({ error: 'Objetivo no encontrado' });
    }

    await transaction.commit();
    console.log('Objetivo nutricional actualizado ', updatedObjetivo);
    res.json(updatedObjetivo);
  } catch(error) {
    await transaction.rollback();
    console.error('Error updating nutritional objective:', error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un objetivo nutricional por ID
export const deleteObjetivoNutricionalId = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    console.log(`DELETE /objetivos-nutricionales/${id}`);

    const deletedMessage = await ObjetivosNutricionalesService.deleteObjetivoNutricionalId(trim(id), transaction);

    if(!deletedMessage || deletedMessage.error){
      console.log(`Objetivo nutricional con id ${id} no encontrado`);
      await transaction.rollback();
      return res.status(404).json({ error: 'Objetivo no encontrado' });
    }

    await transaction.commit();
    console.log('Deleted nutritional objective:', deletedMessage);
    res.json({ message: 'Objetivo eliminado' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting nutritional objective:', error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un objetivo nutricional por nombre
export const deleteObjetivoNutricionalNombre = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { nombre_objetivo } = req.params;
    console.log(`DELETE /objetivos-nutricionales/${nombre_objetivo}`);
    
    const deletedMessage = await ObjetivosNutricionalesService.deleteObjetivoNutricionalNombre(trim(nombre_objetivo), transaction);

    if (!deletedMessage || deletedMessage.error) {
      console.log(`Objetivo Nutricional con nombre: ${nombre_objetivo} no encontrado`);
      await transaction.rollback();
      return res.status(404).json({ error: `Objetivo Nutricional con nombre ${nombre_objetivo} no encontrado o no eliminado` });
    }

    await transaction.commit();
    console.log(`Deleted Objetivo Nutricional with name: ${nombre_objetivo}`);
    res.json({ message: `Objetivo Nutricional con nombre ${nombre_objetivo} eliminado` });

  } catch(error) {
    if (transaction && transaction.finished !== 'commit' && transaction.finished !== 'rollback') {
      await transaction.rollback();
    }
    console.error('Error deleting objetivo nutricional by name:', error);
    res.status(500).json({ error: error.message });
  }
};