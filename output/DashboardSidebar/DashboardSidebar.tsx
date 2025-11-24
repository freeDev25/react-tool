import React from 'react';import NavItem from '../NavItem/NavItem';
import './style.css';

interface DashboardSidebarProps {
    userName?: string;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = (props) => {
    return (
        <div className="generated-0">
            <h2 className="generated-1">
                Dashboard
            </h2>
            <NavItem label="Overview" isActive/>
            <NavItem label="Analytics"/>
            <NavItem label="Settings"/>
        </div>
    );
};

export default DashboardSidebar;