import { Router } from "express";
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  getUsuario,
  deleteUsuario,
} from "../controllers/usuarios.controller.js";

const router = Router();

// Routes
router.post("/usuarios", createUsuario);
router.get("/usuarios", getUsuarios);
router.put("/usuarios/:id", updateUsuario);
router.delete("/usuarios/:id", deleteUsuario);
router.get("/usuarios/:id", getUsuario);

export default router;
