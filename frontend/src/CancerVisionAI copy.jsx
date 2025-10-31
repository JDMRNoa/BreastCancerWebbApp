import React, { useState, useRef } from 'react';
import { Upload, Activity, History, AlertCircle, CheckCircle, Eye, Layers, Loader } from 'lucide-react';

const CancerVisionAI = ({ isDarkMode }) => {
  // ==============================================
  // ESTADOS DE LA APLICACIÓN
  // ==============================================
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [images, setImages] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [viewMode, setViewMode] = useState('superimposed'); // 'original', 'heatmap', 'superimposed'
  const [error, setError] = useState(null);
  
  const fileInputRef = useRef(null);
  const currentFileRef = useRef(null);
  
  // ==============================================
  // HISTORIAL DE ANÁLISIS
  // ==============================================
  const [history, setHistory] = useState([
    { id: 1, type: 'Histopatología', result: 'NO CÁNCER', confidence: 94, date: '2025-10-22' },
    { id: 2, type: 'Histopatología', result: 'CÁNCER', confidence: 87, date: '2025-10-21' }
  ]);

  // ==============================================
  // CONFIGURACIÓN DEL BACKEND
  // ==============================================
  const API_URL = 'http://localhost:5000'; // Backend Flask

  // ==============================================
  // FUNCIÓN: LLAMAR AL BACKEND PARA ANÁLISIS
  // ==============================================
  const analyzeImage = async (file) => {
    setIsAnalyzing(true);
    setResult(null);
    setImages(null);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      console.log('Enviando petición a:', `${API_URL}/analyze`);
      
      // 1. Hacer predicción
      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        body: formData,
      });
      
      console.log('Respuesta recibida:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error del servidor (${response.status}): ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Datos recibidos:', data);
      
      if (!data.success) {
        throw new Error(data.message || 'Error en el análisis');
      }
      
      // El backend retorna score (0-1), convertimos a porcentaje
      const confidencePercent = Math.round(data.confidence * 100);
      
      // Guardar resultados
      setResult({
        score: data.score,
        classification: data.classification,
        confidence: confidencePercent,
        label: data.label
      });
      
      // 2. Generar Grad-CAM (nueva petición)
      console.log('Generando Grad-CAM...');
      const gradcamFormData = new FormData();
      gradcamFormData.append('file', file);
      
      const gradcamResponse = await fetch(`${API_URL}/gradcam`, {
        method: 'POST',
        body: gradcamFormData,
      });
      
      if (gradcamResponse.ok) {
        const gradcamData = await gradcamResponse.json();
        
        if (gradcamData.success) {
          // Convertir base64 a data URL para mostrar en el navegador
          setImages({
            original: `data:image/png;base64,${gradcamData.original_base64}`,
            heatmap: `data:image/png;base64,${gradcamData.heatmap_base64}`,
            superimposed: `data:image/png;base64,${gradcamData.superimposed_base64}`
          });
          
          console.log('Grad-CAM generado correctamente con 3 vistas');
        }
      } else {
        console.warn('No se pudo generar Grad-CAM, continuando sin visualización');
      }
      
      // Actualizar historial
      setHistory(prev => [{
        id: prev.length + 1,
        type: 'Histopatología',
        result: data.classification,
        confidence: confidencePercent,
        date: new Date().toISOString().split('T')[0],
      }, ...prev.slice(0, 4)]);
      
    } catch (err) {
      const errorMessage = err.message || 'Error al analizar la imagen';
      setError(errorMessage);
      console.error('Error completo:', err);
      
      // Ayuda específica según el tipo de error
      if (errorMessage.includes('Failed to fetch')) {
        setError('❌ No se puede conectar al backend. Verifica que:\n1. El servidor Flask esté corriendo (python main.py)\n2. El puerto 5000 esté disponible\n3. CORS esté configurado (pip install flask-cors)');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ==============================================
  // FUNCIÓN: MANEJAR CARGA DE IMAGEN
  // ==============================================
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      currentFileRef.current = file;
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
        analyzeImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  // ==============================================
  // FUNCIÓN: MANEJAR DRAG & DROP
  // ==============================================
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      currentFileRef.current = file;
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
        analyzeImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  // ==============================================
  // FUNCIÓN: OBTENER IMAGEN ACTUAL SEGÚN MODO
  // ==============================================
  const getCurrentImage = () => {
    if (!images) return uploadedImage;
    
    if (!showHeatmap) return images.original;
    
    switch (viewMode) {
      case 'original':
        return images.original;
      case 'heatmap':
        return images.heatmap;
      case 'superimposed':
        return images.superimposed;
      default:
        return images.superimposed;
    }
  };

  // ==============================================
  // CLASES CSS DINÁMICAS
  // ==============================================
  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardBgClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondaryClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`min-h-screen ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COLUMNA PRINCIPAL */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* ÁREA DE CARGA */}
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

            {/* PANEL DE RESULTADOS */}
            {(uploadedImage || isAnalyzing || result) && (
              <div className={`${cardBgClass} rounded-xl shadow-sm border ${borderClass} p-6`}>
                
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-lg font-semibold ${textClass}`}>
                    Resultado del Análisis
                  </h2>
                  
                  {result && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowHeatmap(!showHeatmap)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          showHeatmap 
                            ? 'bg-pink-500 text-white' 
                            : `${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`
                        }`}
                      >
                        <Eye className="w-4 h-4 inline mr-1" />
                        {showHeatmap ? 'Grad-CAM ON' : 'Grad-CAM OFF'}
                      </button>
                    </div>
                  )}
                </div>
                
                {/* MOSTRAR ERROR */}
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800 whitespace-pre-line">
                      <AlertCircle className="w-4 h-4 inline mr-2" />
                      {error}
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* IMAGEN */}
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
                      {getCurrentImage() && (
                        <img
                          src={getCurrentImage()}
                          alt="Análisis"
                          className="w-full h-64 object-cover rounded-lg border border-gray-200"
                        />
                      )}
                    </div>

                    {/* CONTROLES DE VISTA */}
                    {result && showHeatmap && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setViewMode('original')}
                          className={`flex-1 px-3 py-2 text-xs font-medium rounded transition-colors ${
                            viewMode === 'original'
                              ? 'bg-pink-500 text-white'
                              : `${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`
                          }`}
                        >
                          Original
                        </button>
                        <button
                          onClick={() => setViewMode('heatmap')}
                          className={`flex-1 px-3 py-2 text-xs font-medium rounded transition-colors ${
                            viewMode === 'heatmap'
                              ? 'bg-pink-500 text-white'
                              : `${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`
                          }`}
                        >
                          Heatmap
                        </button>
                        <button
                          onClick={() => setViewMode('superimposed')}
                          className={`flex-1 px-3 py-2 text-xs font-medium rounded transition-colors ${
                            viewMode === 'superimposed'
                              ? 'bg-pink-500 text-white'
                              : `${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`
                          }`}
                        >
                          Superpuesta
                        </button>
                      </div>
                    )}

                    {result && (
                      <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-pink-50'} border ${isDarkMode ? 'border-gray-600' : 'border-pink-200'}`}>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-pink-900'} leading-relaxed`}>
                          🔍 <strong>Interpretación Grad-CAM:</strong> Las áreas en rojo/amarillo representan las regiones del tejido que la red neuronal convolucional consideró más relevantes para la clasificación.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* RESULTADOS */}
                  <div className="space-y-4">
                    
                    {isAnalyzing && (
                      <div className="flex flex-col items-center justify-center h-64">
                        <Loader className="w-16 h-16 text-pink-500 animate-spin mb-4" />
                        <p className={`text-sm ${textSecondaryClass}`}>
                          Analizando imagen histopatológica...
                        </p>
                        <p className={`text-xs ${textSecondaryClass} mt-2`}>
                          Generando mapa Grad-CAM
                        </p>
                      </div>
                    )}

                    {result && !isAnalyzing && (
                      <div className="space-y-4">
                        
                        {/* CLASIFICACIÓN */}
                        <div className={`p-4 rounded-lg ${result.classification === 'NO CÁNCER' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                          <div className="flex items-start">
                            {result.classification === 'NO CÁNCER' ? (
                              <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-0.5" />
                            ) : (
                              <AlertCircle className="w-6 h-6 text-red-600 mr-3 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <h3 className={`font-semibold text-lg ${result.classification === 'NO CÁNCER' ? 'text-green-900' : 'text-red-900'}`}>
                                {result.classification}
                              </h3>
                              <p className={`text-sm mt-1 ${result.classification === 'NO CÁNCER' ? 'text-green-700' : 'text-red-700'}`}>
                                Confianza: {result.confidence}%
                              </p>
                              <p className={`text-xs mt-2 ${result.classification === 'NO CÁNCER' ? 'text-green-600' : 'text-red-600'}`}>
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
                            {result.classification === 'NO CÁNCER' 
                              ? 'El análisis histopatológico no muestra evidencia de células cancerígenas. Se recomienda seguimiento rutinario según protocolo médico.'
                              : 'El análisis detectó posibles células cancerígenas. Este resultado requiere confirmación mediante análisis adicionales por un patólogo certificado.'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR: HISTORIAL */}
          <div className="lg:col-span-1">
            <div className={`${cardBgClass} rounded-xl shadow-sm border ${borderClass} p-6 sticky top-24`}>
              <h2 className={`text-lg font-semibold ${textClass} mb-4 flex items-center`}>
                <History className="w-5 h-5 mr-2 text-pink-500" />
                Historial de Análisis
              </h2>
              
              <div className="space-y-3">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border ${borderClass} ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors cursor-pointer`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className={`text-xs font-medium ${textSecondaryClass}`}>{item.type}</span>
                      <span className={`text-xs ${textSecondaryClass}`}>{item.date}</span>
                    </div>
                    <p className={`text-sm font-semibold ${textClass} mb-1`}>{item.result}</p>
                    
                    <div className="flex items-center">
                      <div className={`flex-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-1.5 mr-2`}>
                        <div
                          className={`h-1.5 rounded-full ${item.result === 'NO CÁNCER' ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${item.confidence}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs ${textSecondaryClass}`}>{item.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AVISO MÉDICO */}
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
      </div>
    </div>
  );
};

export default CancerVisionAI;

// src/
// ├── components/
// │   ├── layout/
// │   │   ├── Header.jsx
// │   │   ├── Footer.jsx
// │   │   └── Layout.jsx
// │   ├── prediction/
// │   │   ├── ImageUploader.jsx
// │   │   ├── ResultsPanel.jsx
// │   │   ├── HeatmapViewer.jsx
// │   │   ├── ProbabilityDistribution.jsx
// │   │   └── AttentionAreas.jsx
// │   ├── history/
// │   │   ├── HistorySidebar.jsx
// │   │   └── HistoryItem.jsx
// │   ├── shared/
// │   │   ├── LoadingSpinner.jsx
// │   │   ├── MedicalDisclaimer.jsx
// │   │   └── ThemeToggle.jsx
// │   └── ui/
// │       └── Card.jsx
// ├── pages/
// │   ├── Home.jsx
// │   ├── Prediction.jsx
// │   └── About.jsx
// ├── hooks/
// │   ├── useTheme.js
// │   ├── useImageUpload.js
// │   └── useAnalysis.js
// ├── utils/
// │   ├── heatmapGenerator.js
// │   ├── imageProcessor.js
// │   └── constants.js
// ├── services/
// │   └── api.js
// ├── context/
// │   └── ThemeContext.jsx
// └── App.jsx
