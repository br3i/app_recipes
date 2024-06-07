import express from "express";
import usuariosRoutes from "./routes/usuarios.routes.js";
import comentariosRoutes from "./routes/comentarios.routes.js";
import ingredientesRoutes from "./routes/ingredientes.routes.js";
import recetasRoutes from "./routes/recetas.routes.js";
import objetivosRoutes from "./routes/objetivos_nutricionales.routes.js";

const app = express();

// Middleware
app.use(express.json());

// Middleware de registro para verificar los parámetros de la URL
app.use((req, res, next) => {
  console.log('URL:', req.url);
  console.log('Parámetros:', req.params);
  next();
});

// Routes
app.use(usuariosRoutes);
app.use(comentariosRoutes);
app.use(ingredientesRoutes);
app.use(recetasRoutes);
app.use(objetivosRoutes);

export default app;
