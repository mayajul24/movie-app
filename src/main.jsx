import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Prevent mouse wheel scrolling globally
const preventMouseWheelScroll = (e) => {
  e.preventDefault();
  e.stopPropagation();
  return false;
};

// Add event listener for mouse wheel
window.addEventListener('wheel', preventMouseWheelScroll, { passive: false });
window.addEventListener('mousewheel', preventMouseWheelScroll, { passive: false });

// Prevent tab key from doing anything
window.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    e.preventDefault();
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
