import React from 'react';
import { DimensionInput } from './DimensionInput';
import { SpacingInput } from './SpacingInput';

interface StylePanelProps {
  currentStyles: React.CSSProperties;
  onStyleChange: (styles: React.CSSProperties) => void;
}

export default function StylePanel({ currentStyles, onStyleChange }: StylePanelProps) {
  const handleChange = (key: string, value: string) => {
    onStyleChange({ [key]: value });
  };

  // Helper to safely get style values
  const getStyle = (key: keyof React.CSSProperties, defaultValue: string = '') => {
    return (currentStyles[key] as string) || defaultValue;
  };

  return (
    <div className="space-y-4 p-2">
      {/* Dimensions */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Width</label>
          <DimensionInput
            placeholder="auto"
            value={getStyle('width')}
            onChange={(val) => handleChange('width', val)}
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Height</label>
          <DimensionInput
            placeholder="auto"
            value={getStyle('height')}
            onChange={(val) => handleChange('height', val)}
          />
        </div>
      </div>

      {/* Display */}
      <div>
        <label className="text-xs text-gray-500 block mb-1">Display</label>
        <select 
          value={getStyle('display', 'block')}
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
      {getStyle('display') === 'flex' && (
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <label className="text-xs text-gray-500 block font-medium">Flex Layout</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-gray-400 block mb-0.5">Direction</label>
              <select 
                value={getStyle('flexDirection', 'row')}
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
                value={getStyle('alignItems', 'start')}
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
                value={getStyle('justifyContent', 'start')}
                onChange={(e) => handleChange('justifyContent', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="start">Start</option>
                <option value="center">Center</option>
                <option value="space-between">Space Between</option>
                <option value="space-around">Space Around</option>
                <option value="space-evenly">Space Evenly</option>
              </select>
            </div>
             <div className="col-span-2">
              <label className="text-[10px] text-gray-400 block mb-0.5">Gap</label>
              <DimensionInput
                placeholder="0px"
                value={getStyle('gap', '0px')}
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
          <SpacingInput label="Margin" prefix="margin" values={currentStyles as Record<string, any>} onChange={handleChange} />
          <SpacingInput label="Padding" prefix="padding" values={currentStyles as Record<string, any>} onChange={handleChange} />
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

      {/* Border */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <label className="text-xs text-gray-500 block font-medium">Border</label>
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
      </div>
    </div>
  );
}
