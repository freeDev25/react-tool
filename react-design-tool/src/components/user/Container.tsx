import { useNode } from '@craftjs/core';

interface ContainerProps {
  background?: string;
  padding?: string;
  children?: React.ReactNode;
}

export const Container = ({ background = '#ffffff', padding = '20px', children }: ContainerProps) => {
  const { connectors: { connect, drag } } = useNode();
  
  return (
    <div 
      ref={(ref: HTMLDivElement | null) => {
        if (ref) {
          connect(drag(ref));
        }
      }}
      style={{ background, padding, border: '1px dashed #ccc', minHeight: '50px' }}
    >
      {children}
    </div>
  );
};

export const ContainerSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props
  }));

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-500">Background</label>
      <input 
        type="color" 
        value={props.background} 
        onChange={(e) => setProp((props: any) => props.background = e.target.value)}
        className="w-full"
      />
      <label className="text-sm text-gray-500">Padding</label>
      <input 
        type="text" 
        value={props.padding} 
        onChange={(e) => setProp((props: any) => props.padding = e.target.value)}
        className="w-full border border-gray-300 rounded px-2 py-1"
      />
    </div>
  );
};

Container.craft = {
  displayName: 'Container',
  props: {
    background: '#ffffff',
    padding: '20px'
  },
  related: {
    settings: ContainerSettings
  }
};
