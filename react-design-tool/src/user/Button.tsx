import { useNode } from '@craftjs/core';

interface ButtonProps {
  text: string;
  variant?: 'primary' | 'secondary';
}

export const Button = ({ text, variant = 'primary' }: ButtonProps) => {
  const { connectors: { connect, drag } } = useNode();

  const bg = variant === 'primary' ? 'bg-blue-600' : 'bg-gray-600';

  return (
    <button 
      ref={(ref: HTMLButtonElement | null) => {
        if (ref) {
          connect(drag(ref));
        }
      }}
      className={`px-4 py-2 text-white rounded ${bg}`}
    >
      {text}
    </button>
  );
};

export const ButtonSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props
  }));

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-500">Text</label>
      <input 
        type="text" 
        value={props.text} 
        onChange={(e) => setProp((props: any) => props.text = e.target.value)}
        className="w-full border border-gray-300 rounded px-2 py-1"
      />
      <label className="text-sm text-gray-500">Variant</label>
      <select
        value={props.variant}
        onChange={(e) => setProp((props: any) => props.variant = e.target.value)}
        className="w-full border border-gray-300 rounded px-2 py-1"
      >
        <option value="primary">Primary</option>
        <option value="secondary">Secondary</option>
      </select>
    </div>
  );
};

Button.craft = {
  displayName: 'Button',
  props: {
    text: 'Click me',
    variant: 'primary'
  },
  related: {
    settings: ButtonSettings
  }
};
