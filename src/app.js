import express from "express";
import usuariosRoutes from "./routes/usuarios.routes.js";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use(usuariosRoutes);

export default app;
