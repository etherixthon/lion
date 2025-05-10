// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';  // For React 18, use ReactDOM.createRoot
import './index.css';  // Your global CSS
import App from './App';  // Import the App component
import { BrowserRouter as Router } from 'react-router-dom';  // Import React Router

// Create a root for rendering the app
const root = ReactDOM.createRoot(document.getElementById('root')); 

// Render the app inside the root element
root.render(
  <React.StrictMode>
    {/* Wrap the app in Router to enable React Router functionality */}
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

