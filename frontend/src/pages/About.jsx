import React from 'react';
import { Brain, Target, Shield, Users } from 'lucide-react';

const Card = ({ children, isDarkMode }) => (
  <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
    {children}
  </div>
);

export const About = ({ isDarkMode }) => {
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondaryClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';

  const features = [
    {
      icon: Brain,
      title: 'Inteligencia Artificial Avanzada',
      description: 'Modelo de deep learning entrenado con miles de imágenes histopatológicas de tejido mamario del dataset breast-histopathology-images.'
    },
    {
      icon: Target,
      title: 'Alta Precisión',
      description: 'Clasificación binaria (Cáncer/No Cáncer) con visualización Grad-CAM para interpretabilidad de las predicciones del modelo.'
    },
    {
      icon: Shield,
      title: 'Apoyo al Diagnóstico',
      description: 'Herramienta diseñada para asistir a patólogos en el análisis de biopsias, no reemplaza el criterio médico profesional.'
    },
    {
      icon: Users,
      title: 'Validación Clínica',
      description: 'Los resultados deben ser validados por un patólogo certificado antes de tomar decisiones clínicas.'
    }
  ];

return (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    {/* Hero */}
    <div className="text-center space-y-4">
      <h1 className={`text-4xl font-bold ${textClass}`}>Sobre CancerVision AI</h1>
      <p className={`text-lg ${textSecondaryClass} max-w-3xl mx-auto`}>
        Sistema de apoyo al diagnóstico histopatológico de cáncer de mama utilizando
        inteligencia artificial y visualización explicable mediante Grad-CAM
      </p>
    </div>

    {/* Features Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {features.map((feature, index) => (
        <Card key={index} isDarkMode={isDarkMode}>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <feature.icon className="w-8 h-8 text-pink-500" />
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${textClass} mb-2`}>{feature.title}</h3>
              <p className={`text-sm ${textSecondaryClass}`}>{feature.description}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>

    {/* Important disclaimer */}
    <Card isDarkMode={isDarkMode}>
      <div className="text-center space-y-2">
        <h3 className={`text-xl font-bold ${textClass}`}>Importante</h3>
        <p className={`text-sm ${textSecondaryClass}`}>
          Esta herramienta es un prototipo de investigación y no debe utilizarse
          para tomar decisiones clínicas sin la supervisión de un profesional médico certificado.
        </p>
      </div>
    </Card>

    {/* Interleaved Sections */}
    <Card isDarkMode={isDarkMode}>
      <div className="text-center space-y-2">
        <h3 className={`text-xl font-bold ${textClass}`}>Construccion del modelo - Metricas </h3>
      </div>

      <div className="space-y-8">
        {/* Dataset: imagen izquierda, explicación derecha */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Visual (izq) */}
          <div className="order-1 md:order-1 flex justify-center">
            <div className={`border-2 ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-100'} rounded-lg p-4 w-full max-w-md`}>
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-pink-500">277,524</div>
                <div className={`text-xs ${textSecondaryClass}`}>Imágenes totales</div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-pink-500">20,000</div>
                  <div className={`text-xs ${textSecondaryClass}`}>Balanceadas</div>
                </div>
                <div className="text-2xl">→</div>
                <div>
                  <div className="text-sm font-semibold text-pink-500">Train / Val</div>
                  <div className={`text-xs ${textSecondaryClass}`}>16,000 / 4,000</div>
                </div>
              </div>
            </div>
          </div>

          {/* Texto (der) */}
          <div className="order-2 md:order-2">
            <h3 className={`text-lg font-semibold ${textClass} mb-2`}>Preparación del Dataset</h3>
            <p className={`text-sm ${textSecondaryClass} mb-2`}>
              Se utilizó el dataset <strong>breast-histopathology-images</strong> de Kaggle.
              Se balancearon 20,000 imágenes (10k cáncer + 10k no cáncer), redimensionadas a 96×96
              y normalizadas a rango [0-1]. División: 80% entrenamiento, 20% validación.
            </p>
            <ul className={`text-sm ${textSecondaryClass} ml-4 space-y-1`}>
              <li>• Balanceo: 20,000 imágenes (10k / 10k)</li>
              <li>• División: 16,000 train / 4,000 val</li>
              <li>• Preprocesamiento: resize 96×96, normalización</li>
            </ul>
          </div>
        </div>

        {/* Arquitectura: texto izquierda, visual derecha */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Texto (izq) */}
          <div className="order-1 md:order-1">
            <h3 className={`text-lg font-semibold ${textClass} mb-2`}>Arquitectura CNN</h3>
            <p className={`text-sm ${textSecondaryClass} mb-2`}>
              CNN secuencial con 3 capas convolucionales con stride=2 (sin MaxPooling explícito), 
              seguidas de aplanado y capas densas. Total: 4.8M parámetros entrenables.
            </p>
            <div className={`text-sm ${textSecondaryClass} ml-4 space-y-1`}>
              <div><strong>conv1:</strong> Conv2D(32, stride=2) → 96×96×32</div>
              <div><strong>conv2:</strong> Conv2D(64, stride=2) → 48×48×64</div>
              <div><strong>last_conv:</strong> Conv2D(128, stride=2) → 24×24×128</div>
              <div><strong>Clasificador:</strong> Flatten → Dense(256) → Dense(1, sigmoid)</div>
            </div>
          </div>

          {/* Visual (der) */}
          <div className="order-2 md:order-2 flex justify-center">
            <div className="overflow-x-auto pb-2">
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-16 h-16 border-2 ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-100'} rounded flex items-center justify-center`}>
                    <div className={`text-xs ${textSecondaryClass} text-center`}>96×96×3</div>
                  </div>
                  <div className={`text-xs ${textSecondaryClass} mt-1`}>Input</div>
                </div>

                <div className="text-lg">→</div>

                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-pink-500 rounded flex items-center justify-center text-white text-xs font-bold">32</div>
                  <div className={`text-xs ${textSecondaryClass} mt-1 text-center`}>conv1<br/>96×96×32</div>
                </div>

                <div className="text-lg">→</div>

                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded flex items-center justify-center text-white text-xs font-bold">64</div>
                  <div className={`text-xs ${textSecondaryClass} mt-1 text-center`}>conv2<br/>48×48×64</div>
                </div>

                <div className="text-lg">→</div>

                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-600 to-pink-700 rounded flex items-center justify-center text-white text-xs font-bold">128</div>
                  <div className={`text-xs ${textSecondaryClass} mt-1 text-center`}>last_conv<br/>24×24×128</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Entrenamiento: visual izquierda, texto derecha */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Visual (izq) */}
          <div className="order-1 md:order-1 flex justify-center">
            <div className={`border-2 ${isDarkMode ? 'border-gray-600 bg-gray-700/30' : 'border-gray-300 bg-gray-50'} rounded-lg p-4 w-full max-w-md`}>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="text-sm font-semibold text-pink-500">Optimizador</div>
                  <div className={`text-lg font-bold ${textClass}`}>Adam</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-pink-500">Épocas</div>
                  <div className={`text-lg font-bold ${textClass}`}>15</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-pink-500">Batch</div>
                  <div className={`text-lg font-bold ${textClass}`}>32</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-pink-500">Dropout</div>
                  <div className={`text-lg font-bold ${textClass}`}>No usado</div>
                </div>
              </div>
            </div>
          </div>

          {/* Texto (der) */}
          <div className="order-2 md:order-2">
            <h3 className={`text-lg font-semibold ${textClass} mb-2`}>Entrenamiento y Métricas</h3>
            <p className={`text-sm ${textSecondaryClass} mb-2`}>
              Optimizador Adam, pérdida Binary Crossentropy, 15 épocas con EarlyStopping (paciencia 5).
              Métricas clave: Accuracy y Recall. Ejemplo de resultados reales: Accuracy 84.6%, Recall cáncer 85.05%.
              Total de parámetros entrenables: 4.8M.
            </p>
            <div className="mt-3">
              <div className={`text-sm ${textSecondaryClass} mb-1`}>Accuracy (Precisión General)</div>
              <div className="relative h-3 bg-gray-300 rounded-full overflow-hidden mb-2">
                <div className="absolute h-full bg-gradient-to-r from-green-400 to-green-600" style={{width: '84.6%'}}></div>
              </div>
              <div className={`text-sm ${textSecondaryClass}`}>Recall cáncer: 85.05%</div>
            </div>
          </div>
        </div>

        {/* Matriz de confusión: texto izquierda, visual derecha */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Texto (izq) */}
          <div>
            <h3 className={`text-lg font-semibold ${textClass} mb-2`}>Matriz de Confusión</h3>
            <p className={`text-sm ${textSecondaryClass} mb-2`}>
              VP: 1655 — VN: 1729 — FP: 325 — FN: 291.
              La matriz muestra buenos resultados de sensibilidad y especificidad, pero los FN (291) requieren atención clínica.
            </p>
            <div className={`text-xs ${textSecondaryClass}`}>
              <p><strong>Verdaderos Positivos:</strong> 1655</p>
              <p><strong>Verdaderos Negativos:</strong> 1729</p>
              <p><strong>Falsos Positivos:</strong> 325</p>
              <p><strong>Falsos Negativos:</strong> 291</p>
            </div>
          </div>

          {/* Visual (der) */}
          <div className="flex justify-center">
            <div className={`border-2 ${isDarkMode ? 'border-gray-600 bg-gray-700/30' : 'border-gray-300 bg-gray-50'} rounded-lg p-4`}>
              <div className="flex">
                <div className="flex flex-col justify-center mr-2">
                  <div className={`text-xs font-semibold ${textClass} -rotate-90 w-16 text-center`}>Real</div>
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <div className={`text-xs ${textSecondaryClass} w-20 text-right pr-2`}>No Cáncer</div>
                    <div className="flex">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-l flex items-center justify-center text-white font-bold border border-gray-400">1729</div>
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-200 to-blue-300 rounded-r flex items-center justify-center text-gray-800 font-bold border border-gray-400">325</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className={`text-xs ${textSecondaryClass} w-20 text-right pr-2`}>Cáncer</div>
                    <div className="flex">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-200 to-blue-300 rounded-l flex items-center justify-center text-gray-800 font-bold border border-gray-400">291</div>
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-r flex items-center justify-center text-white font-bold border border-gray-400">1655</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grad-CAM: visual izquierda, breve texto derecha */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Visual (izq) */}
          <div className="flex justify-center">
            <div className={`border-2 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded p-2 text-center`}>
              <div className={`text-xs ${textSecondaryClass} mb-1`}>Imagen Original</div>
              <div className="w-28 h-28 bg-gradient-to-br from-purple-200 to-pink-200 rounded mb-3"></div>

              <div className={`text-xs ${textSecondaryClass} mb-1`}>Grad-CAM</div>
              <div className="w-28 h-28 bg-gradient-to-br from-blue-400 via-yellow-400 to-red-500 rounded mb-3"></div>

              <div className={`text-xs ${textSecondaryClass} mb-1`}>Superposición</div>
              <div className="w-28 h-28 bg-gradient-to-br from-purple-300 via-pink-400 to-red-400 rounded"></div>
            </div>
          </div>

          {/* Texto (der) */}
          <div>
            <h3 className={`text-lg font-semibold ${textClass} mb-2`}>Visualización Grad-CAM</h3>
            <p className={`text-sm ${textSecondaryClass}`}>
              Grad-CAM resalta regiones de la imagen que influyen en la predicción — rojo/amarillo indican alta activación (posible área sospechosa).
            </p>
            <div className="mt-3 text-sm">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-yellow-400 rounded"></div>
                <span className={`${textSecondaryClass}`}>Alta activación</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-400 rounded"></div>
                <span className={`${textSecondaryClass}`}>Baja activación</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
);

};

// Demo wrapper
export default function App() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="p-4">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="mb-4 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
        >
          Toggle Dark Mode
        </button>
      </div>
      <About isDarkMode={isDarkMode} />
    </div>
  );
}