import { SearchIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { microphone, send } from '../../lib/icons/index';
import Image from "next/image";

interface AskAIInputProps {
  onClose: () => void;
  onSubmit?: (value: string) => void;
}

export const AskAIInput: React.FC<AskAIInputProps> = ({ onClose, onSubmit }) => {
  const [inputValue, setInputValue] = useState("");

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
          className="w-full px-3 py-2 pr-20 bg-gray-800 text-white rounded-full border border-gray-700 focus:outline-none focus:border-[#1E3A8A]"
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
            className="p-1 hover:bg-gray-700 rounded"
            onClick={handleSubmit}
          >
           <Image src={microphone} alt="microphone" width={20} height={20} />
          </button>

          <button 
            className="p-1 hover:bg-gray-700 rounded"
          >
              <Image src={send} alt="microphone" width={20} height={20} />
          </button>

          <button 
            className="p-1 hover:bg-gray-700 rounded mr-1"
            onClick={onClose}
          >
            <XIcon className="size-6 text-white " />
          </button>

        </div>
      </div>
    </div>
  );
}; 