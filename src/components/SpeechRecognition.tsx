import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface SpeechRecognitionProps {
  onResult: (transcript: string) => void;
  onEnd?: () => void;
  autoStart?: boolean;
  onAudioRecorded?: (audioBlob: Blob) => void;
}

const SpeechRecognition: React.FC<SpeechRecognitionProps> = ({ 
  onResult, 
  onEnd, 
  autoStart = false,
  onAudioRecorded
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  
  // Refs for audio recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Check if browser supports speech recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;
  
  // Start audio recording
  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        if (onAudioRecorded) {
          onAudioRecorded(audioBlob);
        }
        setIsRecording(false);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      console.log('Audio recording started');
    } catch (error) {
      console.error('Error starting audio recording:', error);
    }
  };
  
  // Stop audio recording
  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      // Stop all audio tracks
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      console.log('Audio recording stopped');
    }
  };

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
      // Stop audio recording when speech recognition ends
      stopAudioRecording();
      if (onEnd) {
        onEnd();
      }
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      
      // For network errors, try to restart after a short delay
      if (event.error === 'network') {
        console.log('Network error detected, attempting to restart speech recognition in 2 seconds...');
        setTimeout(() => {
          if (!isListening) {
            console.log('Restarting speech recognition after network error');
            startListening();
          }
        }, 2000);
      } else {
        setIsListening(false);
        // Stop audio recording on error
        stopAudioRecording();
      }
    };
    
    // Auto-start if enabled
    if (autoStart) {
      startListening();
    }
    
    return () => {
      if (recognition && isListening) {
        recognition.stop();
      }
      // Ensure audio recording is stopped when component unmounts
      stopAudioRecording();
    };
  }, []);
  
  const startListening = useCallback(() => {
    if (!recognition) return;
    
    setTranscript('');
    setIsListening(true);
    recognition.start();
    
    // Start audio recording when speech recognition starts
    startAudioRecording();
  }, [recognition]);
  
  const stopListening = useCallback(() => {
    if (!recognition) return;
    
    recognition.stop();
    setIsListening(false);
    
    // Stop audio recording when speech recognition stops
    stopAudioRecording();
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
