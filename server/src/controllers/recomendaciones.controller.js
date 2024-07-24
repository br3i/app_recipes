// src/controllers/recomendaciones.controller.js
import RecetasService from '../services/recetas.service.js';

export const obtenerRecomendaciones = async (req, res) => {
  const { ingredientes, objetivo } = req.body;

  try {
    const recomendaciones = await RecetasService.recommendRecetasByIngredientes(ingredientes, objetivo);
    res.json(recomendaciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener recomendaciones' });
  }
};

export const guardarRecomendaciones = async (req, res) => {
  const { recomendaciones, objetivo, id_cliente } = req.body;

  console.log('Datos recibidos en el controlador para guardar:', recomendaciones, objetivo, id_cliente);

  try {
    await RecetasService.saveRecomendaciones(recomendaciones, objetivo, id_cliente);
    res.status(200).json({ message: 'Recomendaciones guardadas exitosamente' });
  } catch (error) {
    console.error('Error en el controlador al guardar recomendaciones:', error);
    res.status(500).json({ error: 'Error al guardar recomendaciones' });
  }
};

export const fetchHistorialRecomendaciones = async (req, res) => {
  const id_ingrediente_usuario = req.params.id_cliente;

  console.log('ID cliente recibido para historial:', id_ingrediente_usuario);

  try {
    const historial = await RecetasService.getHistorialRecomendaciones(id_ingrediente_usuario);
    res.json(historial);
  } catch (error) {
    console.error('Error en fetchHistorialRecomendaciones:', error);
    res.status(500).json({ error: 'Error al obtener el historial de recomendaciones' });
  }
};