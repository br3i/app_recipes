import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import axios from 'axios';
import usuariosRoutes from "./routes/usuarios.routes.js";
import comentariosRoutes from "./routes/comentarios.routes.js";
import ingredientesRoutes from "./routes/ingredientes.routes.js";
import recetasRoutes from "./routes/recetas.routes.js";
import objetivosRoutes from "./routes/objetivos_nutricionales.routes.js";
import ingredienteUsuarioRoutes from "./routes/clientes.routes.js";
import recomendacionesRoutes from "./routes/recomendaciones.routes.js"; // Importa la nueva ruta de recomendaciones

dotenv.config();

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


// Ruta para obtener ingredientes desde FatSecret
app.get('/api/fatsecret/ingredients', async (req, res) => {
  try {
    console.log('Request received for /api/fatsecret/ingredients');

    // Obtener token de acceso
    console.log('Attempting to obtain access token...');
    const tokenResponse = await axios.post('https://oauth.fatsecret.com/connect/token', new URLSearchParams({
      'grant_type': 'client_credentials',
      'scope': process.env.FATSECRET_SCOPE
    }), {
      auth: {
        username: process.env.FATSECRET_CLIENT_ID,
        password: process.env.FATSECRET_CLIENT_SECRET
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    console.log('Access token response:', tokenResponse.data);
    const accessToken = tokenResponse.data.access_token;

    // Hacer solicitud a la API de FatSecret
    console.log('Making API request to FatSecret with access token...');
    const apiResponse = await axios.get('https://platform.fatsecret.com/rest/server.api', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      params: {
        'method': 'foods.search',
        'search_expression': 'apple',  // Cambia esto por el término de búsqueda deseado
        'format': 'json'
      }
    });

    console.log('API response from FatSecret:', apiResponse.data);
    res.json(apiResponse.data);
  } catch (error) {
    console.error('Error occurred:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      res.status(500).json({ error: error.response.data });
    } else {
      console.error('Error message:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
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

