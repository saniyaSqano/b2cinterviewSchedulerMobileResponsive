import React, { useState, useEffect, useRef } from 'react';

interface AISpeechProps {
  text: string;
  onSpeechEnd?: () => void;
  autoPlay?: boolean;
}

const AISpeech: React.FC<AISpeechProps> = ({ text, onSpeechEnd, autoPlay = true }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // ElevenLabs API configuration
  const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || 'sk_8e90f28fc34baf9358ec7ce64ca0e8320775dd6a8d0da40d'; // Using Vite env format
  const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Rachel voice (female, conversational)
  
  // Fallback to browser's built-in speech synthesis
  const useBrowserSpeech = () => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Cancel any existing speech
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      
      // Create a new utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;
      
      // Configure the utterance
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Get available voices and select a female voice if available
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('woman') ||
        voice.name.toLowerCase().includes('girl')
      );
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      
      // Set up event handlers
      utterance.onstart = () => {
        setIsPlaying(true);
        setIsLoading(false);
      };
      
      utterance.onend = () => {
        setIsPlaying(false);
        if (onSpeechEnd) {
          onSpeechEnd();
        }
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsPlaying(false);
        setError('Failed to play speech');
        setIsLoading(false);
      };
      
      // Start speaking
      if (autoPlay) {
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error('Error using browser speech:', err);
      setError('Failed to use browser speech synthesis');
      setIsLoading(false);
    }
  };

  const generateSpeech = async () => {
    if (!text.trim()) return;
    
    // If we're already using the fallback or if ElevenLabs API key is missing, use browser speech
    if (useFallback || !ELEVENLABS_API_KEY) {
      useBrowserSpeech();
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.75
          }
        })
      });
      
      if (!response.ok) {
        // If we get an unauthorized error, switch to fallback
        if (response.status === 401) {
          console.log('ElevenLabs API key invalid, switching to browser speech');
          setUseFallback(true);
          useBrowserSpeech();
          return;
        }
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }
      
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        if (autoPlay) {
          audioRef.current.play();
          setIsPlaying(true);
        }
      }
    } catch (err) {
      console.error('Error generating speech:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate speech');
      // Fall back to browser speech on any error
      useBrowserSpeech();
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePlay = () => {
    if (useFallback) {
      // Resume speech synthesis if using browser speech
      if (utteranceRef.current && window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
      } else {
        // Start new speech if not already speaking
        useBrowserSpeech();
      }
    } else if (audioRef.current) {
      // Play audio if using ElevenLabs
      audioRef.current.play();
      setIsPlaying(true);
    }
  };
  
  const handlePause = () => {
    if (useFallback) {
      // Pause speech synthesis if using browser speech
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        setIsPlaying(false);
      }
    } else if (audioRef.current) {
      // Pause audio if using ElevenLabs
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  const handleEnded = () => {
    setIsPlaying(false);
    if (onSpeechEnd) {
      onSpeechEnd();
    }
  };
  
  useEffect(() => {
    // Generate speech when text changes
    generateSpeech();
    
    // Cleanup function
    return () => {
      // Clean up audio element if using ElevenLabs
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      
      // Clean up speech synthesis if using browser speech
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [text]);
  
  return (
    <div className="ai-speech">
      <audio 
        ref={audioRef} 
        onEnded={handleEnded}
        style={{ display: 'none' }}
      />
      
      {isLoading && (
        <div className="flex items-center space-x-2 text-gray-500">
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
          <span className="text-xs">Generating audio...</span>
        </div>
      )}
      
      {!isLoading && !error && (
        <div className="flex items-center space-x-2">
          {isPlaying ? (
            <button 
              onClick={handlePause}
              className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              title="Pause speech"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
            </button>
          ) : (
            <button 
              onClick={handlePlay}
              className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              title="Play speech"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </button>
          )}
          <span className="text-xs text-gray-500">AI speech available</span>
        </div>
      )}
      
      {error && (
        <div className="text-xs text-red-500">
          {error}
        </div>
      )}
    </div>
  );
};

export default AISpeech;
