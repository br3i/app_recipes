import { sequelize } from "../database/database.js";
import { Objetivos_Nutricionales } from "../models/objetivos_nutricionales.js";

// Obtener todos los objetivos nutricionales
export const getObjetivosNutricionales = async (req, res) => {
  try {
    const objetivos = await Objetivos_Nutricionales.findAll();
    res.json(objetivos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un objetivo nutricional por ID
export const getObjetivoNutricionalId = async (req, res) => {
  try {
    const { id } = req.params;
    const objetivo = await Objetivos_Nutricionales.findByPk(id);
    if (!objetivo) {
      return res.status(404).json({ error: "Objetivo no encontrado" });
    }
    res.json(objetivo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un objetivo nutricional por nombre
export const getObjetivoNutricionalNombre = async (req, res) => {
  try {
    const { nombre } = req.params;
    const objetivos = await Objetivos_Nutricionales.findAll({ where: { nombre_objetivo: nombre } });
    res.json(objetivos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo objetivo nutricional
export const createObjetivoNutricional = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { nombre_objetivo, descripcion } = req.body;
    const newObjetivo = await Objetivos_Nutricionales.create({ nombre_objetivo, descripcion }, { transaction });
    await transaction.commit();
    res.json(newObjetivo);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un objetivo nutricional
export const updateObjetivoNutricional = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { nombre_objetivo, descripcion } = req.body;
    const objetivo = await Objetivos_Nutricionales.findByPk(id, { transaction });
    if (!objetivo) {
      return res.status(404).json({ error: "Objetivo no encontrado" });
    }
    objetivo.nombre_objetivo = nombre_objetivo;
    objetivo.descripcion = descripcion;
    await objetivo.save({ transaction });
    await transaction.commit();
    res.json(objetivo);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un objetivo nutricional por ID
export const deleteObjetivoNutricional = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const objetivo = await Objetivos_Nutricionales.findByPk(id, { transaction });
    if (!objetivo) {
      await transaction.rollback();
      return res.status(404).json({ error: "Objetivo no encontrado" });
    }
    await objetivo.destroy({ transaction });
    await transaction.commit();
    res.json({ message: "Objetivo eliminado" });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};
