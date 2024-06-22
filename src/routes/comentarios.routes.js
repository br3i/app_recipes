import { Router } from "express";

import {
  getComentarios,
  getComentarioId,
  getComentariosIdUsuario,
  createComentario,
  updateComentario,
  deleteComentario,
  deleteComentariosIdUsuario,
} from "../controllers/comentarios.controller.js";

const router = Router();

// Routes
router.get("/comentarios", getComentarios);
router.get("/comentarios/:id", getComentarioId);
router.get("/comentariosU/:id", getComentariosIdUsuario);
router.post("/comentarios/:id", createComentario);
router.put("/comentarios/:id", updateComentario);
router.delete("/comentarios/:id", deleteComentario);
router.delete("/comentariosU/:id", deleteComentariosIdUsuario);

export default router;
