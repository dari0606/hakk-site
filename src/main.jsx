import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter';
import '@fontsource/pt-serif/cyrillic-ext-400.css';
import '@fontsource/pt-serif/cyrillic-400.css';
import '@fontsource/pt-serif/latin-400.css';
import '@fontsource/pt-serif/cyrillic-ext-700.css';
import '@fontsource/pt-serif/cyrillic-700.css';
import '@fontsource/pt-serif/latin-700.css';
import '@fontsource/noto-naskh-arabic/arabic-400.css';
import './site.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
