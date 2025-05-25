import { SearchIcon, XIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { microphone, send } from '../../lib/icons/index';
import Image from "next/image";

interface AskAIInputProps {
  onClose: () => void;
  onSubmit?: (value: string) => void;
}

export const AskAIInput: React.FC<AskAIInputProps> = ({ onClose, onSubmit }) => {
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Check for Web Speech API support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputValue(prev => prev + (prev ? ' ' : '') + transcript);
        };

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleVoiceInput = () => {
    if (!speechSupported || !recognitionRef.current) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleSubmit = () => {
    if (inputValue.trim() && onSubmit) {
      onSubmit(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <div className="sticky top-0 z-10 flex-none bg-gray-900 border-b border-gray-800 p-2">
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask AI to enhance UI..."
          className="w-full px-3 py-2 pr-32 bg-gray-800 text-white rounded-full border border-gray-700 focus:outline-none focus:border-[#1E3A8A]"
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              onClose();
            } else if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <button 
            className={`p-1 hover:bg-gray-700 rounded transition-colors ${
              isListening ? 'bg-red-600 animate-pulse' : ''
            }`}
            onClick={handleVoiceInput}
            disabled={!speechSupported}
            title={isListening ? "Stop listening" : "Start voice input"}
          >
            <Image 
              src={microphone} 
              alt="microphone" 
              width={20} 
              height={20}
              className={isListening ? 'opacity-100' : 'opacity-70'}
            />
          </button>

          <button 
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            onClick={handleSubmit}
            disabled={!inputValue.trim()}
            title="Send message"
          >
            <Image 
              src={send} 
              alt="send" 
              width={20} 
              height={20}
              className={inputValue.trim() ? 'opacity-100' : 'opacity-50'}
            />
          </button>

          <button 
            className="p-1 hover:bg-gray-700 rounded mr-1 transition-colors"
            onClick={onClose}
            title="Close"
          >
            <XIcon className="size-6 text-white" />
          </button>
        </div>
      </div>
      
      {isListening && (
        <div className="text-xs text-blue-400 mt-1 px-3">
          Listening... Speak now
        </div>
      )}
      
      {!speechSupported && (
        <div className="text-xs text-yellow-400 mt-1 px-3">
          Voice input not supported in this browser
        </div>
      )}
    </div>
  );
};