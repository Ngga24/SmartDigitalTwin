import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import useAuthStore from './store/authStore';
import './index.css';

function AppInitializer() {
  useEffect(() => {
    useAuthStore.getState().hydrate();
  }, []);
  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppInitializer />
    </BrowserRouter>
  </React.StrictMode>
);