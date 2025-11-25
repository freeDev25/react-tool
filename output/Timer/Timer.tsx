import React from 'react';
import './style.css';

interface TimerProps {}

const Timer: React.FC<TimerProps> = (props) => {
    const [seconds, setSeconds] = React.useState(0);
    const [isRunning, setIsRunning] = React.useState(false);
    React.useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isRunning) {
            interval = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning]);
    const toggleTimer = () => {
        setIsRunning(!isRunning);
    };

    const resetTimer = () => {
        setSeconds(0);
        setIsRunning(false);
    };

    return (
        <div className="timer-0">
            <h2>
                Timer: {seconds}s
            </h2>
            <div className="timer-1">
                <button className="timer-2" onClick={toggleTimer}>
                    {isRunning ? "Pause" : "Start"}
                </button>
                <button className="timer-3" onClick={resetTimer}>
                    Reset
                </button>
            </div>
        </div>
    );
};

export default Timer;