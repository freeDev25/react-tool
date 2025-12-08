import React from 'react';
import { DimensionInput } from './DimensionInput';
import type { StyleSectionProps } from './types';

export function BorderSection({ currentStyles, onStyleChange }: StyleSectionProps) {
  const handleChange = (key: string, value: string) => {
    onStyleChange({ [key]: value });
  };

  const getStyle = (key: keyof React.CSSProperties, defaultValue: string = '') => {
    return (currentStyles[key] as string) || defaultValue;
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <div>
        <label className="text-[10px] text-gray-400 block mb-0.5">Width</label>
         <DimensionInput
           placeholder="0px"
           value={getStyle('borderWidth')}
           onChange={(val) => handleChange('borderWidth', val)}
         />
      </div>
      <div>
        <label className="text-[10px] text-gray-400 block mb-0.5">Radius</label>
         <DimensionInput
           placeholder="0px"
           value={getStyle('borderRadius')}
           onChange={(val) => handleChange('borderRadius', val)}
         />
      </div>
       <div className="col-span-2">
        <label className="text-[10px] text-gray-400 block mb-0.5">Color</label>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded border border-gray-200 overflow-hidden shrink-0">
            <input 
              type="color" 
              className="w-[150%] h-[150%] -m-[25%] p-0 border-0 cursor-pointer"
              value={getStyle('borderColor', '#000000')}
              onChange={(e) => handleChange('borderColor', e.target.value)}
            />
          </div>
          <input 
            type="text" 
            className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-blue-500"
            placeholder="#000000"
            value={getStyle('borderColor')}
            onChange={(e) => handleChange('borderColor', e.target.value)}
          />
        </div>
      </div>
       <div className="col-span-2">
        <label className="text-[10px] text-gray-400 block mb-0.5">Style</label>
        <select 
          value={getStyle('borderStyle', 'solid')}
          onChange={(e) => handleChange('borderStyle', e.target.value)}
          className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-blue-500 bg-white"
        >
          <option value="solid">Solid</option>
          <option value="dashed">Dashed</option>
          <option value="dotted">Dotted</option>
          <option value="none">None</option>
        </select>
      </div>
    </div>
  );
}
