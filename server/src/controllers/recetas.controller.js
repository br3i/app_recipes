import { sequelize } from "../database/database.js";
import RecetasService from "../services/recetas.service.js";
import { trim } from "../utilities/trim.js";
import { calcularTotalesFromIngredientes } from "../utilities/calculos.js";

// Obtiene todas las recetas
export const getRecetas = async (req, res) => {
  try {
    console.log('GET /recetas');
    const recetas = await RecetasService.getAllRecetas();
    console.log('Sending response with recipes:', recetas);
    res.json(recetas);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtiene una receta por ID
export const getRecetaId = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`GET /recetas/${id}`);

    if (!/^\d+$/.test(trim(id))) {
      console.log('ID is not a number');
      return res.status(400).json({ error: 'El ID debe ser un número' });
    }

    const receta = await RecetasService.getRecetaById(trim(id));

    if (!receta) {
      console.log(`Recipe with ID: ${id} not found`);
      return res.status(404).json({ error: 'Receta no encontrada' });
    }

    console.log('Sending response with recipe:', receta);
    res.json(receta);
  } catch (error) {
    console.error(`Error fetching recipe with ID: ${req.params.id}`, error);
    res.status(500).json({ error: error.message });
  }
};

// Obtiene una receta por el nombre
export const getRecetaNombre = async (req, res) => {
  try {
    const { nombre } = req.params;
    console.log(`GET /recetas/nombre/${nombre}`);
    const receta = await RecetasService.getRecetaByNombre(trim(nombre));

    if (!receta) {
      console.log(`Recipe with name: ${nombre} not found`);
      return res.status(404).json({ error: 'Receta no encontrada' });
    }

    console.log('Sending response with recipe:', receta);
    res.json(receta);
  } catch (error) {
    console.error(`Error fetching recipe with name: ${req.params.nombre}`, error);
    res.status(500).json({ error: error.message });
  }
};

export const getRecetaObjetivo = async (req, res) => {
  try {
    const { objetivo } = req.params;
    console.log(`GET /recetas/objetivo/${objetivo}`);
    const recetas = await RecetasService.getRecetaByObjetivo(trim(objetivo));

    if (!recetas) {
      console.log(`No recipes found with objetivo name: ${objetivo}`);
      return res.status(404).json({ error: 'No se encontraron recetas para el objetivo especificado' });
    }

    console.log('Sending response with recipes:', recetas);
    res.json(recetas);
  } catch (error) {
    console.error(`Error fetching recipes with objetivo ID: ${req.params.id_objetivo}`, error);
    res.status(500).json({ error: error.message });
  }
}
// Obtiene recetas bajo un parámetro de condición y el tiempo de coccion
export const getRecetasByComparison = async (req, res) => {
  try {
    const { comparison, parameter, value } = req.params;
    console.log(`GET /recetas/${comparison}/${parameter}/${value}`);

    // Diccionario de parámetros permitidos y sus correspondientes nombres en la base de datos
    const parameterMapping = {
      tiempo: 'tiempo_coccion',
      calorias: 'calorias_totales',
      proteinas: 'proteinas_totales',
      carbohidratos: 'carbohidratos_totales',
      grasas: 'grasas_totales',
      azucares: 'azucares_totales',
      fibra: 'fibra_total',
      sodio: 'sodio_total'
    };

    // Verificación si el parámetro está permitido
    if (!parameterMapping.hasOwnProperty(parameter)) {
      console.log(`Parameter '${parameter}' not allowed for comparison`);
      return res.status(400).json({ error: `No se puede buscar por el parámetro '${parameter}'` });
    }

    // Mapeo del parámetro al nombre de columna correspondiente
    const dbParameter = parameterMapping[parameter];
    if (isNaN(value)) {
      console.log(`Value '${value}' is not a valid number`);
      return res.status(400).json({ error: `El valor '${trim(value)}' no es un número válido` });
    }
    const numericValue = parseFloat(trim(value));
    
    const recetas = await RecetasService.getRecetasByComparison(comparison, dbParameter, numericValue);

    if (!recetas || recetas.length === 0) {
      console.log(`No recetas found for ${comparison} ${parameter} ${value}`);
      return res.status(404).json({ error: 'No se encontraron recetas que coincidan con los criterios' });
    }

    console.log('Sending response with recetas:', recetas);
    res.json(recetas);
  } catch (error) {
    console.error(`Error fetching recipes with ${comparison} ${parameter} ${value}`, error);
    res.status(500).json({ error: error.message });
  }
};

