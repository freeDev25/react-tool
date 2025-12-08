import React from 'react';
import { DimensionInput } from './DimensionInput';
import type { StyleSectionProps } from './types';

export function LayoutSection({ currentStyles, onStyleChange }: StyleSectionProps) {
  const handleChange = (key: string, value: string) => {
    onStyleChange({ [key]: value });
  };

  const getStyle = (key: keyof React.CSSProperties, defaultValue: string = '') => {
    return (currentStyles[key] as string) || defaultValue;
  };

  return (
    <div className="space-y-4">
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
    </div>
  );
}
