import React from 'react';
import ReactDOM from 'react-dom/client';
import { InternetIdentityProvider } from "ic-use-internet-identity";
import App from './App';
import './index.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <InternetIdentityProvider>
      <App />
    </InternetIdentityProvider>
  </React.StrictMode>,
);