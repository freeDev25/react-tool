export interface DimensionInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface SpacingInputProps {
  label: string;
  prefix: 'margin' | 'padding';
  values: Record<string, any>;
  onChange: (key: string, value: string) => void;
}
