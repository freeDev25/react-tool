import React from 'react';
import './style.css';

interface StatCardProps {
    title?: string;
    trend?: string;
    value?: string;
}

const StatCard: React.FC<StatCardProps> = (props) => {
    return (
        <div className="statcard-0">
            <h4 className="statcard-1">
                {props.title}
            </h4>
            <div className="statcard-2">
                {props.value}
            </div>
            <span className="statcard-3">
                Trend: {props.trend}
            </span>
        </div>
    );
};

export default StatCard;