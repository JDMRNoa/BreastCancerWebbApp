// ==============================================
// src/components/history/HistorySidebar.jsx
// ==============================================
import React from 'react';
import { History } from 'lucide-react';

export const HistorySidebar = ({ isDarkMode, history }) => {
  const cardBgClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondaryClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
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
  );
};