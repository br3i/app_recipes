import React from 'react';
import { usePage } from '../context/PageContext';
import ProfileForm from './ProfileComponent';
import IngredientesComponent from './IngredientesComponent';
import RecetasComponent from './RecetasComponent';
import ManagementUserComponent from './ManagementUserComponent';
import BotRecomendaciones from './BotRecomendaciones';
import DejarComentario from './DejarComentario';
import '../utils/menu.css';

const Paginas = () => {
  const { activePage } = usePage();

  return (
    <main className="content">
      {activePage === 'profile' && <ProfileForm />}
      {activePage === 'manage-usuarios' && <ManagementUserComponent />}
      {activePage === 'manage-ingredientes' && <IngredientesComponent />}
      {activePage === 'manage-recetas' && <RecetasComponent />}
      {activePage === 'bot-recomendaciones' && <BotRecomendaciones />}
      {activePage === 'comentarios-cliente' && <DejarComentario />}
      {activePage === 'home' && (
        <div className='menu-pagina-principal'>
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
      )}
    </main>
  );
};

export default Paginas;
