import { useNode } from '@craftjs/core';

interface ButtonProps {
  text: string;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

export const Button = ({ text, variant = 'primary' }: ButtonProps) => {
  const { connectors: { connect, drag } } = useNode();

  const bg = variant === 'primary' ? '#3b82f6' : '#6b7280';

  return (
    <button
      ref={(ref: HTMLButtonElement | null) => {
          if (ref) {
              connect(drag(ref));
          }
      }}
      style={{
        padding: '8px 16px',
        backgroundColor: bg,
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      {text}
    </button>
  );
};

import { useEditor } from '@craftjs/core';

export const ButtonSettings = () => {
  const { actions: { setProp }, props, id } = useEditor((state) => {
    const [currentNodeId] = state.events.selected;
    if (currentNodeId) {
        return {
            id: currentNodeId,
            props: state.nodes[currentNodeId].data.props
        }
    }
    return { id: null, props: null };
  });

  if (!props || !id) return null;

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Button Text</label>
        <input 
            type="text" 
            value={props.text} 
            onChange={(e) => {
                const value = e.target.value;
                setProp(id, (props: any) => props.text = value);
            }}
            className="w-full px-2 py-1 text-sm border border-gray-200 rounded"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Variant</label>
        <select
            value={props.variant}
            onChange={(e) => {
                const value = e.target.value;
                setProp(id, (props: any) => props.variant = value);
            }}
            className="w-full px-2 py-1 text-sm border border-gray-200 rounded bg-white"
        >
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
        </select>
      </div>
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
