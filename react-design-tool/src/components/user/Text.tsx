import { useNode } from '@craftjs/core';

interface TextProps {
  text: string;
  fontSize?: string;
}

export const Text = ({ text, fontSize = '16px' }: TextProps) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div 
      ref={(ref: HTMLDivElement | null) => {
        if (ref) {
          connect(drag(ref));
        }
      }}
      style={{ fontSize }}
    >
      {text}
    </div>
  );
};

export const TextSettings = () => {
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
      <label className="text-sm text-gray-500">Font Size</label>
      <input 
        type="text" 
        value={props.fontSize} 
        onChange={(e) => setProp((props: any) => props.fontSize = e.target.value)}
        className="w-full border border-gray-300 rounded px-2 py-1"
      />
    </div>
  );
};

Text.craft = {
  displayName: 'Text',
  props: {
    text: 'Hi world',
    fontSize: '16px'
  },
  related: {
    settings: TextSettings
  }
};
