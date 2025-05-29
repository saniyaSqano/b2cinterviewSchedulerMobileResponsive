// AWS SDK Browser Polyfills
import { Buffer } from 'buffer';

// Make Buffer available globally
(window as any).Buffer = Buffer;

// Ensure global is defined (should be handled by Vite config, but adding as a safeguard)
(window as any).global = window;

// Ensure process.env is defined (should be handled by Vite config, but adding as a safeguard)
(window as any).process = (window as any).process || { env: {} };
