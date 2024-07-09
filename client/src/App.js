import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './utils/App.css';
import './utils/login.css';
import LoginComponent from './pages/LoginComponent';
import MenuComponent from './pages/MenuComponent';
import ManagementUserComponent from './pages/ManagementUserComponent';
import ProfileComponent from './pages/ProfileComponent';
import EquiposComponent from './pages/EquiposComponent';
import ReservationComponent from './pages/ReservasComponent';
import EspaciosComponent from './pages/EspaciosComponent';
import LaboratorioComponent from './pages/LaboratorioComponent';
import EquipmentSpacesComponent from './pages/EquipmentSpacesComponent';
import PasswordResetComponent from './pages/PasswordResetComponent';
import HomePage from './pages/HomePage';
import AboutUs from './pages/AboutUs';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RegisterClient from './pages/RegisterClient';


const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path='/' element={<HomePage />} />
          <Route path='/about' element={<AboutUs />} />
          <Route path='/login' element={<LoginComponent />} />
          <Route path="/crear-cuenta" element={<RegisterClient />} />
          <Route path='/password-reset' element={<PasswordResetComponent />} />
          // Agregar la ruta en el componente App
          <Route path='/register-client' element={<RegisterClient />} />
          {/* Rutas protegidas */}
          <Route path='/menu/*' element={<ProtectedRoute element={MenuComponent} />} />
          <Route path='/management-user' element={<ProtectedRoute element={ManagementUserComponent} />} />
          <Route path='/profile' element={<ProtectedRoute element={ProfileComponent} />} />
          <Route path='/equipos' element={<ProtectedRoute element={EquiposComponent} />} />
          <Route path='/reservaciones' element={<ProtectedRoute element={ReservationComponent} />} />
          <Route path='/espacios' element={<ProtectedRoute element={EspaciosComponent} />} />
          <Route path='/laboratorios' element={<ProtectedRoute element={LaboratorioComponent} />} />
          <Route path='/equipment-spaces' element={<ProtectedRoute element={EquipmentSpacesComponent} />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
