// ==============================================
// src/components/shared/MedicalDisclaimer.jsx
// ==============================================
import React from 'react';
import { AlertCircle } from 'lucide-react';

export const MedicalDisclaimer = ({ isDarkMode }) => {
  const cardBgClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondaryClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`mt-8 ${cardBgClass} rounded-xl shadow-sm border ${borderClass} p-6`}>
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className={`text-sm font-semibold ${textClass} mb-1`}>
            Aviso Médico Importante
          </h3>
          <p className={`text-sm ${textSecondaryClass}`}>
            Esta herramienta utiliza inteligencia artificial entrenada en imágenes histopatológicas del dataset <strong>breast-histopathology-images</strong> como <strong>apoyo al diagnóstico patológico</strong>. 
            Los resultados deben ser validados por un patólogo certificado. El modelo realiza clasificación binaria (Cáncer/No Cáncer) en imágenes de tejido mamario. 
            No reemplaza la evaluación profesional ni el análisis histopatológico completo.
          </p>
        </div>
      </div>
    </div>
  );
};