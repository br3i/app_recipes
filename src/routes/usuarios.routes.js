import { Router } from "express";
import {
  getUsuarios,
  getUsuarioID,
  getUsuariosTipo,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  login,
  changePassword,
} from "../controllers/usuarios.controller.js";

const router = Router();

// Routes
router.post("/usuarios", createUsuario);
router.get("/usuarios", getUsuarios);
router.get("/usuarios/:id", getUsuarioID);
router.get("/usuarios/tipo/:tipo_usuario", getUsuariosTipo);
router.put("/usuarios/:id", updateUsuario);
router.delete("/usuarios/:id", deleteUsuario);

// Authentication and Password Management
router.post("/login", login);
router.put("/usuarios/:id/password", changePassword);

export default router;
