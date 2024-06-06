import express from "express";
import usuariosRoutes from "./routes/usuarios.routes.js";
import comentariosRoutes from "./routes/comentarios.routes.js"
import ingredientesRoutes from "./routes/ingredientes.routes.js"

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use(usuariosRoutes);
app.use(comentariosRoutes);
app.use(ingredientesRoutes);

export default app;
