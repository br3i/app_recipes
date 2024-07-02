import express from "express";
import cors from "cors";
import usuariosRoutes from "./routes/usuarios.routes.js";
import comentariosRoutes from "./routes/comentarios.routes.js";
import ingredientesRoutes from "./routes/ingredientes.routes.js";
import recetasRoutes from "./routes/recetas.routes.js";
import objetivosRoutes from "./routes/objetivos_nutricionales.routes.js";
import ingredienteUsuarioRoutes from "./routes/clientes.routes.js";
import recomendacionesRoutes from "./routes/recomendaciones.routes.js"; // Importa la nueva ruta de recomendaciones

// Importar relaciones
import './models/relaciones.js';

const app = express();

// Middleware
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000'
}));

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
app.use(ingredienteUsuarioRoutes);
app.use(recomendacionesRoutes); // Usa la nueva ruta de recomendaciones

export default app;

