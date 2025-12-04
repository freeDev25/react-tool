import React from 'react';
import './StatCard.css';

interface StatCardProps {
    title: string;
    value: string;
    trend: string;
}

const StatCard: React.FC<StatCardProps> = (props) => {
    return (
        <div className="root">
            <h4 className="node-0">
                {props.title}
            </h4>
            <div className="node-1">
                {props.value}
            </div>
            <span className="node-2">
                Trend: {props.trend}
            </span>
        </div>
    );
};

export default StatCard;