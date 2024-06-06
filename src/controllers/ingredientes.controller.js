import { sequelize } from "../database/database.js";
import { Ingredientes } from "../models/ingredientes.js";

// Obtiene todos los Ingredientes
export const getIngredientes = async (req, res) => {
  try {
    const ingredientes = await Ingredientes.findAll();
    res.json(ingredientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtiene un Ingrediente por Id de ingrediente
export const getIngredienteId = async (req, res) => {
  try {
    const { id } = req.params;
    const ingrediente = await Ingredientes.findByPk(id);
    
    if (!ingrediente) {
      return res.status(404).json({ error: "Ingrediente no encontrado" });
    }

    res.json(ingrediente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un Ingrediente por Nombre
export const getIngredienteNbr = async (req, res) => {
  try {
    const { nombre } = req.params;
    const ingrediente = await Ingredientes.findOne({
      where: { nombre }
    });

    if (!ingrediente) {
      return res.status(404).json({ error: "Ingrediente no encontrado" });
    }

    res.json(ingrediente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener Ingredientes por Categoría
export const getIngredienteCtg = async (req, res) => {
  try {
    const { categoria } = req.params;
    const ingredientes = await Ingredientes.findAll({
      where: { categoria }
    });

    if (ingredientes.length === 0) {
      return res.status(404).json({ error: "No se encontraron ingredientes para esta categoría" });
    }

    res.json(ingredientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un Ingrediente
export const createIngrediente = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { nombre, categoria, calorias, proteinas, carbohidratos, grasas, azucar, fibra, sodio } = req.body;
    const newIngrediente = await Ingredientes.create({
      nombre,
      categoria,
      calorias,
      proteinas,
      carbohidratos,
      grasas,
      azucar,
      fibra,
      sodio,
    }, { transaction });

    await transaction.commit();
    res.json(newIngrediente);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

// Actualiza un Ingrediente
export const updateIngrediente = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const ingredienteData = req.body;
    const ingrediente = await Ingredientes.findByPk(id, { transaction });

    if (!ingrediente) {
      return res.status(404).json({ error: "Ingrediente no encontrado" });
    }

    Object.keys(ingredienteData).forEach(key => {
      ingrediente[key] = ingredienteData[key];
    });

    await ingrediente.save({ transaction });
    await transaction.commit();
    res.json(ingrediente);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

// Elimina un Ingrediente por id_ingrediente
export const deleteIngrediente = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const ingrediente = await Ingredientes.findByPk(id, { transaction });

    if (!ingrediente) {
      await transaction.rollback();
      return res.status(404).json({ error: "Ingrediente no encontrado" });
    }

    await ingrediente.destroy({ transaction });
    await transaction.commit();
    res.json({ message: "Ingrediente eliminado" });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};
