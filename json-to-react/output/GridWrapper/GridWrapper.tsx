import React from 'react';

interface GridWrapperProps extends React.PropsWithChildren {}

const GridWrapper: React.FC<GridWrapperProps> = (props) => {
    return (
        <div>
          {props.children}
        </div>
    );
};

export default GridWrapper;