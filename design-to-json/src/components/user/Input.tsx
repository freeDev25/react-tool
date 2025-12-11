import { useNode, useEditor } from '@craftjs/core';

interface InputProps {
  type?: string;
  placeholder?: string;
  style?: React.CSSProperties;
}

export const Input = ({ type = 'text', placeholder, style }: InputProps) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <input
      ref={(ref: HTMLInputElement | null) => {
          if (ref) {
              connect(drag(ref));
          }
      }}
      type={type}
      placeholder={placeholder}
      style={{ 
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          width: '100%',
          ...style 
      }}
    />
  );
};

export const InputSettings = () => {
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
        <label className="text-xs text-gray-500">Type</label>
        <select
            value={props.type}
            onChange={(e) => {
                const value = e.target.value;
                setProp(id, (props: any) => props.type = value);
            }}
            className="w-full px-2 py-1 text-sm border border-gray-200 rounded bg-white"
        >
            <option value="text">Text</option>
            <option value="password">Password</option>
            <option value="email">Email</option>
            <option value="number">Number</option>
            <option value="date">Date</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Placeholder</label>
        <input 
            type="text" 
            value={props.placeholder} 
            onChange={(e) => {
                const value = e.target.value;
                setProp(id, (props: any) => props.placeholder = value);
            }}
            className="w-full px-2 py-1 text-sm border border-gray-200 rounded"
        />
      </div>
    </div>
  );
};

Input.craft = {
  displayName: 'Input',
  props: {
    type: 'text',
    placeholder: 'Enter text...'
  },
  related: {
    settings: InputSettings
  }
};
