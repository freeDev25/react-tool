import { useNode } from '@craftjs/core';

interface TextProps {
  text: string;
  fontSize?: string;
  color?: string;
}

export const Text = ({ text, fontSize = '16px', color = '#333' }: TextProps) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <p
      ref={(ref: HTMLParagraphElement | null) => {
          if (ref) {
              connect(drag(ref));
          }
      }}
      style={{ fontSize, color, margin: 0 }}
    >
      {text}
    </p>
  );
};

import { useEditor } from '@craftjs/core';

export const TextSettings = () => {
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
        <label className="text-xs text-gray-500">Text Content</label>
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
        <label className="text-xs text-gray-500">Font Size</label>
        <input 
            type="text" 
            value={props.fontSize} 
            onChange={(e) => {
                const value = e.target.value;
                setProp(id, (props: any) => props.fontSize = value);
            }}
            className="w-full px-2 py-1 text-sm border border-gray-200 rounded"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Color</label>
        <div className="flex items-center gap-2">
            <input 
                type="color" 
                value={props.color} 
                onChange={(e) => {
                    const value = e.target.value;
                    setProp(id, (props: any) => props.color = value);
                }}
                className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
            />
            <span className="text-xs text-gray-400">{props.color}</span>
        </div>
      </div>
    </div>
  );
};

Text.craft = {
  displayName: 'Text',
  props: {
    text: 'Hi world',
    fontSize: '16px',
    color: '#333'
  },
  related: {
    settings: TextSettings
  }
};
