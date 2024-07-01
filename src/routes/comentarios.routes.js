import { Router } from "express";

import {
  getComentarios,
  getComentarioId,
  getComentariosIdUsuario,
  getComentariosNombreUsuario,
  createComentario,
  updateComentarioId,
  deleteComentarioId,
  deleteComentariosIdUsuario,
} from "../controllers/comentarios.controller.js";

const router = Router();

// Routes
//Crear
router.post("/comentarios/:id", createComentario);

//Leer
router.get("/comentarios/", getComentarios);
router.get("/comentarios/id/:id", getComentarioId);
router.get("/comentarios/nombreU/:nombreU", getComentariosNombreUsuario);
router.get("/comentarios/idU/:idU", getComentariosIdUsuario);

//Actualizar
router.put("/comentarios/id/:id", updateComentarioId);

//Eliminar
router.delete("/comentarios/id/:id", deleteComentarioId);
router.delete("/comentarios/idU/:idU", deleteComentariosIdUsuario);

export default router;