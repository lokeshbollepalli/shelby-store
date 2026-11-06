import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import AdminApp from './components/AdminApp';
import { StoreProvider } from './context/StoreContext';
import './styles.css';
const isAdmin = window.location.pathname.replace(/\/$/,'') === '/admin';
createRoot(document.getElementById('root')).render(<React.StrictMode><StoreProvider>{isAdmin?<AdminApp/>:<App/>}</StoreProvider></React.StrictMode>);
