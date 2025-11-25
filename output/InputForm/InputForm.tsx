import React from 'react';
import './style.css';

interface InputFormProps {}

const InputForm: React.FC<InputFormProps> = (props) => {
    const [name, setName] = React.useState('');
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    return (
        <div className="inputform-0">
            <input className="inputform-1" onChange={handleInputChange} />
            {name && (
            <p>
                Hello, {name}!
            </p>
            )}
        </div>
    );
};

export default InputForm;