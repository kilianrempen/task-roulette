import React, { useEffect } from 'react';
import { useTasks } from '../context/TaskContext';

const CongratsModal = () => {
  const { showCongrats, closeCongrats } = useTasks();

  if (!showCongrats) return null;

  // Prevent background scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-45 backdrop-blur-md" onClick={closeCongrats}></div>

      {/* Soft dark-blue panel with wine-red glow and medium-light grey text for legibility */}
      <div
        className="relative w-full max-w-md p-6 rounded-xl mx-4"
        style={{
          background: 'linear-gradient(180deg, #071226 0%, #0b1a2b 100%)',
          color: '#d1d5db', /* medium-light grey (tailwind gray-300) */
          boxShadow: '0 10px 40px rgba(114,47,55,0.22), 0 2px 6px rgba(0,0,0,0.6)',
          border: '1px solid rgba(114,47,55,0.12)'
        }}
      >
        <h3 className="text-3xl font-bold text-center mb-2" style={{ color: '#e6e7e8' }}>Congratulations.</h3>
        <p className="text-center mb-6" style={{ color: '#c7c9cc' }}>The task fades away<br/>Empty hands meet the next step<br/>The path keeps moving.</p>
        <div className="flex justify-center">
          <button
            onClick={closeCongrats}
            className="px-6 py-2 bg-[#2D5F5F] hover:bg-[#3D7F7F] text-gray-100 rounded-lg font-semibold transition-all"
          >
            Move on
          </button>
        </div>
      </div>
    </div>
  );
};

export default CongratsModal;
