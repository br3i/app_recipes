// src/routes/recomendaciones.routes.js
import { Router } from 'express';
import { guardarRecomendaciones, obtenerRecomendaciones, fetchHistorialRecomendaciones } from '../controllers/recomendaciones.controller.js';

const router = Router();

router.post('/recomendaciones', obtenerRecomendaciones);
router.post('/guardar-recomendaciones/', guardarRecomendaciones);

router.get('/historial-recomendaciones/:id_cliente', fetchHistorialRecomendaciones);

export default router;
