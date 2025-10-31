// ==============================================
// src/components/layout/Sidebar.jsx
// ==============================================
import React, { useState } from 'react';
import { Home, Activity, Info, X, Menu, Moon, Sun } from 'lucide-react';

export const Sidebar = ({ isDarkMode, onThemeToggle, currentPage, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondaryClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const bgClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const hoverClass = isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50';

  const navItems = [
    { id: 'home', label: 'Inicio', icon: Home, description: 'Página principal' },
    { id: 'prediction', label: 'Análisis', icon: Activity, description: 'Analizar imágenes' },
    { id: 'about', label: 'Acerca de', icon: Info, description: 'Información del sistema' }
  ];

  const handleNavigate = (pageId) => {
    onNavigate(pageId);
    setIsOpen(false); // Cerrar sidebar al navegar
  };

  return (
    <>
      {/* Botón hamburguesa (siempre visible) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 left-4 z-50 p-3 rounded-lg ${bgClass} border ${borderClass} shadow-lg ${hoverClass} transition-all`}
        aria-label="Menú"
      >
        {isOpen ? (
          <X className={`w-6 h-6 ${textClass}`} />
        ) : (
          <Menu className={`w-6 h-6 ${textClass}`} />
        )}
      </button>

      {/* Overlay (fondo oscuro cuando está abierto) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 ${bgClass} border-r ${borderClass} z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-2xl`}
      >
        <div className="flex flex-col h-full">
          
          {/* Header del Sidebar */}
          <div className={`p-6 border-b ${borderClass}`}>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${textClass}`}>CancerVision AI</h2>
                <p className={`text-xs ${textSecondaryClass}`}>Sistema de Diagnóstico</p>
              </div>
            </div>
          </div>

          {/* Navegación */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full flex items-start space-x-4 p-4 rounded-xl transition-all ${
                    isActive
                      ? 'bg-pink-500 text-white shadow-lg scale-105'
                      : `${textClass} ${hoverClass}`
                  }`}
                >
                  <item.icon className={`w-6 h-6 flex-shrink-0 ${isActive ? 'text-white' : 'text-pink-500'}`} />
                  <div className="text-left">
                    <p className={`font-semibold ${isActive ? 'text-white' : textClass}`}>
                      {item.label}
                    </p>
                    <p className={`text-xs ${isActive ? 'text-pink-100' : textSecondaryClass}`}>
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Footer del Sidebar (Tema + Info) */}
          <div className={`p-4 border-t ${borderClass} space-y-3`}>
            
            {/* Botón de tema */}
            <button
              onClick={onThemeToggle}
              className={`w-full flex items-center justify-between p-3 rounded-lg ${hoverClass} transition-colors`}
            >
              <div className="flex items-center space-x-3">
                {isDarkMode ? (
                  <>
                    <Sun className="w-5 h-5 text-yellow-400" />
                    <span className={`text-sm font-medium ${textClass}`}>Tema Claro</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-5 h-5 text-gray-600" />
                    <span className={`text-sm font-medium ${textClass}`}>Tema Oscuro</span>
                  </>
                )}
              </div>
              <div className={`w-12 h-6 rounded-full ${isDarkMode ? 'bg-pink-500' : 'bg-gray-300'} relative transition-colors`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-7' : 'translate-x-1'}`} />
              </div>
            </button>

            {/* Versión */}
            <div className={`text-center text-xs ${textSecondaryClass} pt-2`}>
              <p>v1.0.0 - 2025</p>
              <p className="mt-1">Sistema de apoyo médico</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};