import React, { useState } from 'react';

function AmpmSelector({ onSelectionChange }) {
    const [selectedOption, setSelectedOption] = useState('AM');

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
        console.log(e.target.value)
        onSelectionChange(e.target.value);
    };

    return (
        <div style={{ display: 'flex', marginBottom: '10px' }}>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' , marginRight:'10px'}}>
                <label style={{ fontWeight: 'bold' }}>Disponibilités</label>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                        type="radio"
                        value="AM"
                        checked={selectedOption === 'AM'}
                        onChange={handleOptionChange}
                    />
                    du matin
                </label>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                        type="radio"
                        value="PM"
                        checked={selectedOption === 'PM'}
                        onChange={handleOptionChange}
                    />
                    de l'après-midi
                </label>
            </div>
        </div>
    );
}

export default AmpmSelector;
