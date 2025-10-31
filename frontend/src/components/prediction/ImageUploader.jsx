// ==============================================
// src/components/prediction/ImageUploader.jsx
// ==============================================
import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

export const ImageUploader = ({ isDarkMode, onImageSelect }) => {
  const fileInputRef = useRef(null);
  
  const cardBgClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondaryClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  };

  return (
    <div className={`${cardBgClass} rounded-xl shadow-sm border ${borderClass} p-6`}>
      <h2 className={`text-lg font-semibold ${textClass} mb-4 flex items-center`}>
        <Upload className="w-5 h-5 mr-2 text-pink-500" />
        Cargar Imagen Histopatológica
      </h2>
      
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={`border-2 border-dashed ${borderClass} rounded-lg p-8 text-center transition-all hover:border-pink-400 ${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-pink-50'} cursor-pointer`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <Upload className={`w-12 h-12 mx-auto mb-4 ${textSecondaryClass}`} />
        <p className={`text-base font-medium ${textClass} mb-2`}>
          Arrastra una imagen o haz clic para seleccionar
        </p>
        <p className={`text-xs ${textSecondaryClass} mt-1`}>
          Formatos soportados: JPG, PNG (Máx. 10MB)
        </p>
        <p className={`text-xs ${textSecondaryClass} mt-2 italic`}>
          Imágenes histopatológicas de tejido mamario (40x, 100x, 200x, 400x)
        </p>
      </div>
    </div>
  );
};