import React, { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface SpeechRecognitionProps {
  onResult: (transcript: string) => void;
  onEnd?: () => void;
  autoStart?: boolean;
}

const SpeechRecognition: React.FC<SpeechRecognitionProps> = ({ 
  onResult, 
  onEnd, 
  autoStart = false 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  
  // Check if browser supports speech recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;
  
  useEffect(() => {
    if (!recognition) {
      setIsSupported(false);
      return;
    }
    
    // Configure recognition
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const transcript = result[0].transcript;
      
      setTranscript(transcript);
      
      if (result.isFinal) {
        onResult(transcript);
      }
    };
    
    recognition.onend = () => {
      setIsListening(false);
      if (onEnd) {
        onEnd();
      }
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };
    
    // Auto-start if enabled
    if (autoStart) {
      startListening();
    }
    
    return () => {
      if (recognition && isListening) {
        recognition.stop();
      }
    };
  }, []);
  
  const startListening = useCallback(() => {
    if (!recognition) return;
    
    setTranscript('');
    setIsListening(true);
    recognition.start();
  }, [recognition]);
  
  const stopListening = useCallback(() => {
    if (!recognition) return;
    
    recognition.stop();
    setIsListening(false);
  }, [recognition]);
  
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);
  
  if (!isSupported) {
    return (
      <div className="text-sm text-red-500">
        Speech recognition is not supported in this browser.
      </div>
    );
  }
  
  return (
    <div className="speech-recognition">
      <button
        onClick={toggleListening}
        className={`p-3 rounded-full transition-colors ${
          isListening 
            ? 'bg-pink-500 text-white animate-pulse' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
        }`}
        title={isListening ? 'Stop listening' : 'Start listening'}
      >
        {isListening ? (
          <Mic className="w-5 h-5" />
        ) : (
          <MicOff className="w-5 h-5" />
        )}
      </button>
      
      {isListening && (
        <div className="mt-2 text-xs text-gray-500">
          {transcript ? transcript : 'Listening...'}
        </div>
      )}
    </div>
  );
};

export default SpeechRecognition;

// Add necessary type definitions
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
