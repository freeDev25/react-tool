import React from 'react';
import { DimensionInput } from './DimensionInput';
import type { StyleSectionProps } from './types';

export function TypographySection({ currentStyles, onStyleChange }: StyleSectionProps) {
  const handleChange = (key: string, value: string) => {
    onStyleChange({ [key]: value });
  };

  const getStyle = (key: keyof React.CSSProperties, defaultValue: string = '') => {
    return (currentStyles[key] as string) || defaultValue;
  };

  return (
    <div className="space-y-4">
      {/* Font Size & Weight */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Size</label>
          <DimensionInput
            placeholder="16px"
            value={getStyle('fontSize')}
            onChange={(val) => handleChange('fontSize', val)}
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Weight</label>
          <select 
            value={getStyle('fontWeight', '400')}
            onChange={(e) => handleChange('fontWeight', e.target.value)}
            className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-blue-500 bg-white"
          >
            <option value="100">Thin (100)</option>
            <option value="300">Light (300)</option>
            <option value="400">Regular (400)</option>
            <option value="500">Medium (500)</option>
            <option value="600">Semi Bold (600)</option>
            <option value="700">Bold (700)</option>
            <option value="900">Black (900)</option>
          </select>
        </div>
      </div>

      {/* Text Align & Color */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Align</label>
          <select 
            value={getStyle('textAlign', 'left')}
            onChange={(e) => handleChange('textAlign', e.target.value)}
            className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-blue-500 bg-white"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
            <option value="justify">Justify</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Color</label>
           <div className="flex items-center gap-2">
             <div className="w-6 h-6 rounded border border-gray-200 overflow-hidden shrink-0">
               <input 
                 type="color" 
                 className="w-[150%] h-[150%] -m-[25%] p-0 border-0 cursor-pointer"
                 value={getStyle('color', '#000000')}
                 onChange={(e) => handleChange('color', e.target.value)}
               />
             </div>
             <input 
               type="text" 
               className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-blue-500 min-w-0"
               placeholder="#000000"
               value={getStyle('color')}
               onChange={(e) => handleChange('color', e.target.value)}
             />
          </div>
        </div>
      </div>
    </div>
  );
}
