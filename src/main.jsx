// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import { EmpresaProvider } from './context/EmpresaContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <EmpresaProvider>
        <AppRouter />
      </EmpresaProvider>
    </BrowserRouter>
  </React.StrictMode>
);
