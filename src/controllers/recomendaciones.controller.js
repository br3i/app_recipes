// src/controllers/recomendaciones.controller.mjs
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
