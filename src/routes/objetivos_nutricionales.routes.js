import { Router } from "express";
import{
    getObjetivosNutricionales,
    getObjetivoNutricionalId,
    getObjetivoNutricionalNombre,
    createObjetivoNutricional,
    updateObjetivoNutricional,
    deleteObjetivoNutricional
}from "../controllers/objetivos_nutricionales.controller.js"

const router = Router();

// Routes
router.get("/objetivos", getObjetivosNutricionales);
router.get("/objetivos/:id", getObjetivoNutricionalId);
router.get("/objetivos/nombre/:nombre", getObjetivoNutricionalNombre);
router.post("/objetivos", createObjetivoNutricional);
router.put("/objetivos/:id", updateObjetivoNutricional);
router.delete("/objetivos/:id", deleteObjetivoNutricional);

export default router;