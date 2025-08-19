import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);
