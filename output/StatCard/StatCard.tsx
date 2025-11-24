import React from 'react';
import './style.css';

interface StatCardProps {
    title?: string;
    trend?: string;
    value?: string;
}

const StatCard: React.FC<StatCardProps> = (props) => {
    return (
        <div className="generated-0">
            <h4 className="generated-1">
                {props.title}
            </h4>
            <div className="generated-2">
                {props.value}
            </div>
            <span className="generated-3">
                Trend: {props.trend}
            </span>
        </div>
    );
};

export default StatCard;