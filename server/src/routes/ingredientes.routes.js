import { Router } from "express";

import {
  getIngredientes,
  getIngredienteId,
  getIngredienteNbr,
  getIngredienteCtg,
  getCategorias,
  getIngredientesByComparison,
  createIngredientes,
  updateIngredientesId,
  updateIngredientesNombre,
  deleteIngredientesId,
  deleteIngredientesByNombre
} from "../controllers/ingredientes.controller.js";

const router = Router();

// Routes
//Crear
router.post("/ingredientes", createIngredientes);

//Leer
router.get("/ingredientes", getIngredientes);
router.get("/ingredientes/:id", getIngredienteId);
router.get("/ingredientes/nombre/:nombre", getIngredienteNbr);
router.get("/ingredientes/categoria/:categoria", getIngredienteCtg);
router.get('/ingredientes/:comparison/:parameter/:value', getIngredientesByComparison);
router.get('/todas_categorias/', getCategorias);

//Actualizar
router.put("/ingredientes/id/:id", updateIngredientesId);
router.put("/ingredientes/nombre/:nombre", updateIngredientesNombre);

//Eliminar
router.delete("/ingredientes/:id", deleteIngredientesId);
router.delete('/ingredientes/nombre/:nombre', deleteIngredientesByNombre);

export default router;
