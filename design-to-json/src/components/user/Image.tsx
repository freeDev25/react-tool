import { useNode, useEditor } from '@craftjs/core';

interface ImageProps {
  src: string;
  alt?: string;
  width?: string;
  height?: string;
  style?: React.CSSProperties;
}

export const Image = ({ src, alt, width, height, style }: ImageProps) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <img
      ref={(ref: HTMLImageElement | null) => {
          if (ref) {
              connect(drag(ref));
          }
      }}
      src={src}
      alt={alt}
      width={width}
      height={height}
      style={{ ...style, maxWidth: '100%' }}
    />
  );
};

export const ImageSettings = () => {
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
        <label className="text-xs text-gray-500">Source URL</label>
        <input 
            type="text" 
            value={props.src} 
            onChange={(e) => {
                const value = e.target.value;
                setProp(id, (props: any) => props.src = value);
            }}
            className="w-full px-2 py-1 text-sm border border-gray-200 rounded"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Alt Text</label>
        <input 
            type="text" 
            value={props.alt} 
            onChange={(e) => {
                const value = e.target.value;
                setProp(id, (props: any) => props.alt = value);
            }}
            className="w-full px-2 py-1 text-sm border border-gray-200 rounded"
        />
      </div>

      <div className="flex gap-2">
        <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs text-gray-500">Width</label>
            <input 
                type="text" 
                value={props.width} 
                onChange={(e) => {
                    const value = e.target.value;
                    setProp(id, (props: any) => props.width = value);
                }}
                className="w-full px-2 py-1 text-sm border border-gray-200 rounded"
            />
        </div>
        <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs text-gray-500">Height</label>
            <input 
                type="text" 
                value={props.height} 
                onChange={(e) => {
                    const value = e.target.value;
                    setProp(id, (props: any) => props.height = value);
                }}
                className="w-full px-2 py-1 text-sm border border-gray-200 rounded"
            />
        </div>
      </div>
    </div>
  );
};

Image.craft = {
  displayName: 'Image',
  props: {
    src: 'https://via.placeholder.com/150',
    alt: 'Placeholder',
    width: '100%',
    height: 'auto'
  },
  related: {
    settings: ImageSettings
  }
};
