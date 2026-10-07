import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null); // ✅ Guardar todos los datos del usuario
  const navigate = useNavigate();
  const location = useLocation();

  // Cargar usuario de localStorage al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('usuario');
    const savedUserData = localStorage.getItem('userData');
    
    if (savedUser) {
      setUser(savedUser);
    }
    
    if (savedUserData) {
      try {
        setUserData(JSON.parse(savedUserData));
      } catch (e) {
        console.error('Error parsing userData:', e);
      }
    }
  }, []);

  // Guardar usuario cuando cambie
  useEffect(() => {
    if (user) {
      localStorage.setItem('usuario', user);
    } else {
      localStorage.removeItem('usuario');
    }
  }, [user]);

  // Guardar userData cuando cambie
  useEffect(() => {
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    } else {
      localStorage.removeItem('userData');
    }
  }, [userData]);

  // Protección de rutas
  useEffect(() => {
    const isAuthPage = location.pathname === '/AutoHub';
    const isHomePage = location.pathname === '/AutoHub/home';
    
    if (!user && !isAuthPage) {
      navigate('/AutoHub', { replace: true });
    } else if (user && isAuthPage) {
      navigate('/AutoHub/home', { replace: true });
    }
  }, [user, location.pathname, navigate]);

  const login = (username, nn = null) => {
    setUser(username);
    if (nn) {
      setUserData({ username, nn });
    } else {
      setUserData({ username });
    }
  };

  const logout = () => {
    setUser(null);
    setUserData(null);
    localStorage.removeItem('usuario');
    localStorage.removeItem('userData');
    navigate('/AutoHub', { replace: true });
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      userData, // ✅ Datos completos del usuario
      nn: userData?.nn, // ✅ Acceso directo al nn
      login, 
      logout 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe ser usado dentro de un UserProvider');
  }
  return context;
};