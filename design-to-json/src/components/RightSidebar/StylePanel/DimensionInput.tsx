import type { DimensionInputProps } from './types';

export const UNITS = ['px', '%', 'rem', 'em', 'vh', 'vw', 'auto'];

export function DimensionInput({ value, onChange, placeholder }: DimensionInputProps) {
  const getParts = (val: string) => {
    if (!val) return { num: '', unit: 'px' };
    if (val === 'auto') return { num: '', unit: 'auto' };
    
    const match = val.match(/^([0-9.-]*)(.*)$/);
    if (match) {
      return { num: match[1], unit: match[2] || 'px' };
    }
    return { num: val, unit: 'px' };
  };

  const { num, unit } = getParts(value);

  const handleNumChange = (newNum: string) => {
    if (unit === 'auto') {
       if (newNum) onChange(`${newNum}px`);
       else onChange('');
    } else {
       onChange(`${newNum}${unit}`);
    }
  };

  const handleUnitChange = (newUnit: string) => {
    if (newUnit === 'auto') {
      onChange('auto');
    } else {
      const n = num || '0';
      onChange(`${n}${newUnit}`);
    }
  };

  return (
    <div className="flex items-center border border-gray-200 rounded focus-within:border-blue-500 bg-white overflow-hidden">
      <input
        type="text"
        className="w-full px-2 py-1 text-xs border-none focus:outline-none bg-transparent min-w-0"
        placeholder={placeholder}
        value={unit === 'auto' ? 'auto' : num}
        onChange={(e) => {
            if (unit === 'auto' && e.target.value !== 'auto') {
                onChange(`${e.target.value}px`);
            } else {
                handleNumChange(e.target.value);
            }
        }}
      />
      <select
        value={unit}
        onChange={(e) => handleUnitChange(e.target.value)}
        className="text-[10px] text-gray-500 bg-gray-50 border-l border-gray-200 focus:outline-none px-1 py-1 h-full cursor-pointer hover:text-blue-600 hover:bg-gray-100"
      >
        {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
      </select>
    </div>
  );
}
