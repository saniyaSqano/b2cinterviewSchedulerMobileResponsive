import * as tf from '@tensorflow/tfjs';

// TypeScript declarations for WebUSB API
declare global {
  interface Navigator {
    usb?: {
      getDevices(): Promise<USBDevice[]>;
      requestDevice(options: { filters: any[] }): Promise<USBDevice>;
      addEventListener(type: string, listener: EventListener): void;
      removeEventListener(type: string, listener: EventListener): void;
    };
  }

  interface USBDevice {
    deviceId?: number;
    productId?: number;
    vendorId?: number;
    productName?: string;
    manufacturerName?: string;
    serialNumber?: string;
    configuration?: any;
    configurations?: any[];
    opened?: boolean;
    deviceVersionMajor?: number;
    deviceVersionMinor?: number;
    deviceVersionSubminor?: number;
    usbVersionMajor?: number;
    usbVersionMinor?: number;
    usbVersionSubminor?: number;
  }

  interface USBConnectionEvent extends Event {
    device: USBDevice;
  }
}

// Flag to track initialization status
let isInitialized = false;

// Store device information for comparison
let initialDevices: DeviceInfo[] = [];

// Store USB device history
let usbConnectionHistory: USBConnectionRecord[] = [];

// Interface for device information
interface DeviceInfo {
  id: string;
  name: string;
  type: string;
  timestamp: Date;
}

// Interface for our internal USB connection events tracking
interface USBConnectionRecord {
  device: USBDevice;
  connected: boolean;
  timestamp: Date;
}

/**
 * Initialize the device detection system
 */
export const initDeviceDetection = async (): Promise<void> => {
  if (isInitialized) {
    console.log('Device detection already initialized');
    return;
  }

  try {
    // Initialize TensorFlow.js for potential pattern analysis
    if (!tf.getBackend()) {
      await tf.setBackend('webgl');
      console.log('TensorFlow backend initialized for device detection:', tf.getBackend());
    }

    // Set up media device detection - this is more reliable and doesn't require permissions
    if (navigator.mediaDevices) {
      console.log('Media devices API available, setting up detection');
      
      try {
        // Get initial media devices
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        console.log('Initial media devices:', mediaDevices);
        
        // Store initial devices and identify built-in devices
        mediaDevices.forEach(device => {
          const deviceLabel = device.label || `${device.kind} device`;
          const isBuiltIn = deviceLabel.includes('Built-in') || 
                          deviceLabel.includes('Internal') || 
                          deviceLabel.includes('MacBook') ||
                          deviceLabel.includes('Apple') ||
                          deviceLabel.includes('Teams') ||
                          deviceLabel.includes('Default') ||
                          deviceLabel.includes('Communications') ||
                          deviceLabel.includes('System');
          
          initialDevices.push({
            id: device.deviceId,
            name: deviceLabel,
            type: isBuiltIn ? `built-in-${device.kind}` : device.kind,
            timestamp: new Date()
          });
        });
        
        // Set up device change listener - this will detect when devices are added/removed
        navigator.mediaDevices.addEventListener('devicechange', () => {
          console.log('Media devices changed - checking for new devices');
          // The actual check will happen in checkForNewDevices
        });
      } catch (err) {
        console.warn('Could not initialize media device detection:', err);
      }
    } else {
      console.warn('MediaDevices API not supported in this browser');
    }
    
    // Try to initialize USB device detection if available
    if (navigator.usb) {
      try {
        // Get any already-permitted USB devices without showing permission dialog
        const initialUSBDevices = await navigator.usb.getDevices();
        console.log('Initial USB devices:', initialUSBDevices);
        
        // Store initial devices and mark built-in devices
        initialUSBDevices.forEach(device => {
          const deviceName = device.productName || 'Unknown USB Device';
          const isBuiltIn = deviceName.includes('Built-in') || 
                          deviceName.includes('Internal') || 
                          deviceName.includes('MacBook') ||
                          deviceName.includes('Apple') ||
                          deviceName.includes('Default');
          
          initialDevices.push({
            id: device.serialNumber || String(device.deviceId),
            name: deviceName,
            type: isBuiltIn ? 'built-in-usb' : 'usb',
            timestamp: new Date()
          });
        });
        
        // Set up event listeners for USB device connections
        navigator.usb.addEventListener('connect', (event: Event) => {
          const usbEvent = event as USBConnectionEvent;
          console.log('USB device connected:', usbEvent.device);
          usbConnectionHistory.push({
            device: usbEvent.device,
            connected: true,
            timestamp: new Date()
          });
        });
        
        navigator.usb.addEventListener('disconnect', (event: Event) => {
          const usbEvent = event as USBConnectionEvent;
          console.log('USB device disconnected:', usbEvent.device);
          usbConnectionHistory.push({
            device: usbEvent.device,
            connected: false,
            timestamp: new Date()
          });
        });
      } catch (err) {
        console.warn('Could not initialize USB device detection:', err);
      }
    } else {
      console.warn('WebUSB API not supported in this browser');
    }
    
    isInitialized = true;
    console.log('Device detection system initialized');
  } catch (err) {
    console.error('Error initializing device detection:', err);
  }
};

