import React, { useState } from 'react';

const ElevenLabsTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // ElevenLabs API configuration
  const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || 'sk_08635d652c00ee4ed79e38987ec2ae2d87799b3454169f11';
  const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Rachel voice (female, conversational)
  
  const testElevenLabsAPI = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    
    try {
      // Simple test text
      const testText = 'Hello, this is a test of the ElevenLabs API with the new API key.';
      
      console.log('Testing ElevenLabs API with key:', ELEVENLABS_API_KEY.substring(0, 5) + '...');
      
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY
        },
        body: JSON.stringify({
          text: testText,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.75
          }
        })
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('API key is invalid or expired');
        }
        throw new Error(`API error: ${response.status}`);
      }
      
      // If we get here, the API call was successful
      setResult('API test successful! The API key is valid and working.');
      
      // Create an audio element to play the response
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
      
    } catch (err) {
      console.error('Error testing ElevenLabs API:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <h2 className="text-xl font-bold text-gray-800 mb-4">ElevenLabs API Test</h2>
      
      <button
        onClick={testElevenLabsAPI}
        disabled={isLoading}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
      >
        {isLoading ? 'Testing...' : 'Test ElevenLabs API'}
      </button>
      
      {isLoading && (
        <div className="mt-4 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
          <span className="ml-2 text-gray-600">Testing API connection...</span>
        </div>
      )}
      
      {result && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">
          {result}
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md">
          Error: {error}
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-600">
        <p>API Key: {ELEVENLABS_API_KEY ? ELEVENLABS_API_KEY.substring(0, 5) + '...' + ELEVENLABS_API_KEY.substring(ELEVENLABS_API_KEY.length - 4) : 'Not found'}</p>
        <p>Voice ID: {VOICE_ID}</p>
      </div>
    </div>
  );
};

export default ElevenLabsTest;
