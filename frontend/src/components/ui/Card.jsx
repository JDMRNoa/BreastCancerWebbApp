import React from 'react';

export const Card = ({ isDarkMode, children, className = '' }) => {
  const cardBgClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  
  return (
    <div className={`${cardBgClass} rounded-xl shadow-sm border ${borderClass} p-6 ${className}`}>
      {children}
    </div>
  );
};