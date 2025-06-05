/**
 * Tab Change Detection Utility
 * 
 * This utility provides functionality to detect tab changes and keyboard shortcuts
 * that might be used for cheating during a proctored interview.
 */

type ViolationCallback = (
  type: 'error' | 'warning' | 'info',
  message: string,
  duration?: number | string
) => void;

interface TabChangeDetectionOptions {
  onViolation: ViolationCallback;
  detectTabChange?: boolean;
  detectKeyboardShortcuts?: boolean;
  preventDefaultActions?: boolean;
}

// Track if detection is already initialized to prevent duplicate listeners
let isInitialized = false;

// Debug mode to log all key events
const DEBUG = true;

/**
 * Initializes tab change and keyboard shortcut detection
 * @param options Configuration options
 * @returns Cleanup function to remove event listeners
 */
export const initTabChangeDetection = (options: TabChangeDetectionOptions) => {
  // If already initialized, clean up first
  if (isInitialized) {
    console.log('Tab change detection was already initialized. Reinitializing...');
  }
  
  const {
    onViolation,
    detectTabChange = true,
    detectKeyboardShortcuts = true,
    preventDefaultActions = true
  } = options;

  console.log('Initializing tab change detection with options:', { detectTabChange, detectKeyboardShortcuts, preventDefaultActions });

  // Create a direct reference to the violation callback to avoid any scope issues
  const reportViolation = (type: 'error' | 'warning' | 'info', message: string) => {
    console.log(`Reporting violation: ${message}`);
    // Use direct function call instead of setTimeout
    try {
      onViolation(type, message, undefined);
    } catch (error) {
      console.error('Error reporting violation:', error);
    }
  };

  // Function to handle tab visibility changes
  const handleVisibilityChange = () => {
    if (document.hidden && detectTabChange) {
      console.log('Tab change detected: User switched away from interview');
      reportViolation(
        'warning',
        'Tab change violation: Switching away from the interview tab is not permitted during the interview.'
      );
    }
  };
  
  // Function to handle keyboard shortcuts
  const handleKeyDown = (event: KeyboardEvent) => {
    // Always log this regardless of debug mode
    console.log('⌨️ Key event received:', event.type, event.key, 'Modifiers:', { 
      ctrl: event.ctrlKey, 
      meta: event.metaKey, 
      alt: event.altKey, 
      shift: event.shiftKey,
      code: event.code,
      keyCode: event.keyCode
    });
    
    if (!detectKeyboardShortcuts) {
      console.log('❌ Keyboard shortcut detection is disabled');
      return;
    }
    
    // Get the platform-specific modifier key name
    const isMac = navigator.platform.toLowerCase().includes('mac');
    const modifierKey = isMac ? 'Cmd' : 'Ctrl';
    
    // Special handling for Tab key (which can be "Tab" or "tab" depending on browser)
    const isTabKey = event.key === 'Tab' || event.key.toLowerCase() === 'tab' || event.code === 'Tab' || event.keyCode === 9;
    
    // Check for Cmd+Tab, Ctrl+Tab, or Alt+Tab
    if ((event.metaKey || event.ctrlKey || event.altKey) && isTabKey) {
      let shortcutAction = '';
      if (event.metaKey) {
        shortcutAction = 'Cmd + Tab (Application switch)';
      } else if (event.ctrlKey) {
        shortcutAction = 'Ctrl + Tab (Tab switch)';
      } else if (event.altKey) {
        shortcutAction = 'Alt + Tab (Window switch)';
      }
      
      console.log(`Tab switching detected: ${shortcutAction}`);
      
      // Report the violation directly
      reportViolation(
        'warning',
        `Prohibited window/tab switching detected: ${shortcutAction}. Switching applications during the interview is not allowed.`
      );
      
      // Prevent the default action
      if (preventDefaultActions) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    }
    
    // Define the keys to monitor
    const monitoredKeys = ['c', 'v', 'x', 'a'];
    
    // Check for other common shortcuts
    const keyLower = event.key.toLowerCase();
    if ((event.metaKey || event.ctrlKey) && monitoredKeys.includes(keyLower)) {
      // Determine which shortcut was used
      let shortcutAction = '';
      switch(keyLower) {
        case 'c': shortcutAction = `${modifierKey} + C (Copy)`; break;
        case 'v': shortcutAction = `${modifierKey} + V (Paste)`; break;
        case 'x': shortcutAction = `${modifierKey} + X (Cut)`; break;
        case 'a': shortcutAction = `${modifierKey} + A (Select all)`; break;
      }
      
      console.log(`Keyboard shortcut detected: ${shortcutAction}`);
      
      // Report the violation directly
      reportViolation(
        'warning',
        `Prohibited keyboard shortcut detected: ${shortcutAction}. Using shortcuts during the interview is not allowed.`
      );
      
      // Prevent the default action if configured
      if (preventDefaultActions) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    }
  };
  
  // Clean up any existing listeners first
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  document.removeEventListener('keydown', handleKeyDown, true);
  
  // Add event listeners
  if (detectTabChange) {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    console.log('Tab change detection enabled');
  }
  
  if (detectKeyboardShortcuts) {
    // Use both capture phase and bubbling phase for maximum reliability
    document.addEventListener('keydown', handleKeyDown, true); // Capture phase
    document.addEventListener('keydown', handleKeyDown, false); // Bubbling phase
    console.log('Keyboard shortcut detection enabled');
  }
  
  // Force a test violation to verify the system is working
  console.log('Testing violation reporting...');
  reportViolation('info', 'Tab change detection initialized successfully. Keyboard shortcuts and tab changes are being monitored.');
  
  isInitialized = true;
  
  // Return cleanup function
  return () => {
    console.log('Cleaning up tab change detection');
    if (detectTabChange) {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
    if (detectKeyboardShortcuts) {
      document.removeEventListener('keydown', handleKeyDown, true); // Capture phase
      document.removeEventListener('keydown', handleKeyDown, false); // Bubbling phase
    }
    isInitialized = false;
  };
};

// Export a function to check if tab change detection is initialized
export const isTabChangeDetectionActive = () => isInitialized;
