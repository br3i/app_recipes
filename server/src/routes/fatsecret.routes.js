import { Router } from 'express';
import { getIngredientsFromFatSecret } from '../controllers/fatsecret.controller.js'; // Ajusta la ruta según tu estructura de proyecto

const router = Router();

router.get('/fatsecret/ingredients', getIngredientsFromFatSecret);

export default router;