// Crea una nueva receta
export const createRecetas = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const data = req.body; // Suponiendo que req.body puede ser un array o un objeto
    console.log("Valores que llegan en el JSON:", data);

    const recetasArray = Array.isArray(data) ? data : [data]; // Convertir a array si es un solo objeto
    const createdRecetas = [];
    const failedRecetas = [];

    for (const recetaData of recetasArray) {
      const {
        nombre,
        instrucciones_prep,
        tiempo_coccion,
        id_objetivo,
        ingredientes // Se espera que ingredientes sea un array de objetos con { id_ingrediente, cantidad }
      } = recetaData;

      try {
        // Verificar que haya al menos 3 ingredientes
        if (!ingredientes || ingredientes.length < 3) {
          failedRecetas.push({ nombre, error: "Debe tener al menos 3 ingredientes" });
          continue; // Saltar la creación si no hay suficientes ingredientes
        }

        // Calcula los totales basados en los ingredientes
        const totalesIngredientes = await calcularTotalesFromIngredientes(ingredientes);

        // Objeto con datos de receta para crear
        const newRecetaData = {
          nombre,
          instrucciones_prep,
          tiempo_coccion,
          id_objetivo,
          ...totalesIngredientes // Incluye los totales calculados en los datos de la receta
        };

        console.log(`Datos de receta a crear:`, newRecetaData);

        // Llamada al servicio para crear la receta
        const newReceta = await RecetasService.createReceta(newRecetaData, ingredientes, transaction);

        createdRecetas.push(newReceta);
      } catch (error) {
        console.error(`Error creando receta ${nombre}:`, error);
        failedRecetas.push({ nombre, error: error.message });
      }
    }

    // Confirmar la transacción si todo está correcto
    await transaction.commit();

    let responseMessage = {};

    if (failedRecetas.length > 0) {
      responseMessage.error = `Algunas recetas no se insertaron en la base de datos: ${failedRecetas.map(receta => receta.nombre).join(', ')}. Errores: ${failedRecetas.map(receta => receta.error).join('; ')}`;
    }

    if (createdRecetas.length > 0) {
      responseMessage.exito = `Estas recetas se crearon: ${createdRecetas.map(receta => receta.nombre).join(', ')}`;
    }

    if (failedRecetas.length > 0 && createdRecetas.length > 0) {
      res.status(207).json(responseMessage);
    } else if (failedRecetas.length > 0) {
      res.status(400).json(responseMessage);
    } else {
      res.json(responseMessage);
    }
  } catch (error) {
    // Revertir la transacción en caso de error
    await transaction.rollback();
    console.error('Error creando recetas:', error);
    res.status(500).json({ error: error.message });
  }
};

