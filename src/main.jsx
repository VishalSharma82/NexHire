import React from 'react'
import ReactDOM from 'react-dom/client'
import { InterviewProvider } from './context/InterviewContext';
import { VoiceProvider } from './context/VoiceContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import './index.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <InterviewProvider>
          <VoiceProvider>
            <App />
          </VoiceProvider>
        </InterviewProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
