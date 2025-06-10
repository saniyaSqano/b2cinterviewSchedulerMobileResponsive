/**
 * ElevenLabs Text-to-Speech Utility
 * This module provides functions to convert text to speech using the ElevenLabs API.
 */

// ElevenLabs API configuration
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || 'sk_08635d652c00ee4ed79e38987ec2ae2d87799b3454169f11';
const DEFAULT_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Rachel voice (female, conversational)

/**
 * Convert text to speech using ElevenLabs API and play the audio
 * @param text - The text to convert to speech
 * @param voiceId - Optional voice ID to use (defaults to Rachel)
 * @returns Promise that resolves when audio starts playing, or rejects on error
 */
export const speakText = async (
  text: string, 
  voiceId: string = DEFAULT_VOICE_ID
): Promise<HTMLAudioElement> => {
  try {
    console.log(`Converting to speech: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
    
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.75
        }
      })
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('ElevenLabs API key is invalid or expired');
      }
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }
    
    // Create an audio element to play the response
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    // Play the audio
    await audio.play();
    
    // Clean up the blob URL when the audio is done playing
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
    };
    
    return audio;
  } catch (err) {
    console.error('Error in ElevenLabs text-to-speech:', err);
    throw err;
  }
};

/**
 * Stop the currently playing audio
 * @param audio - The audio element to stop
 */
export const stopSpeaking = (audio: HTMLAudioElement | null): void => {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
};
