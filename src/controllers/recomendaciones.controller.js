// src/controllers/recomendaciones.controller.mjs
import { recomendarRecetas } from '../services/recommendation.service.js';

export const obtenerRecomendaciones = async (req, res) => {
    const { ingredientes, objetivo } = req.body;
    try {
        const recomendaciones = await recomendarRecetas(ingredientes, objetivo);
        res.status(200).json(recomendaciones);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener recomendaciones' });
    }
};
