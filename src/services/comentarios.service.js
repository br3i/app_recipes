import { Comentarios } from "../models/comentarios.js";

class ComentariosService {
  async getAllComentarios() {
    console.log('Fetching all comments...');
    const comentarios = await Comentarios.findAll();
    console.log('Fetched comments:', comentarios);
    return comentarios;
  }

  async getComentarioById(id) {
    console.log(`Fetching comment with ID: ${id}`);
    const comentario = await Comentarios.findByPk(id);
    if (!comentario) {
      console.log(`Comment with ID: ${id} not found`);
    } else {
      console.log('Fetched comment:', comentario);
    }
    return comentario;
  }

  async createComentario(comentarioData) {
    console.log('Creating new comment with data:', comentarioData);
    const newComentario = await Comentarios.create(comentarioData);
    console.log('Created comment:', newComentario);
    return newComentario;
  }

  async updateComentario(id, comentarioData) {
    console.log(`Updating comment with ID: ${id}`);
    const comentario = await Comentarios.findByPk(id);
    if (!comentario) {
      throw new Error('Comentario not found');
    }
    console.log('Comment found:', comentario);
    const updatedComentario = await comentario.update(comentarioData);
    console.log('Updated comment:', updatedComentario);
    return updatedComentario;
  }

  async deleteComentario(id) {
    console.log(`Deleting comment with ID: ${id}`);
    const comentario = await Comentarios.findByPk(id);
    if (!comentario) {
      throw new Error('Comentario not found');
    }
    console.log('Comment found:', comentario);
    await comentario.destroy();
    console.log(`Comment with ID: ${id} deleted`);
    return { message: 'Comentario eliminado' };
  }
}

export default new ComentariosService();
