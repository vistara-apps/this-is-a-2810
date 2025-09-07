import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'hsl(220 15% 25%)',
            color: 'white',
            borderRadius: '10px',
          },
          success: {
            iconTheme: {
              primary: 'hsl(180 60% 50%)',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: 'hsl(0 70% 50%)',
              secondary: 'white',
            },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
)
