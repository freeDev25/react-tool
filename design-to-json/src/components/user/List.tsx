import { useNode, useEditor } from '@craftjs/core';

interface ListProps {
  tag?: 'ul' | 'ol';
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const List = ({ tag = 'ul', children, style }: ListProps) => {
  const { connectors: { connect, drag } } = useNode();
  const Component = tag;

  return (
    <Component
      ref={(ref: any) => {
          if (ref) {
              connect(drag(ref));
          }
      }}
      style={{ 
          paddingLeft: '20px',
          listStyleType: tag === 'ul' ? 'disc' : 'decimal',
          ...style 
      }}
    >
      {children}
    </Component>
  );
};

export const ListSettings = () => {
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
        <label className="text-xs text-gray-500">List Type</label>
        <select
            value={props.tag}
            onChange={(e) => {
                const value = e.target.value;
                setProp(id, (props: any) => props.tag = value);
            }}
            className="w-full px-2 py-1 text-sm border border-gray-200 rounded bg-white"
        >
            <option value="ul">Unordered</option>
            <option value="ol">Ordered</option>
        </select>
      </div>
    </div>
  );
};

List.craft = {
  displayName: 'List',
  props: {
    tag: 'ul'
  },
  related: {
    settings: ListSettings
  }
};

interface ListItemProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const ListItem = ({ children, style }: ListItemProps) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <li
      ref={(ref: HTMLLIElement | null) => {
          if (ref) {
              connect(drag(ref));
          }
      }}
      style={style}
    >
      {children}
    </li>
  );
};

ListItem.craft = {
  displayName: 'ListItem',
  props: {}
};
