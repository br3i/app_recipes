import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './utils/App.css';
import './utils/login.css';
import LoginComponent from './pages/LoginComponent';
import MenuComponent from './pages/MenuComponent';
import Menu2 from './pages/Menu2';  // Importar MenuClient
import ManagementUserComponent from './pages/ManagementUserComponent';
import ProfileComponent from './pages/ProfileComponent';
import PasswordResetComponent from './pages/PasswordResetComponent';
import HomePage from './pages/HomePage';
import AboutUs from './pages/AboutUs';
import { AuthProvider } from './context/AuthContext';
import { PageProvider } from './context/PageContext';
import ProtectedRoute from './components/ProtectedRoute';
import RegisterClient from './pages/RegisterClient';
import ServerStatus from './pages/ServerStatus.jsx';  // Importar el componente ServerStatus

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <PageProvider>
          <ServerStatus />
          <Routes>
            {/* Rutas públicas */}
            <Route path='/' element={<HomePage />} />
            <Route path='/about' element={<AboutUs />} />
            <Route path='/login' element={<LoginComponent />} />
            <Route path="/crear-cuenta" element={<RegisterClient />} />
            <Route path='/password-reset' element={<PasswordResetComponent />} />
            <Route path='/register-client' element={<RegisterClient />} />
            {/* Rutas protegidas */}
            <Route path='/menu/*' element={<ProtectedRoute element={MenuComponent} />} />
            <Route path='/----/*' element={<ProtectedRoute element={Menu2} />} /> {/* Añadir ruta para MenuClient */}
            <Route path='/management-user' element={<ProtectedRoute element={ManagementUserComponent} />} />
            <Route path='/profile' element={<ProtectedRoute element={ProfileComponent} />} />        
          </Routes>
        </PageProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
