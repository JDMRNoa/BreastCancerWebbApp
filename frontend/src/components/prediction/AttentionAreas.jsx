// ==============================================
// src/components/prediction/AttentionAreas.jsx
// ==============================================
import React from 'react';
import { Layers } from 'lucide-react';

export const AttentionAreas = ({ 
  isDarkMode,
  currentImage, 
  result, 
  showHeatmap, 
  images,
  viewMode,
  onViewModeChange 
}) => {
  const textSecondaryClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className={`text-sm font-medium ${textSecondaryClass}`}>
          {showHeatmap && result && images ? (
            viewMode === 'original' ? 'Imagen Original' :
            viewMode === 'heatmap' ? 'Mapa de Atención Grad-CAM' :
            'Superposición Grad-CAM'
          ) : 'Imagen Original'}
        </h3>
        {result && showHeatmap && images && (
          <Layers className="w-4 h-4 text-pink-500" />
        )}
      </div>
      
      <div className="relative">
        {currentImage && (
          <img
            src={currentImage}
            alt="Análisis"
            className="w-full h-64 object-cover rounded-lg border border-gray-200"
          />
        )}
      </div>

      {result && showHeatmap && images && (
        <>
          <div className="flex gap-2">
            {['original', 'heatmap', 'superimposed'].map((mode) => (
              <button
                key={mode}
                onClick={() => onViewModeChange(mode)}
                className={`flex-1 px-3 py-2 text-xs font-medium rounded transition-colors ${
                  viewMode === mode
                    ? 'bg-pink-500 text-white'
                    : `${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`
                }`}
              >
                {mode === 'original' ? 'Original' : mode === 'heatmap' ? 'Heatmap' : 'Superpuesta'}
              </button>
            ))}
          </div>
          
          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-pink-50'} border ${isDarkMode ? 'border-gray-600' : 'border-pink-200'}`}>
            <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-pink-900'} leading-relaxed`}>
              🔍 <strong>Interpretación Grad-CAM:</strong> Las áreas en rojo/amarillo representan las regiones del tejido que la red neuronal convolucional consideró más relevantes para la clasificación.
            </p>
          </div>
        </>
      )}
    </div>
  );
};
