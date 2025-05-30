// AWS SDK v3 Browser Polyfills
// Much simpler than v2 as v3 has better browser compatibility

// Import Buffer for file handling
import { Buffer } from 'buffer';

// Make Buffer available globally for file operations
(window as any).Buffer = Buffer;
