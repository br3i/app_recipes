import RecetasService from "./recetas.service.js"; // Importa RecetasService

const calcularSimilitudIngredientes = (ingredientesUsuario, ingredientesReceta) => {
  const nombresIngredientesReceta = ingredientesReceta.map(ingrediente => ingrediente.nombre); 
  const interseccion = ingredientesUsuario.filter(ingrediente => nombresIngredientesReceta.includes(ingrediente));
  const union = new Set([...ingredientesUsuario, ...nombresIngredientesReceta]);
  return interseccion.length / union.size;
};

const calcularAdecuacionNutricional = (objetivoNutricional, receta) => {
  switch (objetivoNutricional) {
      case 'Pérdida de peso':
          return receta.calorias_totales < 500 ? 1 : 0;
      case 'Ganancia muscular':
          return receta.proteinas_totales / receta.calorias_totales;
      case 'Mantenimiento':
          return receta.calorias_totales >= 500 && receta.calorias_totales <= 700 ? 1 : 0;
      case 'Salud cardiovascular':
          return receta.grasas_totales / receta.calorias_totales < 0.3 ? 1 : 0;
      default:
          return 0;
  }
};

export const recomendarRecetas = async (ingredientesUsuario, objetivoNutricional) => {
  try {
      console.log('Inicio de recomendarRecetas');
      console.log('Ingredientes del usuario:', ingredientesUsuario);
      console.log('Objetivo nutricional:', objetivoNutricional);

      const recetas = await RecetasService.getAllRecetas();
      console.log('Recetas obtenidas:', recetas);

      const recetasFiltradas = recetas.filter(receta => 
          calcularSimilitudIngredientes(ingredientesUsuario, receta.ingredientes) > 0.5
      );
      console.log('Recetas filtradas por similitud de ingredientes:', recetasFiltradas);

      const recetasPuntuadas = recetasFiltradas.map(receta => ({
          receta,
          puntuacion: calcularSimilitudIngredientes(ingredientesUsuario, receta.ingredientes) * 0.5 +
                      calcularAdecuacionNutricional(objetivoNutricional, receta) * 0.5
      }));
      console.log('Recetas puntuadas:', recetasPuntuadas);

      recetasPuntuadas.sort((a, b) => b.puntuacion - a.puntuacion);
      const topRecetas = recetasPuntuadas.slice(0, 5).map(r => r.receta);
      console.log('Top 5 recetas recomendadas:', topRecetas);

      return topRecetas;
  } catch (error) {
      console.error('Error en recomendarRecetas:', error);
      throw error;
  }
};

