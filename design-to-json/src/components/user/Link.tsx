import { useNode, useEditor } from '@craftjs/core';

interface LinkProps {
  href?: string;
  target?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const Link = ({ href = '#', target, children, style }: LinkProps) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <a
      ref={(ref: HTMLAnchorElement | null) => {
          if (ref) {
              connect(drag(ref));
          }
      }}
      href={href}
      target={target}
      style={{ 
          color: '#007bff',
          textDecoration: 'none',
          cursor: 'pointer',
          ...style 
      }}
      onClick={(e) => e.preventDefault()} // Prevent navigation in editor
    >
      {children}
    </a>
  );
};

export const LinkSettings = () => {
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
        <label className="text-xs text-gray-500">URL</label>
        <input 
            type="text" 
            value={props.href} 
            onChange={(e) => {
                const value = e.target.value;
                setProp(id, (props: any) => props.href = value);
            }}
            className="w-full px-2 py-1 text-sm border border-gray-200 rounded"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Target</label>
        <select
            value={props.target}
            onChange={(e) => {
                const value = e.target.value;
                setProp(id, (props: any) => props.target = value);
            }}
            className="w-full px-2 py-1 text-sm border border-gray-200 rounded bg-white"
        >
            <option value="_self">Same Tab</option>
            <option value="_blank">New Tab</option>
        </select>
      </div>
    </div>
  );
};

Link.craft = {
  displayName: 'Link',
  props: {
    href: '#',
    target: '_self'
  },
  related: {
    settings: LinkSettings
  }
};
