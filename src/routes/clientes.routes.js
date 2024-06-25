import { Router } from "express";
import {
  getClientes,
  getClienteId,
  createCliente,
  updateCliente,
  deleteCliente,
  loginCliente,
  changePasswordCliente,
} from "../controllers/clientes.controller.js";

const router = Router();

// Rutas para clientes
router.get("/clientes", getClientes);
router.get("/clientes/:id", getClienteId);
router.post("/clientes", createCliente);
router.put("/clientes/:id", updateCliente);
router.delete("/clientes/:id", deleteCliente);

// Autenticación y gestión de contraseñas
router.post("/clientes/login", loginCliente);
router.put("/clientes/:id/password", changePasswordCliente);

export default router;
