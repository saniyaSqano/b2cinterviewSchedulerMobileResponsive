import React, { useEffect } from 'react';

// Declare the custom element for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        'agent-id'?: string;
        'data-text'?: string;
      }, HTMLElement>;
    }
  }
}

interface ElevenLabsWidgetProps {
  text: string;
}

/**
 * A simple component that embeds the ElevenLabs Convai widget directly
 */
const ElevenLabsWidget: React.FC<ElevenLabsWidgetProps> = ({ text }) => {
  useEffect(() => {
    // Add the script tag if it doesn't exist
    if (!document.querySelector('script[src="https://unpkg.com/@elevenlabs/convai-widget-embed"]')) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
      script.async = true;
      script.type = 'text/javascript';
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="elevenlabs-widget-container">
      <elevenlabs-convai 
        agent-id="agent_01jxcr8nwqe798sf3jjx0h717k" 
        data-text={text}
      ></elevenlabs-convai>
    </div>
  );
};

export default ElevenLabsWidget;
