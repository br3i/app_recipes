import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../utils/menu.css'; // Importa tus estilos CSS aquí
import logo from '../components/public/logo.png';
import ProfileForm from './ProfileComponent'; // Asegúrate de tener este componente
import IngredientesComponent from './IngredientesComponent';
import RecetasComponent from './RecetasComponent';
import ManagementUserComponent from './ManagementUserComponent'

const MenuComponent = () => {
  const [activePage, setActivePage] = useState('home'); // Estado para manejar la página activa
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigation = (page) => {
    setActivePage(page);
  };

  return (
    <div className="menu-container">
      <header className="header">
        <a href="/" className="logo">
          <img src={logo} alt="Logo" />
        </a>
        <nav className="navbar">
          <a href="#!" onClick={() => handleNavigation('manageUsers')}>Manage Users</a>
          <a href="#!" onClick={() => handleNavigation('profile')}>Perfil</a>
          <a href="#!" onClick={() => handleNavigation('ingredientes')}>Ingredientes Disponibles</a>
          <a href="#!" onClick={() => handleNavigation('recetas')}>Recetas Disponibles</a>
        </nav>
        
        <button className="logout-button" type="button" onClick={handleLogout}>Cerrar sesión</button>
      </header>
      <br />
      <main className="content">
        {activePage === 'profile' && <ProfileForm />}
        {activePage === 'manageUsers' && < ManagementUserComponent/>}
        {activePage === 'ingredientes' && <IngredientesComponent />}
        {activePage === 'recetas' && <RecetasComponent />}
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
    </div>
  );
};

export default MenuComponent;
