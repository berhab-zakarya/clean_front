import { ChevronDown, ChevronUp } from 'lucide-react';
import { SetupSection as SetupSectionType } from '../types';

interface SetupSectionProps {
  section: SetupSectionType;
  isExpanded: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}

export function SetupSection({ section, isExpanded, onToggle, children }: SetupSectionProps) {
  return (
    <div className="border border-gray-200 rounded-lg mb-4">
      <div 
        className="flex justify-between items-center p-4 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center">
          <div className="w-5 h-5 rounded-full border border-gray-300 mr-3"></div>
          <h2 className="text-xl font-semibold">{section.title}</h2>
        </div>
        {isExpanded ? <ChevronUp /> : <ChevronDown />}
      </div>
      
      {isExpanded && children && (
        <div className="p-4 pt-0 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
}