import React from 'react';
import type { StyleSectionProps } from './types';

export function BackgroundSection({ currentStyles, onStyleChange }: StyleSectionProps) {
  const handleChange = (key: string, value: string) => {
    onStyleChange({ [key]: value });
  };

  const getStyle = (key: keyof React.CSSProperties, defaultValue: string = '') => {
    return (currentStyles[key] as string) || defaultValue;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
         <div className="w-6 h-6 rounded border border-gray-200 overflow-hidden shrink-0">
           <input 
             type="color" 
             className="w-[150%] h-[150%] -m-[25%] p-0 border-0 cursor-pointer"
             value={getStyle('backgroundColor', '#FFFFFF')}
             onChange={(e) => handleChange('backgroundColor', e.target.value)}
           />
         </div>
         <input 
           type="text" 
           className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-blue-500"
           placeholder="#FFFFFF"
           value={getStyle('backgroundColor')}
           onChange={(e) => handleChange('backgroundColor', e.target.value)}
         />
      </div>
    </div>
  );
}
