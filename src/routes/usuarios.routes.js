import { Router } from "express";

import {
  createUsuario,
  getUsuarios,
  getUsuarioID,
  getUsuariosTipo,
  getUsuarioEmail,
  getUsuarioNombre,
  getUsuariosEspecialidad,
  updateUsuarioId,
  updateUsuarioEmail,
  deleteUsuarioById,
  deleteUsuarioByEmail
} from "../controllers/usuarios.controller.js";

const router = Router();

// Routes
//Crear
router.post("/usuarios", createUsuario);

//Leer
router.get("/usuarios", getUsuarios);
router.get("/usuarios/id/:id", getUsuarioID);
router.get("/usuarios/correo/:email", getUsuarioEmail);
router.get("/usuarios/nombre/:nombre", getUsuarioNombre);
router.get("/usuarios/tipo/:tipo_usuario", getUsuariosTipo);
router.get("/usuarios/especialidad/:especialidad", getUsuariosEspecialidad);

//Actualizar
router.put("/usuarios/id/:id", updateUsuarioId);
router.put("/usuarios/correo/:email", updateUsuarioEmail);

//Eliminar
router.delete("/usuarios/id/:id", deleteUsuarioById);
router.delete("/usuarios/correo/:email", deleteUsuarioByEmail);

export default router;
