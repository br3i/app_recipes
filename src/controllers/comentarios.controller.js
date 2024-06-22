import ComentariosService from '../services/comentarios.service.js'; // Asegúrate de tener la ruta correcta hacia tu servicio

// Obtiene todos los Comentarios
export const getComentarios = async (req, res) => {
  try {
    console.log('GET /comentarios');
    const comentarios = await ComentariosService.getAllComentarios();
    console.log('Sending response with comments:', comentarios)
    res.json(comentarios);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtiene un comentario por Id de comentario
export const getComentarioId = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`GET /comentarios/${id}`);
        const comentario = await ComentariosService.getComentarioById(id);

        if (!comentario) {
          console.log(`Comment with ID: ${id} not found`);
          return res.status(404).json({ error: 'Comentario no encontrado' });
        }
        console.log('Sending response with comment:', comentario);
        res.json(comentario);
    } catch (error) {
      console.error(`Error fetching comment with ID: ${id}`, error);
        res.status(500).json({ error: error.message });
    }
}

// Obtiene comentarios por ID de usuario
export const getComentariosIdUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`GET /comentarios/usuario/${id}`);
        const comentarios = await ComentariosService.getComentariosIdUsuario(id);
        console.log('Sending response with comments:', comentarios);
        res.json(comentarios);
    } catch (error) {
        console.error(`Error fetching comments for user ID: ${id}`, error);
        res.status(500).json({ error: error.message });
    }
}

// Crea un comentario
export const createComentario = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    console.log(`POST /comentarios/${id}`);
    console.log('Request body:', req.body);

    const newComentario = await ComentariosService.createComentario({
      id_usuario: id,
      nombre: nombre,
      descripcion: descripcion,
    }, transaction);

    await transaction.commit();
    console.log('Created comment:', newComentario);
    res.json(newComentario);
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating comment:', error);
    res.status(500).json({ error: error.message });
  }
};

// Actualiza un comentario
export const updateComentario = async (req, res) => {
    const transaction = await sequelize.transaction();
    try{
        const { id } = req.params;
        const comentarioData = req.body;

        const updatedComentario = await ComentariosService.updateComentario(id, comentarioData, transaction);

        if (!updatedComentario) {
            return res.status(404).json({ error: "Comentario no encontrado" });
        }

        await transaction.commit();
        res.json(updatedComentario);
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ error: error.message });
    }
}

// Elimina un comentario por id_comentario
export const deleteComentario = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;

    const deletedMessage = await ComentariosService.deleteComentario(id, transaction);

    await transaction.commit();
    res.json(deletedMessage);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

// Elimina comentarios por id_usuario
export const deleteComentariosIdUsuario = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;

    const deletedMessage = await ComentariosService.deleteComentariosIdUsuario(id, transaction);

    await transaction.commit();
    res.json(deletedMessage);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};
