import React, { useState } from 'react';
import Layout from './components/layout/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Prediction } from './pages/Prediction';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'about', 'prediction'

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home isDarkMode={isDarkMode} onNavigate={setCurrentPage} />;
      case 'about':
        return <About isDarkMode={isDarkMode} />;
      case 'prediction':
        return <Prediction isDarkMode={isDarkMode} />;
      default:
        return <Home isDarkMode={isDarkMode} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <Layout 
      isDarkMode={isDarkMode} 
      onThemeToggle={() => setIsDarkMode(!isDarkMode)}
      currentPage={currentPage}
      onNavigate={setCurrentPage}
    >
      {renderPage()}
    </Layout>
  );
}

export default App;