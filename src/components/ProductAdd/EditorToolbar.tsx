import { useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  Code,
  MoreHorizontal,
  ChevronDown,
  List,
  ListOrdered,
  Sparkles
} from 'lucide-react';

export default function ShopifyEditor() {
  const [content, setContent] = useState('');
  const [mode, setMode] = useState('visual'); // visual or html
  const [isFormatMenuOpen, setIsFormatMenuOpen] = useState(false);
  const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);
  const [isAlignMenuOpen, setIsAlignMenuOpen] = useState(false);

  const headingOptions = [
    { label: 'Paragraph', value: 'p' },
    { label: 'Heading 1', value: 'h1' },
    { label: 'Heading 2', value: 'h2' },
    { label: 'Heading 3', value: 'h3' },
    { label: 'Heading 4', value: 'h4' },
    { label: 'Heading 5', value: 'h5' },
    { label: 'Heading 6', value: 'h6' },
  ];

  const [selectedFormat, setSelectedFormat] = useState(headingOptions[0]);

  const handleFormatChange = (option) => {
    setSelectedFormat(option);
    setIsFormatMenuOpen(false);
    // Apply the formatting to the selected text
    document.execCommand('formatBlock', false, option.value);
  };

  const handleBold = () => {
    document.execCommand('bold', false, null);
  };

  const handleItalic = () => {
    document.execCommand('italic', false, null);
  };

  const handleUnderline = () => {
    document.execCommand('underline', false, null);
  };

  const handleAlignment = (align) => {
    document.execCommand(`justify${align}`, false, null);
    setIsAlignMenuOpen(false);
  };

  return (

      <div className="bg-white">
        {/* Toolbar */}
        <div className="border-b border-gray-200 bg-white px-2 py-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* Magic Button */}
              <div className="pr-2 border-r border-gray-200 mr-2">
                <button 
                  className="inline-flex items-center rounded p-1 hover:bg-gray-100"
                  aria-label="Generate text"
                >
                  <Sparkles size={16} className="mr-1" />
                  <ChevronDown size={12} />
                </button>
              </div>

              {/* Format dropdown */}
              <div className="pr-2 relative">
                <button 
                  className="inline-flex items-center rounded p-1 hover:bg-gray-100"
                  aria-label="Format options"
                  onClick={() => setIsFormatMenuOpen(!isFormatMenuOpen)}
                >
                  <span className="mr-1 text-sm">{selectedFormat.label}</span>
                  <ChevronDown size={12} />
                </button>
                
                {isFormatMenuOpen && (
                  <div className="absolute z-10 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg">
                    <ul className="py-1">
                      {headingOptions.map((option) => (
                        <li
                          key={option.value}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          onClick={() => handleFormatChange(option)}
                        >
                          {option.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Text formatting */}
              <div className="flex items-center space-x-1 border-r border-gray-200 pr-2">
                <button 
                  className="p-1 rounded hover:bg-gray-100" 
                  aria-label="Bold"
                  onClick={handleBold}
                >
                  <Bold size={16} />
                </button>
                <button 
                  className="p-1 rounded hover:bg-gray-100" 
                  aria-label="Italic"
                  onClick={handleItalic}
                >
                  <Italic size={16} />
                </button>
                <button 
                  className="p-1 rounded hover:bg-gray-100" 
                  aria-label="Underline"
                  onClick={handleUnderline}
                >
                  <Underline size={16} />
                </button>
                <button className="inline-flex items-center p-1 rounded hover:bg-gray-100" aria-label="Text Color">
                  <span className="text-sm font-bold mr-1">A</span>
                  <ChevronDown size={12} />
                </button>
              </div>

              {/* Alignment */}
              <div className="flex items-center border-r border-gray-200 pr-2 relative">
                <button 
                  className="inline-flex items-center p-1 rounded hover:bg-gray-100" 
                  aria-label="Alignment"
                  onClick={() => setIsAlignMenuOpen(!isAlignMenuOpen)}
                >
                  <AlignLeft size={16} className="mr-1" />
                  <ChevronDown size={12} />
                </button>
                
                {isAlignMenuOpen && (
                  <div className="absolute z-10 mt-1 top-full left-0 w-32 bg-white border border-gray-200 rounded-md shadow-lg">
                    <ul className="py-1">
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => handleAlignment('Left')}>
                        Left
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => handleAlignment('Center')}>
                        Center
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => handleAlignment('Right')}>
                        Right
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => handleAlignment('Full')}>
                        Justify
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* More options dropdown */}
              <button className="p-1 rounded hover:bg-gray-100" aria-label="More controls">
                <MoreHorizontal size={16} />
              </button>
            </div>

            {/* HTML view toggle */}
            <button 
              className="p-1 rounded hover:bg-gray-100" 
              aria-label="Show HTML Code"
              onClick={() => setMode(mode === 'visual' ? 'html' : 'visual')}
            >
              <Code size={16} />
            </button>
          </div>
        </div>

        {/* Editor content area */}
        {mode === 'visual' ? (
          <div 
            className="p-4 min-h-32 focus:outline-none" 
            contentEditable={true}
            suppressContentEditableWarning={true}
            id="product-description"
            aria-label="Rich Text Area"
            onInput={(e) => setContent((e.target as HTMLDivElement).innerHTML)}
          >
            {content}
          </div>
        ) : (
          <textarea
            id="product-description-html"
            className="p-4 w-full min-h-32 font-mono text-sm"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        )}
      </div>
   
  );
}