import React, { useState } from 'react';
import { DimensionInput } from './DimensionInput';
import { SpacingInput } from './SpacingInput';

export default function StylePanel() {
  const [styles, setStyles] = useState<Record<string, any>>({
    width: '',
    height: '',
    display: 'block',
    flexDirection: 'row',
    alignItems: 'start',
    justifyContent: 'start',
    gap: '0px',
    backgroundColor: '#FFFFFF',
    borderColor: '#000000',
    borderWidth: '',
    borderRadius: '',
    borderStyle: 'solid'
  });

  const handleChange = (key: string, value: string) => {
    setStyles(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4 p-2">
      {/* Dimensions */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Width</label>
          <DimensionInput
            placeholder="auto"
            value={styles.width}
            onChange={(val) => handleChange('width', val)}
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Height</label>
          <DimensionInput
            placeholder="auto"
            value={styles.height}
            onChange={(val) => handleChange('height', val)}
          />
        </div>
      </div>

      {/* Display */}
      <div>
        <label className="text-xs text-gray-500 block mb-1">Display</label>
        <select 
          value={styles.display}
          onChange={(e) => handleChange('display', e.target.value)}
          className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-blue-500 bg-white"
        >
          <option value="block">Block</option>
          <option value="flex">Flex</option>
          <option value="grid">Grid</option>
          <option value="inline-block">Inline Block</option>
          <option value="none">None</option>
        </select>
      </div>

      {/* Flex Settings */}
      {styles.display === 'flex' && (
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <label className="text-xs text-gray-500 block font-medium">Flex Layout</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-gray-400 block mb-0.5">Direction</label>
              <select 
                value={styles.flexDirection}
                onChange={(e) => handleChange('flexDirection', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="row">Row</option>
                <option value="column">Column</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-gray-400 block mb-0.5">Align</label>
              <select 
                value={styles.alignItems}
                onChange={(e) => handleChange('alignItems', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="start">Start</option>
                <option value="center">Center</option>
                <option value="end">End</option>
                <option value="stretch">Stretch</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-[10px] text-gray-400 block mb-0.5">Justify</label>
              <select 
                value={styles.justifyContent}
                onChange={(e) => handleChange('justifyContent', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="start">Start</option>
                <option value="center">Center</option>
                <option value="end">End</option>
                <option value="between">Space Between</option>
                <option value="around">Space Around</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-[10px] text-gray-400 block mb-0.5">Gap</label>
              <DimensionInput
                placeholder="0px"
                value={styles.gap}
                onChange={(val) => handleChange('gap', val)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Margin & Padding */}
      <div className="space-y-2">
        <label className="text-xs text-gray-500 block font-medium">Spacing</label>
        <div className="space-y-2">
          <SpacingInput label="Margin" prefix="margin" values={styles} onChange={handleChange} />
          <SpacingInput label="Padding" prefix="padding" values={styles} onChange={handleChange} />
        </div>
      </div>

      {/* Background */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <label className="text-xs text-gray-500 block font-medium">Background</label>
        <div className="flex items-center gap-2">
           <div className="w-6 h-6 rounded border border-gray-200 overflow-hidden shrink-0">
             <input 
               type="color" 
               className="w-[150%] h-[150%] -m-[25%] p-0 border-0 cursor-pointer"
               value={styles.backgroundColor}
               onChange={(e) => handleChange('backgroundColor', e.target.value)}
             />
           </div>
           <input 
             type="text" 
             className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-blue-500"
             placeholder="#FFFFFF"
             value={styles.backgroundColor}
             onChange={(e) => handleChange('backgroundColor', e.target.value)}
           />
        </div>
      </div>

      {/* Border */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <label className="text-xs text-gray-500 block font-medium">Border</label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-gray-400 block mb-0.5">Width</label>
             <DimensionInput
               placeholder="0px"
               value={styles.borderWidth}
               onChange={(val) => handleChange('borderWidth', val)}
             />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 block mb-0.5">Radius</label>
             <DimensionInput
               placeholder="0px"
               value={styles.borderRadius}
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
                  value={styles.borderColor}
                  onChange={(e) => handleChange('borderColor', e.target.value)}
                />
              </div>
              <input 
                type="text" 
                className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-blue-500"
                placeholder="#000000"
                value={styles.borderColor}
                onChange={(e) => handleChange('borderColor', e.target.value)}
              />
            </div>
          </div>
           <div className="col-span-2">
            <label className="text-[10px] text-gray-400 block mb-0.5">Style</label>
            <select 
              value={styles.borderStyle}
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
      </div>
    </div>
  );
}
