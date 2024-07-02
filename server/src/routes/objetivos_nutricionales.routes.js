import { Router } from "express";

import{
    createObjetivoNutricional,
    getObjetivosNutricionales,
    getObjetivoNutricionalId,
    getObjetivoNutricionalNombre,
    getObjetivoNutricionalDescripcion,
    updateObjetivoNutricionalId,
    updateObjetivoNutricionalNombre,
    deleteObjetivoNutricionalId,
    deleteObjetivoNutricionalNombre
} from "../controllers/objetivos_nutricionales.controller.js"

const router = Router();

// Routes
//Crear
router.post("/objetivos", createObjetivoNutricional);

//Leer
router.get("/objetivos", getObjetivosNutricionales);
router.get("/objetivos/:id", getObjetivoNutricionalId);
router.get("/objetivos/nombre/:nombre", getObjetivoNutricionalNombre);
router.get("/objetivos/descripcion/:descripcion", getObjetivoNutricionalDescripcion);

//Actualizar
router.put("/objetivos/id/:id", updateObjetivoNutricionalId);
router.put("/objetivos/nombre/:nombre", updateObjetivoNutricionalNombre);

//Eliminar
router.delete("/objetivos/id/:id", deleteObjetivoNutricionalId);
router.delete("/objetivos/nombre/:nombre_objetivo", deleteObjetivoNutricionalNombre);

export default router;