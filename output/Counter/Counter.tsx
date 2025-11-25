import React from 'react';
import './style.css';

interface CounterProps {}

const Counter: React.FC<CounterProps> = (props) => {
    const [count, setCount] = React.useState(0);
    const handleIncrement = () => {
        setCount(count + 1);
    };

    const handleDecrement = () => {
        setCount(count - 1);
    };

    return (
        <div className="counter-0">
            <h2>
                Counter: {count}
            </h2>
            <div className="counter-1">
                <button className="counter-2" onClick={handleIncrement}>
                    Increment
                </button>
                <button className="counter-3" onClick={handleDecrement}>
                    Decrement
                </button>
            </div>
        </div>
    );
};

export default Counter;