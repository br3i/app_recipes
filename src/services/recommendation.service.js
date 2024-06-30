import RecetasService from './recetas.service.js'; // Importa el servicio de recetas

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

        // Filtrar recetas que contienen al menos uno de los ingredientes proporcionados
        const recetasFiltradas = recetas.filter(receta => 
            receta.ingredientes.some(ingrediente => ingredientesUsuario.includes(ingrediente.nombre))
        );
        console.log('Recetas filtradas por similitud de ingredientes:', recetasFiltradas);

        // Calcular la puntuación de cada receta
        const recetasPuntuadas = recetasFiltradas.map(receta => ({
            receta,
            puntuacion: calcularSimilitudIngredientes(ingredientesUsuario, receta.ingredientes) * 0.5 +
                        calcularAdecuacionNutricional(objetivoNutricional, receta) * 0.5
        }));
        console.log('Recetas puntuadas:', recetasPuntuadas);

        // Ordenar recetas por puntuación
        recetasPuntuadas.sort((a, b) => b.puntuacion - a.puntuacion);

        // Obtener las recetas que cumplen con todos los ingredientes ingresados primero
        const recetasCumplenTodos = recetasPuntuadas.filter(r => 
            ingredientesUsuario.every(ingrediente => r.receta.ingredientes.map(ing => ing.nombre).includes(ingrediente))
        );

        // Combinar recetas que cumplen todos los ingredientes y las que no pero tienen puntuación alta
        let topRecetas = [...recetasCumplenTodos, ...recetasPuntuadas].map(r => r.receta);

        // Asegurar solo 3 recetas en la recomendación
        topRecetas = topRecetas.slice(0, 3);
        
        // Si no hay suficientes recetas, rellenar con las recetas mejor puntuadas
        if (topRecetas.length < 3) {
            const adicionales = recetasPuntuadas.slice(0, 3 - topRecetas.length).map(r => r.receta);
            topRecetas.push(...adicionales);
        }

        console.log('Top recetas recomendadas:', topRecetas);

        return topRecetas;
    } catch (error) {
        console.error('Error en recomendarRecetas:', error);
        throw error;
    }
};
