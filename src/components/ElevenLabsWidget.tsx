
import React, { useEffect, useRef } from 'react';

// Declare the custom element for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        'agent-id'?: string;
        'data-text'?: string;
        'style'?: React.CSSProperties;
      }, HTMLElement>;
    }
  }
}

interface ElevenLabsWidgetProps {
  text: string;
}

/**
 * An enhanced component that embeds the ElevenLabs Convai widget directly
 * with improved display and size handling
 */
const ElevenLabsWidget: React.FC<ElevenLabsWidgetProps> = ({ text }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Add the script tag if it doesn't exist
    if (!document.querySelector('script[src="https://unpkg.com/@elevenlabs/convai-widget-embed"]')) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
      script.async = true;
      script.type = 'text/javascript';
      
      // Force re-render of the widget after script loads
      script.onload = () => {
        if (containerRef.current) {
          // Clear and re-add the widget
          const currentHTML = containerRef.current.innerHTML;
          containerRef.current.innerHTML = '';
          setTimeout(() => {
            if (containerRef.current) {
              containerRef.current.innerHTML = currentHTML;
            }
          }, 100);
        }
      };
      
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div 
      className="elevenlabs-widget-container bg-[#f1f7fe]/90 backdrop-blur-sm rounded-xl p-8 border border-blue-200/30" 
      ref={containerRef}
      style={{
        width: '100%',
        minHeight: '400px',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <elevenlabs-convai 
        agent-id="agent_01jxcr8nwqe798sf3jjx0h717k" 
        data-text={text}
        style={{
          width: '100%',
          maxWidth: '100%',
          overflow: 'hidden',
          
        }}
      ></elevenlabs-convai>
    </div>
  );
};

export default ElevenLabsWidget;
