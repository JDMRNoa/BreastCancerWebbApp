import React, { useState, useRef } from 'react';
import { ImageUploader } from './components/prediction/ImageUploader';
import { ResultsPanel } from './components/prediction/ResultsPanel';
import { HistorySidebar } from './components/history/HistorySidebar';
import { MedicalDisclaimer } from './components/shared/MedicalDisclaimer';

const CancerVisionAI = ({ isDarkMode }) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [images, setImages] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [viewMode, setViewMode] = useState('superimposed');
  const [error, setError] = useState(null);
  const currentFileRef = useRef(null);
  
  const [history, setHistory] = useState([
    { id: 1, type: 'Histopatología', result: 'NO CÁNCER', confidence: 94, date: '2025-10-22' },
    { id: 2, type: 'Histopatología', result: 'CÁNCER', confidence: 87, date: '2025-10-21' }
  ]);

  const API_URL = 'http://localhost:5000';

  const analyzeImage = async (file) => {
    setIsAnalyzing(true);
    setResult(null);
    setImages(null);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error del servidor (${response.status}): ${errorText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error en el análisis');
      }
      
      const confidencePercent = Math.round(data.confidence * 100);
      
      setResult({
        score: data.score,
        classification: data.classification,
        confidence: confidencePercent,
        label: data.label
      });
      
      const gradcamFormData = new FormData();
      gradcamFormData.append('file', file);
      
      const gradcamResponse = await fetch(`${API_URL}/gradcam`, {
        method: 'POST',
        body: gradcamFormData,
      });
      
      if (gradcamResponse.ok) {
        const gradcamData = await gradcamResponse.json();
        
        if (gradcamData.success) {
          setImages({
            original: `data:image/png;base64,${gradcamData.original_base64}`,
            heatmap: `data:image/png;base64,${gradcamData.heatmap_base64}`,
            superimposed: `data:image/png;base64,${gradcamData.superimposed_base64}`
          });
        }
      }
      
      setHistory(prev => [{
        id: prev.length + 1,
        type: 'Histopatología',
        result: data.classification,
        confidence: confidencePercent,
        date: new Date().toISOString().split('T')[0],
      }, ...prev.slice(0, 4)]);
      
    } catch (err) {
      const errorMessage = err.message || 'Error al analizar la imagen';
      
      if (errorMessage.includes('Failed to fetch')) {
        setError(' No se pudo conectar al backend. Verifica que:\n1. El servidor Flask esté corriendo (python main.py)\n2. El puerto 5000 esté disponible\n3. CORS esté configurado (pip install flask-cors)');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageSelect = (file) => {
    currentFileRef.current = file;
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target.result);
      analyzeImage(file);
    };
    reader.readAsDataURL(file);
  };

  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';

  return (
    <div className={`min-h-screen ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ImageUploader isDarkMode={isDarkMode} onImageSelect={handleImageSelect} />
            
            <ResultsPanel
              isDarkMode={isDarkMode}
              uploadedImage={uploadedImage}
              isAnalyzing={isAnalyzing}
              result={result}
              images={images}
              showHeatmap={showHeatmap}
              viewMode={viewMode}
              error={error}
              onToggleHeatmap={() => setShowHeatmap(!showHeatmap)}
              onViewModeChange={setViewMode}
            />
          </div>

          <div className="lg:col-span-1">
            <HistorySidebar isDarkMode={isDarkMode} history={history} />
          </div>
        </div>

        <MedicalDisclaimer isDarkMode={isDarkMode} />
      </div>
    </div>
  );
};

export default CancerVisionAI;