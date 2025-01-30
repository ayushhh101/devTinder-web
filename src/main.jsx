import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

//Main entry point of application
createRoot(document.getElementById('root')).render(
    <App />,
)
