import React, { useState } from 'react';

function AmpmSelector({ onSelectionChange }) {
    const [selectedOption, setSelectedOption] = useState('AM');

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
        console.log(e.target.value)
        onSelectionChange(e.target.value);
    };

    return (
        <div>
            <label>
                <input
                    type="radio"
                    value="AM"
                    checked={selectedOption === 'AM'}
                    onChange={handleOptionChange}

                />
                Matin
            </label>
            <label>
                <input
                    type="radio"
                    value="PM"
                    checked={selectedOption === 'PM'}
                    onChange={handleOptionChange}
                />
                Après-midi
            </label>
        </div>
    );
}

export default AmpmSelector;
