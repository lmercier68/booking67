import React, { useState } from 'react';

function ParticipantsNumberSelector({onNumberChange}) {
    const [selectedNumber, setSelectedNumber] = useState(1);

    const handleChange = (event) => {
        onNumberChange(event.target.value);
    };

    return (
        <div><label htmlFor="number-of-participants">Nombre de participants :</label>
        <select id="number-of-participants" value={selectedNumber} onChange={handleChange}>
            {Array.from({ length: 50 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                    {i + 1}
                </option>
            ))}
        </select>
        </div>
    );
}

export default ParticipantsNumberSelector;