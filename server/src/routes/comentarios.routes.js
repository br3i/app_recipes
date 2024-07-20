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
  sendComment // Importa la función del controlador
} from "../controllers/comentarios.controller.js";

const router = Router();

// Routes
// Crear
router.post("/comentarios/:id", createComentario);

// Leer
router.get("/comentarios/", getComentarios);
router.get("/comentarios/id/:id", getComentarioId);
router.get("/comentarios/nombreU/:nombreU", getComentariosNombreUsuario);
router.get("/comentarios/idU/:idU", getComentariosIdUsuario);

// Actualizar
router.put("/comentarios/id/:id", updateComentarioId);

// Eliminar
router.delete("/comentarios/id/:id", deleteComentarioId);
router.delete("/comentarios/idU/:idU", deleteComentariosIdUsuario);

// Enviar comentario por correo
router.post("/send-comment", sendComment); // Nueva ruta para enviar comentarios

export default router;
