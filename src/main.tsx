// Import AWS polyfills first to ensure they're available throughout the application
import './utils/awsPolyfill';

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
