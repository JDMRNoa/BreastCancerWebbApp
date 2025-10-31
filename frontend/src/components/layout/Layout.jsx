import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Sidebar } from './Sidebar';

/**
 * Layout Component
 * 
 * Componente que envuelve la aplicación con Sidebar, Header y Footer
 * Maneja el tema global y proporciona la estructura base
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido principal de la aplicación
 * @param {boolean} props.isDarkMode - Estado del tema oscuro
 * @param {Function} props.onThemeToggle - Función para cambiar el tema
 * @param {string} props.currentPage - Página actual ('home', 'about', 'prediction')
 * @param {Function} props.onNavigate - Función para navegar entre páginas
 */
const Layout = ({ children, isDarkMode, onThemeToggle, currentPage, onNavigate }) => {
  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-300 relative`}>
      {/* Sidebar desplegable */}
      <div className="z-40">
        <Sidebar
          isDarkMode={isDarkMode}
          onThemeToggle={onThemeToggle}
          currentPage={currentPage}
          onNavigate={onNavigate}
        />
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col min-h-screen z-10 relative">
        {/* Header */}
        <Header isDarkMode={isDarkMode} onThemeToggle={onThemeToggle} />

        {/* Main */}
        <main className="flex-1 min-h-[calc(100vh-200px)]">
          {children}
        </main>

        {/* Footer */}
        <Footer isDarkMode={isDarkMode} />
      </div>
    </div>
  );
};

export default Layout;
