import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';
import { StoryProvider } from './context/StoryContext';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StoryProvider>
      <PlayerProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PlayerProvider>
    </StoryProvider>
  </React.StrictMode>,
)
