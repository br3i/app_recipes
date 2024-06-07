import { Router } from "express";
import {
  getRecetas,
  getRecetaId,
  getRecetaNombre,
  createReceta,
  updateReceta,
  deleteReceta
} from "../controllers/recetas.controller.js";

const router = Router();

// Routes
router.get("/recetas", getRecetas);
router.get("/recetas/:id", getRecetaId);
router.get("/recetas/nombre/:nombre", getRecetaNombre);
router.post("/recetas", createReceta);
router.put("/recetas/:id", updateReceta);
router.delete("/recetas/:id", deleteReceta);

export default router;
