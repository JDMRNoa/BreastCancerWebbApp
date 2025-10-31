import React from 'react';
import { Github } from 'lucide-react';

const Footer = ({ isDarkMode }) => {
  const cardBgClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textSecondaryClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <footer className={`${cardBgClass} border-t ${borderClass} mt-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <p className={`text-sm ${textSecondaryClass} mb-4 sm:mb-0`}>
            © 2025 CancerVision AI. Desarrollado con TensorFlow y CNN.
          </p>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/JDMRNoa/Cancer_IA"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center text-sm ${textSecondaryClass} hover:text-blue-500 transition-colors`}
            >
              <Github className="w-4 h-4 mr-1" />
              GitHub
            </a>
            <span className={`text-sm ${textSecondaryClass}`}>|</span>
            <span className={`text-sm ${textSecondaryClass}`}>Versión 1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;