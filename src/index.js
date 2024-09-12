import React from 'react';
import ReactDOM from 'react-dom/client';
import AppWithTheme from './AppWithTheme'; // Renamed App with theme provider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppWithTheme />
  </React.StrictMode>
);
