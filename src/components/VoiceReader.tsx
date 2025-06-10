import React, { useEffect, useState } from 'react';

interface VoiceReaderProps {
  text: string;
  enabled?: boolean;
}

/**
 * A simple component that automatically reads text using the Web Speech API
 */
const VoiceReader: React.FC<VoiceReaderProps> = ({ text, enabled = true }) => {
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  // Load voices when component mounts
  useEffect(() => {
    // Function to set voices as loaded
    const handleVoicesLoaded = () => {
      setVoicesLoaded(true);
    };

    // Check if voices are already loaded
    if (window.speechSynthesis) {
      if (window.speechSynthesis.getVoices().length > 0) {
        setVoicesLoaded(true);
      } else {
        // Event fires when voices are loaded
        window.speechSynthesis.addEventListener('voiceschanged', handleVoicesLoaded);
      }
    }

    // Cleanup
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesLoaded);
      }
    };
  }, []);

  // Speak text when it changes or when voices are loaded
  useEffect(() => {
    // Skip if disabled, no text, no speech synthesis, or voices not loaded
    if (!enabled || !text || !window.speechSynthesis || !voicesLoaded) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice properties for better quality
    utterance.rate = 0.9; // slightly slower
    utterance.pitch = 1.0; // normal pitch
    utterance.volume = 1.0; // full volume
    
    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    console.log('Available voices:', voices.map(v => v.name).join(', '));
    
    // Try to use a good quality voice
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Samantha') || 
      voice.name.includes('Daniel')
    );
    
    if (preferredVoice) {
      console.log('Using voice:', preferredVoice.name);
      utterance.voice = preferredVoice;
    } else if (voices.length > 0) {
      console.log('Using default voice:', voices[0].name);
      utterance.voice = voices[0];
    }
    
    // Log that we're speaking
    console.log('Speaking text:', text);
    
    // Speak the text
    window.speechSynthesis.speak(utterance);
    
    // Cleanup function
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [text, enabled, voicesLoaded]);
  
  // This component doesn't render anything visible
  return null;
};

export default VoiceReader;
