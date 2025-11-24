import React from 'react';
import './style.css';

interface NavItemProps {
    isActive?: boolean;
    label: string;
}

const NavItem: React.FC<NavItemProps> = (props) => {
    return (
        <div className="navitem-0">
            {props.label}
        </div>
    );
};

export default NavItem;