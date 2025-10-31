// ==============================================
// src/components/prediction/ResultsPanel.jsx
// ==============================================
import React from 'react';
import { Eye, AlertCircle } from 'lucide-react';
import { AttentionAreas } from './AttentionAreas';
import { ProbabilityDistribution } from './ProbabilityDistribution';
import LoadingSpinner from '../shared/LoadingSpinner';

export const ResultsPanel = ({ 
  isDarkMode, 
  uploadedImage, 
  isAnalyzing, 
  result, 
  images,
  showHeatmap,
  viewMode,
  error,
  onToggleHeatmap,
  onViewModeChange
}) => {
  const cardBgClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondaryClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  const getCurrentImage = () => {
    if (!images) return uploadedImage;
    if (!showHeatmap) return images.original;
    
    switch (viewMode) {
      case 'original': return images.original;
      case 'heatmap': return images.heatmap;
      case 'superimposed': return images.superimposed;
      default: return images.superimposed;
    }
  };

  if (!uploadedImage && !isAnalyzing && !result) return null;

  return (
    <div className={`${cardBgClass} rounded-xl shadow-sm border ${borderClass} p-6`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-lg font-semibold ${textClass}`}>
          Resultado del Análisis
        </h2>
        
        {result && (
          <button
            onClick={onToggleHeatmap}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              showHeatmap 
                ? 'bg-pink-500 text-white' 
                : `${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`
            }`}
          >
            <Eye className="w-4 h-4 inline mr-1" />
            {showHeatmap ? 'Grad-CAM ON' : 'Grad-CAM OFF'}
          </button>
        )}
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800 whitespace-pre-line">
            <AlertCircle className="w-4 h-4 inline mr-2" />
            {error}
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AttentionAreas 
          isDarkMode={isDarkMode}
          currentImage={getCurrentImage()}
          result={result}
          showHeatmap={showHeatmap}
          images={images}
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
        />
        
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center h-64">
            <LoadingSpinner />
            <p className={`text-sm ${textSecondaryClass} mt-4`}>
              Analizando imagen histopatológica...
            </p>
            <p className={`text-xs ${textSecondaryClass} mt-2`}>
              Generando mapa Grad-CAM
            </p>
          </div>
        ) : (
          <ProbabilityDistribution isDarkMode={isDarkMode} result={result} />
        )}
      </div>
    </div>
  );
};