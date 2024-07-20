import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../utils/menu.css'; // Importa tus estilos CSS aquí
import logo from '../components/public/logo.png';
import ProfileForm from './ProfileComponent'; // Asegúrate de tener este componente
import IngredientesComponent from './IngredientesComponent';
import RecetasComponent from './RecetasComponent';
import ManagementUserComponent from './ManagementUserComponent'
import Bot_Recomendaciones from './Bot_Recomendaciones'
import DejarComentario from './DejarComentario'

const MenuComponent = () => {
  const [activePage, setActivePage] = useState('home'); // Estado para manejar la página act
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    // Función para obtener y procesar los datos del usuario desde localStorage
    const fetchUserData = async () => {
      try {
        const userDataString = localStorage.getItem('usuario');
        console.log('Datos en localStorage:', userDataString);

        if (userDataString) {
          const userData = JSON.parse(userDataString);
          if (userData && userData.usuario && userData.usuario.id_usuario) {
            const tipo_usuario = userData.usuario.tipo_usuario;
            console.log(`Valor en el tipo de usuario: ${tipo_usuario}`)
            setTipoUsuario(tipo_usuario);
          } else {
            console.error('No se encontró el ID de usuario válido en los datos almacenados.');
          }
        } else {
          console.error('No se encontraron datos de usuario en localStorage.');
        }
      } catch (error) {
        console.error('Error al procesar los datos de usuario desde localStorage:', error);
      }
    };

    fetchUserData();
  }, []); // Ejecutar solo una vez al montar el componente

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Actualizamos el estado formData
    setFormData({ ...formData, [name]: value });
    console.log("Nuevos Datos: ", formData);
  };

  

  const handleNavigation = (page) => {
    setActivePage(page);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="menu-container">
      <header className="header">
        <a href="/" className="logo">
          <img src={logo} alt="Logo" />
        </a>
        <nav className="navbar">
          <a href="#!" onClick={() => handleNavigation('profile')}>Perfil</a>
          {tipoUsuario === 'admin' && (
            <>
              <a href="#!" onClick={() => handleNavigation('manage-usuarios')}>Administrar Usuarios</a>
              <a href="#!" onClick={() => handleNavigation('manage-ingredientes')}>Ingredientes Disponibles</a>
              <a href="#!" onClick={() => handleNavigation('manage-recetas')}>Recetas Disponibles</a>
            </>
          )}
          {tipoUsuario === 'cliente' && (
            <>
              <a href="#!" onClick={() => handleNavigation('bot-recomendaciones')}>Recomendaciones</a>
              <a href="#!" onClick={() => handleNavigation('comentarios-cliente')}>Comentarios</a>
            </>
          )}
        </nav>
        
        <button className="logout-button" type="button" onClick={handleLogout}>Cerrar sesión</button>
      </header>
      <div className="image-side image-left"></div> {/* Imagen izquierda */}
      <br />
      <main className="content">
        {activePage === 'profile' && <ProfileForm />}
        {activePage === 'manage-usuarios' && < ManagementUserComponent/>}
        {activePage === 'manage-ingredientes' && <IngredientesComponent />}
        {activePage === 'manage-recetas' && <RecetasComponent />}
        {activePage === 'bot-recomendaciones' && <Bot_Recomendaciones />}
        {activePage === 'comentarios-cliente' && <DejarComentario />}
        {activePage === 'home' && (
          <main className="content">
            <div>
              <h2>Bienvenido a nuestra aplicación de gestión de ingredientes y recetas</h2>
              <p>
                Aquí podrás administrar tus ingredientes, explorar nuevas recetas y mantener tu perfil actualizado.
              </p>
              <h3>¿Cómo empezar?</h3>
              <p>
                Utiliza el menú superior para navegar entre las diferentes secciones:
                <ul>
                  <li><strong>Perfil:</strong> Actualiza tu información personal.</li>
                  <li><strong>Ingredientes Disponibles:</strong> Explora los ingredientes disponibles.</li>
                  <li><strong>Recetas Disponibles:</strong> Descubre nuevas recetas para preparar.</li>
                </ul>
              </p>
              <h3>Características Principales</h3>
              <p>
                - Gestiona tus ingredientes y recetas de manera eficiente.<br />
                - Personaliza tu perfil según tus preferencias.<br />
                - Encuentra nuevas ideas culinarias con nuestras recetas recomendadas.
              </p>
              <p>
                ¡Explora y disfruta de todo lo que nuestra aplicación tiene para ofrecer! No olvides iniciar sesión para acceder a todas las funciones disponibles.
              </p>
            </div>
          </main>
          
        )}
      </main>
      <div className="image-side image-right"></div> {/* Imagen derecha */}
    </div>
    
  );
};

export default MenuComponent;
