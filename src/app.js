import express from "express";
import usuariosRoutes from "./routes/usuarios.routes.js";
import comentariosRoutes from "./routes/comentarios.routes.js"

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use(usuariosRoutes);
app.use(comentariosRoutes);

export default app;
