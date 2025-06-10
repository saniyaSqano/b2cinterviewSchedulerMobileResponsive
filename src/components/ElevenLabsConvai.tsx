import React, { useEffect, useRef } from 'react';

// Add TypeScript declaration for the ElevenLabs Convai widget
declare global {
  interface Window {
    ElevenLabsConvai?: any;
  }
}

interface ElevenLabsConvaiProps {
  text: string;
  autoPlay?: boolean;
  onComplete?: () => void;
}

/**
 * ElevenLabs Convai Widget component
 * Integrates the ElevenLabs Convai widget for text-to-speech functionality
 */
const ElevenLabsConvai: React.FC<ElevenLabsConvaiProps> = ({ text, autoPlay = false, onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const scriptLoaded = useRef(false);
  
  useEffect(() => {
    // Add the script tag if it doesn't exist
    if (!scriptLoaded.current) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
      script.async = true;
      script.type = 'text/javascript';
      
      script.onload = () => {
        scriptLoaded.current = true;
        initWidget();
      };
      
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    } else {
      initWidget();
    }
  }, []);
  
  // Initialize or update the widget when text changes
  useEffect(() => {
    if (scriptLoaded.current && widgetRef.current) {
      updateWidgetText();
    }
  }, [text]);
  
  const initWidget = () => {
    if (containerRef.current) {
      // Clear container first
      containerRef.current.innerHTML = '';
      
      // Create the widget element directly using HTML
      containerRef.current.innerHTML = `
        <elevenlabs-convai agent-id="agent_01jxcr8nwqe798sf3jjx0h717k" data-text="${encodeURIComponent(text)}"></elevenlabs-convai>
      `;
      
      // Store reference to the widget
      widgetRef.current = containerRef.current.querySelector('elevenlabs-convai');
      
      // Auto-play if enabled
      if (autoPlay && widgetRef.current) {
        setTimeout(() => {
          try {
            const playButton = containerRef.current?.querySelector('button');
            if (playButton) {
              playButton.click();
            }
          } catch (err) {
            console.error('Error auto-playing Convai widget:', err);
          }
        }, 1000);
      }
    }
  };
  
  const updateWidgetText = () => {
    if (containerRef.current) {
      // Re-initialize the widget with new text
      initWidget();
      
      // Auto-play if enabled
      if (autoPlay) {
        setTimeout(() => {
          try {
            const playButton = containerRef.current?.querySelector('button');
            if (playButton) {
              playButton.click();
            }
          } catch (err) {
            console.error('Error auto-playing Convai widget:', err);
          }
        }, 500);
      }
    }
  };
  
  return (
    <div ref={containerRef} className="elevenlabs-convai-container">
      {/* Widget will be inserted here by the script */}
    </div>
  );
};

export default ElevenLabsConvai;
