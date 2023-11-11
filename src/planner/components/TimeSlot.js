import React from 'react';

function TimeSlot({ start, duration, onClick }) {
    const handleClick = () => {
        console.log(`Plage horaire de ${start} pour une durée de ${duration} minutes cliquée.`);
        onClick();
    };

    return (
        <div onClick={handleClick} style={{ cursor: 'pointer', padding: '5px', border: '1px solid #ccc' }}>
            {start}
        </div>
    );
}
export  default  TimeSlot;