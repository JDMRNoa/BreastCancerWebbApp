import React from 'react';
import { Activity, Upload, Eye } from 'lucide-react';
import { Card } from '../components/ui/Card';

export const Home = ({ isDarkMode, onNavigate }) => {
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondaryClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';

  const steps = [
    {
      icon: Upload,
      title: 'Cargar Imagen',
      description: 'Sube una imagen histopatológica de tejido mamario en formato JPG o PNG'
    },
    {
      icon: Activity,
      title: 'Análisis Automático',
      description: 'El modelo de IA analiza la imagen y genera una predicción con nivel de confianza'
    },
    {
      icon: Eye,
      title: 'Visualización Grad-CAM',
      description: 'Observa qué áreas del tejido influyeron en la decisión del modelo'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className={`text-5xl font-bold ${textClass}`}>
          CancerVision AI
        </h1>
        <p className={`text-xl ${textSecondaryClass} max-w-3xl mx-auto`}>
          Sistema inteligente de apoyo al diagnóstico histopatológico de cáncer de mama
        </p>
      </div>



      {/* How it Works */}
      <div className="space-y-6">
        <h2 className={`text-3xl font-bold ${textClass} text-center`}>
          ¿Cómo Funciona?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <Card key={index} isDarkMode={isDarkMode}>
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className={`text-lg font-semibold ${textClass}`}>
                  {step.title}
                </h3>
                <p className={`text-sm ${textSecondaryClass}`}>
                  {step.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <Card isDarkMode={isDarkMode}>
        <div className="text-center space-y-4">
          <h2 className={`text-2xl font-bold ${textClass}`}>
            Listo para Empezar
          </h2>
          <p className={`text-sm ${textSecondaryClass}`}>
            Comienza a analizar imágenes histopatológicas con inteligencia artificial
          </p>
          <button
            onClick={() => onNavigate('prediction')}
            className="px-6 py-2 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition-colors"
          >
            Ir al Análisis
          </button>
        </div>
      </Card>
    </div>
  );
};
