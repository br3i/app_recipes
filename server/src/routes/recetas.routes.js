import { Router } from "express";
import {
  createRecetas,
  getRecetas,
  getRecetaId,
  getRecetaNombre,
  getRecetaObjetivo,
  getRecetasByComparison,
  updateRecetaId,
  //updateRecetaNombre,
  deleteRecetaId,
  //deleteRecetaNombre
} from "../controllers/recetas.controller.js";

const router = Router();

// Routes
//Crear
router.post("/recetas", createRecetas);

//Leer
router.get("/recetas", getRecetas);
router.get("/recetas/id/:id", getRecetaId);
router.get("/recetas/nombre/:nombre", getRecetaNombre);
router.get("/recetas/objetivo/:objetivo", getRecetaObjetivo);
router.get('/recetas/:comparison/:parameter/:value', getRecetasByComparison);

//Actualizar
router.put("/recetas/id/:id", updateRecetaId);
//router.put("/recetas/nombre/:nombre", updateRecetaNombre);

//Eliminar
router.delete("/recetas/id/:id", deleteRecetaId);
//router.delete("/recetas/nombre/:nombre", deleteRecetaNombre);

export default router;
