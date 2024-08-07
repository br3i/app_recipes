import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../utils/comentario.css';
import { useModal } from '../context/ModalContext'; // Importa useModal

const API_URL = 'http://localhost:4000';

const DejarComentario = () => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [comentarios, setComentarios] = useState([]);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editMessage, setEditMessage] = useState('');
  const [currentComment, setCurrentComment] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Estado para controlar la pausa del carrusel
  const { showModal, hideModal } = useModal(); // Usa useModal

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataString = localStorage.getItem('usuario');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          if (userData && userData.usuario && userData.usuario.id_usuario) {
            const id = userData.usuario.id_usuario;
            const nombre = userData.usuario.nombre;
            setUserName(nombre);
            setUserId(id);
            await fetchComentarios(id);
            showModal(<div>Datos de usuario encontrados con éxito</div>, 3000);
          } else {
            console.error('No se encontró el ID de usuario válido en los datos almacenados.');
            showModal(<div>No se encontró el ID de usuario válido en los datos almacenados.</div>, 3000);
          }
        } else {
          console.error('No se encontraron datos de usuario en localStorage.');
          showModal(<div>No se encontraron datos de usuario en localStorage.</div>, 3000);
        }
      } catch (error) {
        console.error('Error al procesar los datos de usuario desde localStorage:', error);
        showModal(<div>Error al procesar los datos de usuario desde localStorage.</div>, 3000);
      }
    };

    fetchUserData();
  }, []);

  const fetchComentarios = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/comentarios/idU/${id}`);
      setComentarios(res.data.comentarios);
      if (res.data.length > 0) {
        setCurrentComment(res.data[0]); // Establecer el primer comentario como el comentario actual
      }
    } catch (error) {
      console.error('Error al obtener los comentarios:', error);
      showModal(<div>Error al obtener los comentarios.</div>, 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const comentario = {
        nombre: userName,
        descripcion: message,
      };

      const res = await axios.post(`${API_URL}/comentarios/${userId}`, comentario);
      setResponse(res.data.message); // Mensaje de éxito
      setMessage(''); // Limpiar el mensaje
      await fetchComentarios(userId); // Actualizar la lista de comentarios
      showModal(<div>{res.data.message}</div>, 3000);
    } catch (error) {
      console.error('Error al enviar el comentario:', error);
      const errorMessage = 'Error al enviar el comentario.';
      setResponse(errorMessage); // Manejar el error seteando un mensaje de error
      showModal(<div>{errorMessage}</div>, 3000);
    }
  };

  const handleEdit = (id, descripcion) => {
    setEditCommentId(id);
    setEditMessage(descripcion);
    setIsEditing(true); // Pausar el carrusel al iniciar la edición
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const comentario = {
        descripcion: editMessage,
        id_usuario: userId
      };

      const res = await axios.put(`${API_URL}/comentarios/id/${editCommentId}`, comentario);
      setResponse(res.data.message); // Mensaje de éxito
      setEditCommentId(null); // Limpiar el estado de edición
      setEditMessage(''); // Limpiar el mensaje de edición
      await fetchComentarios(userId); // Actualizar la lista de comentarios
      setIsEditing(false); // Reanudar el carrusel al finalizar la edición
      showModal(<div>{res.data.message}</div>, 3000);
    } catch (error) {
      console.error('Error al editar el comentario:', error);
      const errorMessage = 'Error al editar el comentario.';
      setResponse(errorMessage); // Manejar el error seteando un mensaje de error
      setIsEditing(false); // Reanudar el carrusel al finalizar la edición incluso en caso de error
      showModal(<div>{errorMessage}</div>, 3000);
    }
  };

  const handleCancelEdit = () => {
    setEditCommentId(null);
    setEditMessage('');
    setIsEditing(false);
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${API_URL}/comentarios/id/${id}`);
      setResponse(res.data.message); // Mensaje de éxito
      await fetchComentarios(userId); // Actualizar la lista de comentarios
      showModal(<div>{res.data.message}</div>, 3000);
    } catch (error) {
      console.error('Error al eliminar el comentario:', error);
      const errorMessage = 'Error al eliminar el comentario.';
      setResponse(errorMessage); // Manejar el error seteando un mensaje de error
      showModal(<div>{errorMessage}</div>, 3000);
    }
  };

  const handleSelect = (selectedIndex, e) => {
    setCurrentComment(comentarios[selectedIndex]);
  };

  return (
    <div>
      {userId && userName ? (
        <div className='border-buttons'>
          <div className="comentario-form-container">
            <h2>Deja tu comentario en este boletín</h2>
            <form className="form-comentario" onSubmit={handleSubmit}>
              <textarea
                placeholder="Ingrese su mensaje"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-success">Enviar</button>
            </form>
            {response && <div className="response-message">{response}</div>}
          </div>

          <div className="carousel-container">
            <Carousel 
              onSelect={handleSelect} 
              interval={isEditing ? null : 5000} // Pausar el carrusel si está en modo edición
            >
              {comentarios.map((comentario, index) => (
                <Carousel.Item key={comentario.id_comentario}>
                  <div className="comment-card">
                    {editCommentId === comentario.id_comentario ? (
                      <form onSubmit={handleEditSubmit}>
                        <textarea
                          id='textarea-edit'
                          value={editMessage}
                          onChange={(e) => setEditMessage(e.target.value)}
                          required
                        />
                        <br />
                        <div id='contenedor-buttons-editar'>
                          <button type="submit" className="btn btn-success">Guardar</button>
                          <button type="button" className="btn btn-danger" onClick={handleCancelEdit}>Cancelar</button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <h4>{comentario.nombre}</h4>
                        <p>{comentario.descripcion}</p>
                      </>
                    )}
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
            {!isEditing && (
              <div>
                <button
                  className="btn btn-success m-2"
                  onClick={() => handleEdit(currentComment?.id_comentario, currentComment?.descripcion)}
                  disabled={!currentComment}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger m-2"
                  onClick={() => handleDelete(currentComment?.id_comentario)}
                  disabled={!currentComment}
                >
                  Eliminar
                </button>
              </div>
            )}
          </div>
          <button className="carousel-button-comentario left" onClick={() => document.querySelector('.carousel-control-prev').click()}>&lt;</button>
          <button className="carousel-button-comentario right" onClick={() => document.querySelector('.carousel-control-next').click()}>&gt;</button>
        </div>
      ) : (
        <p>Cargando datos del usuario...</p>
      )}
    </div>
  );
};

export default DejarComentario;
