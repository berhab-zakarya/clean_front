import { useState, useEffect } from 'react';

interface Option {
  id: string;
  name: string;
  values: string[];
}

interface VariantsComponentProps {
  onAddOption?: (option: Option) => void;
  onRemoveOption?: (optionId: string) => void;
  initialOptions?: Option[];
}

const VariantsComponent = ({
  onAddOption,
  onRemoveOption,
  initialOptions = [],
}: VariantsComponentProps) => {
  const [options, setOptions] = useState<Option[]>(initialOptions);
  const [showAddOption, setShowAddOption] = useState(false);
  const [newOptionName, setNewOptionName] = useState('');
  const [newOptionValues, setNewOptionValues] = useState('');

  // Predefined options for size and color
  const predefinedOptions = {
    size: ['S', 'M', 'L', 'XL'],
    color: ['White', 'Black', 'Red']
  };

  const handleAddOption = () => {
    if (newOptionName.trim() === '') return;
    
    const optionName = newOptionName.trim().toLowerCase();
    let values: string[] = [];
    
    // Use predefined values if it's a size or color option
    if (optionName === 'size') {
      values = predefinedOptions.size;
    } else if (optionName === 'color') {
      values = predefinedOptions.color;
    } else {
      values = newOptionValues.split(',')
        .map(value => value.trim())
        .filter(value => value !== '');
    }
    
    if (values.length === 0) {
      values = ['Default'];
    }
    
    const newOption: Option = {
      id: `option-${Math.abs(Date.now())}`,
      name: optionName,
      values: values,
    };
    
    const updatedOptions = [...options, newOption];
    setOptions(updatedOptions);
    
    if (onAddOption) {
      onAddOption(newOption);
    }
    
    // Reset form
    setNewOptionName('');
    setNewOptionValues('');
    setShowAddOption(false);
  };

  const handleRemoveOption = (optionId: string) => {
    const updatedOptions = options.filter(option => option.id !== optionId);
    setOptions(updatedOptions);
    
    if (onRemoveOption) {
      onRemoveOption(optionId);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-gray-800">Variants</h2>
        
        {options.length > 0 && (
          <div className="space-y-4">
            {options.map(option => (
              <div 
                key={option.id} 
                className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-gray-700">{option.name}</span>
                  <button 
                    onClick={() => handleRemoveOption(option.id)}
                    className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {option.values.map((value, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-sm rounded-md shadow-sm"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!showAddOption ? (
          <button
            type="button"
            onClick={() => setShowAddOption(true)}
            className="flex items-center text-[var(--primary-900)] hover:text-blue-800 font-medium p-2 rounded-md hover:bg-blue-50 transition-colors"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="mr-2"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span className='text-[16px] text-[var(--primary-900)]'>Add options like size or color</span>
          </button>
        ) : (
          <div className="p-5 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-base font-medium text-gray-700 mb-4">Add Option</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="optionName" className="block text-sm font-medium text-gray-600 mb-2">
                  Option Name
                </label>
                <select
                  id="optionName"
                  value={newOptionName}
                  onChange={(e) => setNewOptionName(e.target.value)}
                  className="block w-full p-3 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm transition-colors"
                >
                  <option value="">Select an option</option>
                  <option value="size">Size</option>
                  <option value="color">Color</option>
                </select>
              </div>
              
              {newOptionName && !['size', 'color'].includes(newOptionName.toLowerCase()) && (
                <div>
                  <label htmlFor="optionValues" className="block text-sm font-medium text-gray-600 mb-2">
                    Option Values (comma separated)
                  </label>
                  <input
                    type="text"
                    id="optionValues"
                    placeholder="Small, Medium, Large"
                    value={newOptionValues}
                    onChange={(e) => setNewOptionValues(e.target.value)}
                    className="block w-full p-3 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm transition-colors"
                  />
                </div>
              )}
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddOption(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                >
                  Add Option
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VariantsComponent;