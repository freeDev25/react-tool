import { useState } from 'react';
import type { SpacingInputProps } from './types';
import { DimensionInput } from './DimensionInput';

export function SpacingInput({ label, prefix, values, onChange }: SpacingInputProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (suffix: string, value: string) => {
    const key = suffix ? `${prefix}${suffix}` : prefix;
    onChange(key, value);
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-[10px] text-gray-400">{label}</label>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[10px] text-blue-500 hover:text-blue-600"
          title={isExpanded ? "Switch to single value" : "Switch to individual sides"}
        >
          {isExpanded ? 'Single' : 'Sides'}
        </button>
      </div>
      
      {isExpanded ? (
        <div className="grid grid-cols-2 gap-1">
          <DimensionInput 
            placeholder="T" 
            value={values[`${prefix}Top`] || ''}
            onChange={(val) => handleChange('Top', val)}
          />
          <DimensionInput 
            placeholder="R" 
            value={values[`${prefix}Right`] || ''}
            onChange={(val) => handleChange('Right', val)}
          />
          <DimensionInput 
            placeholder="B" 
            value={values[`${prefix}Bottom`] || ''}
            onChange={(val) => handleChange('Bottom', val)}
          />
          <DimensionInput 
            placeholder="L" 
            value={values[`${prefix}Left`] || ''}
            onChange={(val) => handleChange('Left', val)}
          />
        </div>
      ) : (
        <DimensionInput
          placeholder="All"
          value={values[prefix] || ''}
          onChange={(val) => handleChange('', val)}
        />
      )}
    </div>
  );
}
