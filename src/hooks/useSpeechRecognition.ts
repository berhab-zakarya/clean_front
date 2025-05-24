import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSpeechRecognitionOptions {
  language?: string;
  onResult?: (text: string) => void;
  onError?: (error: string) => void;
  onStatusChange?: (status: string) => void;
}

interface UseSpeechRecognitionReturn {
  transcript: string;
  status: string;
  isListening: boolean;
  startListening: () => Promise<void>;
  stopListening: () => void;
  resetTranscript: () => void;
}

export const useSpeechRecognition = ({
  language = 'en-US',
  onResult,
  onError,
  onStatusChange,
}: UseSpeechRecognitionOptions = {}): UseSpeechRecognitionReturn => {
  const [transcript, setTranscript] = useState<string>('');
  const [status, setStatus] = useState<string>('Click to start speaking...');
  const [isListening, setIsListening] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  // Update external status handler when status changes
  useEffect(() => {
    if (onStatusChange) {
      onStatusChange(status);
    }
  }, [status, onStatusChange]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = language;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.continuous = false;

        recognition.onstart = () => {
          setIsListening(true);
          setStatus('🎙️ Listening...');
        };

        recognition.onend = () => {
          setIsListening(false);
          setStatus('Click to start speaking...');
        };

        recognition.onerror = (event: any) => {
          const errorMessage = `❌ Error: ${event.error}`;
          setStatus(errorMessage);
          if (onError) {
            onError(errorMessage);
          }
        };

        recognition.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          setTranscript(text);
          setStatus('✅ Received voice command');
          
          if (onResult) {
            onResult(text);
          }
        };

        recognitionRef.current = recognition;
      } else {
        const errorMessage = 'Speech recognition not supported in this browser.';
        setStatus(errorMessage);
        if (onError) {
          onError(errorMessage);
        }
      }
    }

    // Cleanup function
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors when stopping an already stopped recognition
        }
      }
    };
  }, [language, onError, onResult]);

  const requestMicrophonePermission = async (): Promise<boolean> => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      return true;
    } catch (err) {
      const errorMessage = 'Please allow microphone access to continue.';
      setStatus(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
      return false;
    }
  };

  const startListening = useCallback(async () => {
    if (isListening) {
      stopListening();
      return;
    }
    
    const hasPermission = await requestMicrophonePermission();
    if (hasPermission && recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        // Handle the case where recognition is already started
        console.error('Failed to start speech recognition:', err);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (err) {
        console.error('Failed to stop speech recognition:', err);
      }
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    transcript,
    status,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
  };
};

export default useSpeechRecognition;