// Actualiza una receta
export const updateRecetaId = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const {
      nombre, instrucciones_prep, tiempo_coccion, id_objetivo, ingredientes
    } = req.body;
    
    console.log(`PUT /recetas/${id}`);
    console.log('Request body:', req.body);

    if (!/^\d+$/.test(trim(id))) {
      console.log('ID is not a number');
      return res.status(400).json({ error: 'El ID debe ser un número' });
    }

    // Calcula los totales basados en los ingredientes
    const { 
      calorias_totales,
      proteinas_totales,
      carbohidratos_totales,
      grasas_totales,
      azucares_totales,
      fibra_total,
      sodio_total
    } = await calcularTotalesFromIngredientes(ingredientes); // Asegúrate de esperar la función asíncrona aquí

    // Objeto con datos de receta para actualizar
    const recetaData = {
      nombre,
      instrucciones_prep,
      tiempo_coccion,
      id_objetivo,
      calorias_totales,
      proteinas_totales,
      carbohidratos_totales,
      grasas_totales,
      azucares_totales,
      fibra_total,
      sodio_total
    };

    // Llamada al servicio para actualizar la receta
    const updatedReceta = await RecetasService.updateRecetaId(trim(id), recetaData, ingredientes, transaction);

    if (!updatedReceta) {
      console.log(`Receta con ID: ${id} no encontrada`);
      return res.status(404).json({ error: 'Receta no encontrada' });
    }

    // Filtrar los ingredientes para incluir solo los enviados en la solicitud
    const ingredientesActualizados = updatedReceta.ingredientes.filter(ingrediente => {
      const found = ingredientes.find(item => item.id_ingrediente === ingrediente.id_ingrediente);
      return !!found;
    });

    // Construir la respuesta final con la receta actualizada y los ingredientes filtrados
    const response = {
      ...updatedReceta.toJSON(),
      ingredientes: ingredientesActualizados
    };

    // Confirmar la transacción si todo está correcto
    await transaction.commit();
    console.log('Receta actualizada:', response);
    res.json(response);
  } catch (error) {
    // Revertir la transacción en caso de error
    await transaction.rollback();
    console.error('Error actualizando receta:', error);
    res.status(500).json({ error: error.message });
  }
};

/* Actualizar receta por nombre -> Corregir, solo elimina en la base de datos de recetas_ingredientes pero no se me presenta el resultado en pantalla de la receta actualizada, además el nuevo nombre que le mando no se actualiza
export const updateRecetaNombre = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { nombre } = req.params; // Obtener el nombre de la receta desde los parámetros
    const {
      instrucciones_prep, tiempo_coccion, id_objetivo, ingredientes
    } = req.body;
    
    console.log(`PUT /recetas/${nombre}`);
    console.log('Request body:', req.body);

    // Calcula los totales basados en los ingredientes
    const { 
      calorias_totales,
      proteinas_totales,
      carbohidratos_totales,
      grasas_totales,
      azucares_totales,
      fibra_total,
      sodio_total
    } = await calcularTotalesFromIngredientes(ingredientes); // Asegúrate de esperar la función asíncrona aquí

    // Objeto con datos de receta para actualizar
    const recetaData = {
      nombre,
      instrucciones_prep,
      tiempo_coccion,
      id_objetivo,
      calorias_totales,
      proteinas_totales,
      carbohidratos_totales,
      grasas_totales,
      azucares_totales,
      fibra_total,
      sodio_total
    };

    // Llamada al servicio para actualizar la receta por nombre
    const updatedReceta = await RecetasService.updateRecetaNombre(nombre, recetaData, ingredientes, transaction);

    if (!updatedReceta) {
      console.log(`Receta con nombre: ${nombre} no encontrada`);
      return res.status(404).json({ error: 'Receta no encontrada' });
    }

    // Filtrar los ingredientes para incluir solo los enviados en la solicitud
    const ingredientesActualizados = updatedReceta.ingredientes.filter(ingrediente => {
      const found = ingredientes.find(item => item.id_ingrediente === ingrediente.id_ingrediente);
      return !!found;
    });

    // Construir la respuesta final con la receta actualizada y los ingredientes filtrados
    const response = {
      ...updatedReceta.toJSON(),
      ingredientes: ingredientesActualizados
    };

    // Confirmar la transacción si todo está correcto
    await transaction.commit();
    console.log('Receta actualizada:', response);
    res.json(response);
  } catch (error) {
    // Revertir la transacción en caso de error
    await transaction.rollback();
    console.error('Error actualizando receta por nombre:', error);
    res.status(500).json({ error: error.message });
  }
};*/

// Elimina una receta
export const deleteRecetaId = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    console.log(`DELETE /recetas/${id}`);

    if (!/^\d+$/.test(trim(id))) {
      console.log('ID is not a number');
      return res.status(400).json({ error: 'El ID debe ser un número' });
    }

    const deletedMessage = await RecetasService.deleteRecetaId(trim(id), transaction);

    await transaction.commit();
    console.log('Deleted recipe:', deletedMessage);
    res.json({ message: 'Receta eliminada' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting recipe:', error);
    res.status(500).json({ error: error.message });
  }
};

//export const deleteRecetaNombre = async (req, res) => {}