/**
 * Check for new devices connected since initialization
 * @param onViolation - Callback function to handle violations
 * @returns Object with device detection results
 */
export const checkForNewDevices = async (onViolation?: (violation: {type: string; message: string; timestamp: Date}) => void): Promise<{
  newDevicesDetected: boolean;
  newUSBDevicesDetected: boolean;
  newMediaDevicesDetected: boolean;
  recentlyConnectedDevices: DeviceInfo[];
  violationDetected: boolean;
}> => {
  if (!isInitialized) {
    await initDeviceDetection();
  }

  const recentlyConnectedDevices: DeviceInfo[] = [];
  let newUSBDevicesDetected = false;
  let newMediaDevicesDetected = false;

  // First, check for new devices using the MediaDevices API
  // This is more reliable and doesn't require permission dialogs
  if (navigator.mediaDevices) {
    try {
      // Get current media devices
      const currentMediaDevices = await navigator.mediaDevices.enumerateDevices();
      
      // Compare with initial devices to find new ones
      for (const device of currentMediaDevices) {
        const existingDevice = initialDevices.find(d => d.id === device.deviceId);
        
        if (!existingDevice) {
          // This is a new device that wasn't present during initialization
          console.log('New device detected via MediaDevices API:', device.kind, device.label);
          
          // Check if this might be a USB storage device
          // Look for patterns in the device label that might indicate a storage device
          const deviceLabel = device.label || '';
          
          // Skip built-in devices and common peripherals
          const isBuiltInDevice = 
            deviceLabel.includes('Built-in') || 
            deviceLabel.includes('Internal') || 
            deviceLabel.includes('MacBook') ||
            deviceLabel.includes('Apple') ||
            deviceLabel.includes('Default') ||
            deviceLabel.includes('Communications') ||
            deviceLabel.includes('System');
            
          if (!isBuiltInDevice) {
            // This could be an external device - treat it as a potential violation
            // Especially if it appeared suddenly during the exam
            newUSBDevicesDetected = true;
            
            recentlyConnectedDevices.push({
              id: device.deviceId,
              name: device.label || `${device.kind} device`,
              type: 'usb-storage', // We'll categorize it as storage for simplicity
              timestamp: new Date()
            });
          }
        }
      }
    } catch (err) {
      console.warn('Could not check for new media devices:', err);
    }
  }

  // Also check for USB devices if the API is available
  if (navigator.usb) {
    try {
      const currentUSBDevices = await navigator.usb.getDevices();
      
      // Compare with initial devices
      for (const device of currentUSBDevices) {
        const deviceId = device.serialNumber || String(device.deviceId);
        const existingDevice = initialDevices.find(d => d.id === deviceId && (d.type === 'usb' || d.type === 'built-in-usb'));
        
        // Get device name
        const deviceName = device.productName || '';
        
        // Check if this is a USB mass storage device (pendrive, external HDD)
        // We ONLY want to detect USB storage devices, not phones or other peripherals
        const isStorageDevice = 
          // Generic storage identifiers
          deviceName.includes('USB Drive') || 
          deviceName.includes('Flash') || 
          deviceName.includes('Storage') ||
          deviceName.includes('Disk') ||
          deviceName.includes('Memory') ||
          deviceName.includes('HDD') ||
          deviceName.includes('Hard Drive') ||
          deviceName.includes('Hard Disk') ||
          deviceName.includes('Pendrive') ||
          deviceName.includes('Thumb Drive') ||
          deviceName.includes('Mass Storage') ||
          // Common USB drive brands
          deviceName.includes('SanDisk') ||
          deviceName.includes('Kingston') ||
          deviceName.includes('Lexar') ||
          deviceName.includes('Cruzer') ||
          deviceName.includes('Transcend') ||
          deviceName.includes('WD') ||
          deviceName.includes('Western Digital') ||
          deviceName.includes('Seagate') ||
          deviceName.includes('Toshiba') ||
          // USB mass storage class identifier
          deviceName.includes('MSC') ||
          // If no name but has a serial number and is likely a storage device
          (deviceName === 'Unknown USB Device' && device.serialNumber);
        
        // Exclude common peripherals and built-in devices
        const isExcludedDevice = 
          deviceName.includes('Built-in') || 
          deviceName.includes('Internal') || 
          deviceName.includes('MacBook') ||
          deviceName.includes('Apple') ||
          deviceName.includes('Default') ||
          deviceName.includes('System') ||
          deviceName.includes('Teams') ||
          deviceName.includes('Keyboard') || 
          deviceName.includes('Mouse') ||
          deviceName.includes('Trackpad') ||
          deviceName.includes('Camera') ||
          deviceName.includes('Webcam') ||
          deviceName.includes('Speaker') ||
          deviceName.includes('Microphone') ||
          deviceName.includes('Headset') ||
          deviceName.includes('Audio');
        
        // Only consider new storage devices that aren't excluded
        if (!existingDevice && isStorageDevice && !isExcludedDevice) {
          // New USB storage device found - this is a violation
          newUSBDevicesDetected = true;
          const newDevice: DeviceInfo = {
            id: deviceId,
            name: deviceName || 'Unknown USB Storage Device',
            type: 'usb-storage',
            timestamp: new Date()
          };
          recentlyConnectedDevices.push(newDevice);
        }
      }
    } catch (err) {
      console.warn('Could not check for new USB devices:', err);
    }
  }

  // Check USB connection history for recent connections
  const recentConnections = usbConnectionHistory.filter(
    record => record.connected && (new Date().getTime() - record.timestamp.getTime() < 60000) // Last minute
  );
  
  if (recentConnections.length > 0) {
    // Filter for storage devices only and exclude built-in devices and peripherals
    const storageDeviceConnections = recentConnections.filter(connection => {
      const deviceName = connection.device.productName || '';
      
      // Check if this is a USB mass storage device (pendrive, external HDD)
      const isStorageDevice = 
        // Generic storage identifiers
        deviceName.includes('USB Drive') || 
        deviceName.includes('Flash') || 
        deviceName.includes('Storage') ||
        deviceName.includes('Disk') ||
        deviceName.includes('Memory') ||
        deviceName.includes('HDD') ||
        deviceName.includes('Hard Drive') ||
        deviceName.includes('Hard Disk') ||
        deviceName.includes('Pendrive') ||
        deviceName.includes('Thumb Drive') ||
        deviceName.includes('Mass Storage') ||
        // Common USB drive brands
        deviceName.includes('SanDisk') ||
        deviceName.includes('Kingston') ||
        deviceName.includes('Lexar') ||
        deviceName.includes('Cruzer') ||
        deviceName.includes('Transcend') ||
        deviceName.includes('WD') ||
        deviceName.includes('Western Digital') ||
        deviceName.includes('Seagate') ||
        deviceName.includes('Toshiba') ||
        // USB mass storage class identifier
        deviceName.includes('MSC') ||
        // If no name but has a serial number and is likely a storage device
        (deviceName === 'Unknown USB Device' && connection.device.serialNumber);
      
      // Exclude common peripherals and built-in devices
      const isExcludedDevice = 
        deviceName.includes('Built-in') || 
        deviceName.includes('Internal') || 
        deviceName.includes('MacBook') ||
        deviceName.includes('Apple') ||
        deviceName.includes('Default') ||
        deviceName.includes('System') ||
        deviceName.includes('Teams') ||
        deviceName.includes('Keyboard') || 
        deviceName.includes('Mouse') ||
        deviceName.includes('Trackpad') ||
        deviceName.includes('Camera') ||
        deviceName.includes('Webcam') ||
        deviceName.includes('Speaker') ||
        deviceName.includes('Microphone') ||
        deviceName.includes('Headset') ||
        deviceName.includes('Audio');
      
      // Only consider storage devices that aren't excluded
      return isStorageDevice && !isExcludedDevice;
    });
    
    if (storageDeviceConnections.length > 0) {
      newUSBDevicesDetected = true;
      
      // Add to recently connected devices if not already included
      for (const connection of storageDeviceConnections) {
        const deviceId = connection.device.serialNumber || String(connection.device.deviceId);
        if (!recentlyConnectedDevices.some(d => d.id === deviceId)) {
          const deviceName = connection.device.productName || '';
          recentlyConnectedDevices.push({
            id: deviceId,
            name: deviceName || 'Unknown USB Storage Device',
            type: 'usb-storage',
            timestamp: connection.timestamp
          });
        }
      }
    }
  }

  // Use TensorFlow to analyze the pattern of device connections
  // This is mostly for demonstration - in a real implementation, we would
  // use TensorFlow to detect suspicious patterns of device connections
  tf.tidy(() => {
    // Create a simple tensor to represent device connection events
    const connectionEvents = tf.tensor1d([recentlyConnectedDevices.length]);
    console.log('Device connection tensor:', connectionEvents.dataSync());
  });

  // Log violations if new USB storage devices are detected
  if (newUSBDevicesDetected && recentlyConnectedDevices.length > 0) {
    // Get the most recent device
    const mostRecentDevice = recentlyConnectedDevices.sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    )[0];
    
    // Create violation message
    let violationMessage = '';
    if (mostRecentDevice) {
      violationMessage = `USB storage device connected: ${mostRecentDevice.name}`;
    } else {
      violationMessage = 'USB storage device connected';
    }
    
    // Log the violation if callback is provided
    if (onViolation) {
      onViolation({
        type: 'error',
        message: violationMessage,
        timestamp: new Date()
      });
    }
    
    console.log('VIOLATION DETECTED:', violationMessage);
    
    return {
      newDevicesDetected: newUSBDevicesDetected || newMediaDevicesDetected,
      newUSBDevicesDetected,
      newMediaDevicesDetected,
      recentlyConnectedDevices,
      violationDetected: true
    };
  }

  return {
    newDevicesDetected: newUSBDevicesDetected || newMediaDevicesDetected,
    newUSBDevicesDetected,
    newMediaDevicesDetected,
    recentlyConnectedDevices,
    violationDetected: false
  };
};

/**
 * Request access to USB devices
 * This must be called in response to a user gesture (click)
 */
export const requestUSBDeviceAccess = async (): Promise<boolean> => {
  if (!navigator.usb) {
    console.warn('USB API not available in this browser');
    return false;
  }

  try {
    // Request a device to trigger the permission prompt
    await navigator.usb.requestDevice({ filters: [] });
    return true;
  } catch (err) {
    console.warn('USB device request canceled or failed:', err);
    return false;
  }
};
