import { Router } from "express";

import {
  getIngredientes,
  getIngredienteId,
  getIngredienteNbr,
  getIngredienteCtg,
  createIngrediente,
  updateIngrediente,
  deleteIngrediente,
} from "../controllers/ingredientes.controller.js";

const router = Router();

// Routes
router.get("/ingredientes", getIngredientes);
router.get("/ingredientes/:id", getIngredienteId);
router.get("/ingredientesNbr/:nombre", getIngredienteNbr);
router.get("/ingredientesCtg/:categoria", getIngredienteCtg);
router.post("/ingredientes", createIngrediente);
router.put("/ingredientes/:id", updateIngrediente);
router.delete("/ingredientes/:id", deleteIngrediente);

export default router;
