import { Router } from "express";
import {
  getUsuarios,
  getUsuarioID,
  getUsuariosTipo,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from "../controllers/usuarios.controller.js";

const router = Router();

// Routes
router.post("/usuarios", createUsuario);
router.get("/usuarios", getUsuarios);
router.get("/usuarios/:id", getUsuarioID);
router.get("/usuarios/tipo/:tipo_usuario", getUsuariosTipo);
router.put("/usuarios/:id", updateUsuario);
router.delete("/usuarios/:id", deleteUsuario);

export default router;
