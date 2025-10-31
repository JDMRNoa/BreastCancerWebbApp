// ==============================================
// src/components/prediction/ProbabilityDistribution.jsx
// ==============================================
import React from 'react';
import { Activity, CheckCircle, AlertCircle } from 'lucide-react';

export const ProbabilityDistribution = ({ isDarkMode, result }) => {
  if (!result) return null;

  const isNoCancer = result.classification === 'NO CÁNCER';
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondaryClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className="space-y-4">
      {/* CLASIFICACIÓN */}
      <div className={`p-4 rounded-lg ${isNoCancer ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
        <div className="flex items-start">
          {isNoCancer ? (
            <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-0.5" />
          ) : (
            <AlertCircle className="w-6 h-6 text-red-600 mr-3 mt-0.5" />
          )}
          <div className="flex-1">
            <h3 className={`font-semibold text-lg ${isNoCancer ? 'text-green-900' : 'text-red-900'}`}>
              {result.classification}
            </h3>
            <p className={`text-sm mt-1 ${isNoCancer ? 'text-green-700' : 'text-red-700'}`}>
              Confianza: {result.confidence}%
            </p>
            <p className={`text-xs mt-2 ${isNoCancer ? 'text-green-600' : 'text-red-600'}`}>
              Score de predicción: {result.score.toFixed(4)}
            </p>
          </div>
        </div>
      </div>

      {/* DETALLES TÉCNICOS */}
      <div className={`p-4 rounded-lg border ${borderClass}`}>
        <h4 className={`text-sm font-medium ${textClass} mb-3 flex items-center`}>
          <Activity className="w-4 h-4 mr-2 text-pink-500" />
          Información del Modelo
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className={`text-xs ${textSecondaryClass}`}>Etiqueta predicha</span>
            <span className={`text-xs font-medium px-2 py-1 rounded ${isDarkMode ? 'bg-pink-900 text-pink-200' : 'bg-pink-100 text-pink-700'}`}>
              {result.label === 1 ? 'Positivo (1)' : 'Negativo (0)'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-xs ${textSecondaryClass}`}>Score (0-1)</span>
            <span className={`text-xs font-mono ${textClass}`}>
              {result.score.toFixed(4)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-xs ${textSecondaryClass}`}>Umbral de decisión</span>
            <span className={`text-xs font-mono ${textClass}`}>0.5000</span>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span className={textSecondaryClass}>Score visualizado</span>
            <span className={textClass}>{Math.round(result.score * 100)}%</span>
          </div>
          <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
            <div
              className={`h-2 rounded-full transition-all duration-500 ${result.label === 1 ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ width: `${result.score * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* RECOMENDACIÓN */}
      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'} border`}>
        <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-900'} mb-2`}>
          Recomendación
        </h4>
        <p className={`text-xs ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>
          {isNoCancer 
            ? 'El análisis histopatológico no muestra evidencia de células cancerígenas. Se recomienda seguimiento rutinario según protocolo médico.'
            : 'El análisis detectó posibles células cancerígenas. Este resultado requiere confirmación mediante análisis adicionales por un patólogo certificado.'}
        </p>
      </div>
    </div>
  );
};