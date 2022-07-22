import React from 'react';
import ReactDOM from 'react-dom';
import './general.css';
import './i18n.js';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './pages/App';
import Settings from './pages/Settings';

ReactDOM.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/settings" element={<Settings />} />
        </Routes>
    </BrowserRouter>,
    document.getElementById('root')
);
