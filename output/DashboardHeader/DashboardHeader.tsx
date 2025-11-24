import React from 'react';
import './style.css';

interface DashboardHeaderProps {
    userName?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = (props) => {
    return (
        <div className="generated-0">
            <div>            </div>
            <div className="generated-1">
                <span>
                    Welcome, {props.userName}
                </span>
                <img src="https://via.placeholder.com/40" alt="Avatar" className="generated-2" />
            </div>
        </div>
    );
};

export default DashboardHeader;