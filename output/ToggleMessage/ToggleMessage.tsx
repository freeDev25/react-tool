import React from 'react';
import './style.css';

interface ToggleMessageProps {}

const ToggleMessage: React.FC<ToggleMessageProps> = (props) => {
    const [isVisible, setIsVisible] = React.useState(true);
    const toggleMessage = () => {
        setIsVisible(!isVisible);
    };

    return (
        <div className="togglemessage-0">
            <button className="togglemessage-1" onClick={toggleMessage}>
                Toggle Message
            </button>
            {isVisible && (
            <p className="togglemessage-2">
                Hello! This message can be toggled.
            </p>
            )}
        </div>
    );
};

export default ToggleMessage;