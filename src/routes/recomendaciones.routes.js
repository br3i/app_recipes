// src/routes/recomendaciones.routes.js
import { Router } from 'express';
import { obtenerRecomendaciones } from '../controllers/recomendaciones.controller.js';

const router = Router();

router.post('/recomendaciones', obtenerRecomendaciones);

export default router;
