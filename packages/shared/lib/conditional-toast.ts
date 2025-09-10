/**
 * Conditional toast import that uses no-op functions in terminal app
 * and real toast functions in other apps
 */

// Check if we're in terminal app by looking at the current path or environment
const isTerminalApp = () => {
  if (typeof window === 'undefined') {
    // Server-side: check process.env or other indicators
    return process.env.NEXT_PUBLIC_APP_NAME === 'terminal' || 
           process.env.NODE_ENV === 'development' && process.cwd().includes('compass-terminal');
  }
  
  // Client-side: check window location or other indicators
  return window.location.hostname.includes('terminal') || 
         window.location.port === '3008' || // terminal dev port
         window.location.port === '3029';   // terminal prod port
};

// Import the appropriate toast implementation
let toast: any;

if (isTerminalApp()) {
  // Use smart toast for terminal (shows only allowed notifications)
  const { terminalToast } = require('./terminal-toast');
  toast = terminalToast;
} else {
  // Use real toast for other apps
  const { toast: realToast } = require('sonner');
  toast = realToast;
}

export { toast };
export default toast;
