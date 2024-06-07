import { sequelize } from "../database/database.js";
import { Recetas } from "../models/recetas.js";
import { Recetas_Ingredientes } from "../models/recetas_ingredientes.js";
import { Ingredientes } from "../models/ingredientes.js";
import { Objetivos_Nutricionales } from "../models/objetivos_nutricionales.js";

// Obtiene todas las recetas
export const getRecetas = async (req, res) => {
  try {
    const recetas = await Recetas.findAll({
      include: [
        {
          model: Objetivos_Nutricionales,
          as: 'objetivo', // Alias para la relación
          attributes: ['id_objetivo', 'nombre_objetivo', 'descripcion']
        },
        {
          model: Recetas_Ingredientes,
          as: 'recetas_ingredientes',
          include: [
            {
              model: Ingredientes,
              as: 'ingrediente',
              attributes: ['id_ingrediente', 'nombre', 'categoria', 'calorias', 'proteinas', 'carbohidratos', 'grasas', 'azucar', 'fibra', 'sodio']
            }
          ]
        }
      ]
    });
    res.json(recetas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtiene una receta por ID
export const getRecetaId = async (req, res) => {
  try {
    const { id } = req.params;
    const receta = await Recetas.findByPk(id, {
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
      return res.status(404).json({ error: "Receta no encontrada" });
    }

    res.json(receta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtiene una receta por el nombre

export const getRecetaNombre = async (req, res) => {
  try {
    const { nombre } = req.params;
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
      return res.status(404).json({ error: "Receta no encontrada" });
    }

    res.json(receta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crea una nueva receta
export const createReceta = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { nombre, instrucciones_prep, tiempo_coccion, calorias_totales, proteinas_totales, carbohidratos_totales, grasas_totales, azucares_totales, fibra_total, sodio_total, id_objetivo, ingredientes } = req.body;

    const newReceta = await Recetas.create({
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
    }, { transaction });

    for (const ingrediente of ingredientes) {
      await Recetas_Ingredientes.create({
        id_receta: newReceta.id_receta,
        id_ingrediente: ingrediente.id_ingrediente,
        cantidad: ingrediente.cantidad
      }, { transaction });
    }

    await transaction.commit();
    res.json(newReceta);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

// Actualiza una receta
export const updateReceta = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { nombre, instrucciones_prep, tiempo_coccion, calorias_totales, proteinas_totales, carbohidratos_totales, grasas_totales, azucares_totales, fibra_total, sodio_total, id_objetivo, ingredientes } = req.body;

    const receta = await Recetas.findByPk(id, { transaction });

    if (!receta) {
      return res.status(404).json({ error: "Receta no encontrada" });
    }

    receta.nombre = nombre;
    receta.instrucciones_prep = instrucciones_prep;
    receta.tiempo_coccion = tiempo_coccion;
    receta.calorias_totales = calorias_totales;
    receta.proteinas_totales = proteinas_totales;
    receta.carbohidratos_totales = carbohidratos_totales;
    receta.grasas_totales = grasas_totales;
    receta.azucares_totales = azucares_totales;
    receta.fibra_total = fibra_total;
    receta.sodio_total = sodio_total;
    receta.id_objetivo = id_objetivo;

    await receta.save({ transaction });

    await Recetas_Ingredientes.destroy({
      where: { id_receta: id },
      transaction
    });

    for (const ingrediente of ingredientes) {
      await Recetas_Ingredientes.create({
        id_receta: id,
        id_ingrediente: ingrediente.id_ingrediente,
        cantidad: ingrediente.cantidad
      }, { transaction });
    }

    await transaction.commit();
    res.json(receta);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

// Elimina una receta
export const deleteReceta = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const receta = await Recetas.findByPk(id, { transaction });

    if (!receta) {
      await transaction.rollback();
      return res.status(404).json({ error: "Receta no encontrada" });
    }

    await Recetas_Ingredientes.destroy({
      where: { id_receta: id },
      transaction
    });

    await receta.destroy({ transaction });
    await transaction.commit();
    res.json({ message: "Receta eliminada" });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};
