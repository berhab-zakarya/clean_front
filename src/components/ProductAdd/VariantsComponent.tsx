import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useProduct } from '@/hooks/useProduct';

interface Option {
  id: string;
  name: string;
  values: string[];
  attributeId?: number;
  valueIds?: number[];
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
  const { createAttribute, addAttributeValues, loading, error } = useProduct();

  const handleAddOption = async () => {
    if (newOptionName.trim() === '') return;
    
    let values = newOptionValues.split(',')
      .map(value => value.trim())
      .filter(value => value !== '');
    
    if (values.length === 0) {
      values = ['Default'];
    }

    try {
      // 1. Create the attribute with all required fields
      const attributeData = {
        name: newOptionName.trim(),
        slug: newOptionName.trim().toLowerCase().replace(/\s+/g, '-'),
        description: `Attribute for ${newOptionName.trim()}`
      };
      
      console.log('Creating attribute:', attributeData);
      const attribute = await createAttribute(attributeData);
      if (!attribute) {
        throw new Error('Failed to create attribute');
      }
      console.log('Attribute created:', attribute);

      // 2. Add attribute values
      console.log('Adding attribute values:', { attributeId: attribute.id, values });
      const attributeValues = await addAttributeValues(attribute.id, values);
      if (!attributeValues) {
        throw new Error('Failed to add attribute values');
      }
      console.log('Attribute values added:', attributeValues);

      // 3. Create the option with attribute and value IDs
      const newOption: Option = {
        id: `option-${Math.abs(Date.now())}`,
        name: newOptionName.trim(),
        values: values,
        attributeId: attribute.id,
        valueIds: attributeValues.map(v => v.id)
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
      
      toast.success('Option added successfully');
    } catch (error) {
      console.error('Error adding option:', error);
      if (error instanceof Error) {
        toast.error(`Failed to add option: ${error.message}`);
      } else {
        toast.error('Failed to add option. Please try again.');
      }
    }
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
            <span className='text-[16px] text-[var(--primary-900)]'>Add new option</span>
          </button>
        ) : (
          <div className="p-5 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-base font-medium text-gray-700 mb-4">Add Option</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="optionName" className="block text-sm font-medium text-gray-600 mb-2">
                  Option Name
                </label>
                <input
                  type="text"
                  id="optionName"
                  placeholder="Enter option name (e.g., Size, Color, Material)"
                  value={newOptionName}
                  onChange={(e) => setNewOptionName(e.target.value)}
                  className="block w-full p-3 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm transition-colors"
                />
              </div>
              
              <div>
                <label htmlFor="optionValues" className="block text-sm font-medium text-gray-600 mb-2">
                  Option Values (comma separated)
                </label>
                <input
                  type="text"
                  id="optionValues"
                  placeholder="Enter values separated by commas (e.g., Small, Medium, Large)"
                  value={newOptionValues}
                  onChange={(e) => setNewOptionValues(e.target.value)}
                  className="block w-full p-3 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm transition-colors"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddOption(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="px-4 py-2 bg-[#1E3A8A] text-white rounded-md text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Option'}
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