// ==============================================
// src/components/shared/LoadingSpinner.jsx
// ==============================================
import React from 'react';
import { Loader } from 'lucide-react';

const LoadingSpinner = () => {
  return <Loader className="w-16 h-16 text-pink-500 animate-spin" />;
};

export default LoadingSpinner;
