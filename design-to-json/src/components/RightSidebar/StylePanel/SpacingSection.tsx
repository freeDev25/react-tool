import { SpacingInput } from './SpacingInput';
import type { StyleSectionProps } from './types';

export function SpacingSection({ currentStyles, onStyleChange }: StyleSectionProps) {
  const handleChange = (key: string, value: string) => {
    onStyleChange({ [key]: value });
  };

  return (
    <div className="space-y-2">
      <SpacingInput label="Margin" prefix="margin" values={currentStyles as Record<string, any>} onChange={handleChange} />
      <SpacingInput label="Padding" prefix="padding" values={currentStyles as Record<string, any>} onChange={handleChange} />
    </div>
  );
}
