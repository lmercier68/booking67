import React, { useState } from 'react';

function AppointmentObservation({ setObservation }) {
    const [observation, setLocalObservation] = useState('');

    const handleObservationChange = (event) => {
        setLocalObservation(event.target.value);
        setObservation(event.target.value);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label htmlFor="appointmentObservation" style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                Observation:
            </label>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <textarea
                    id="appointmentObservation"
                    value={observation}
                    onChange={handleObservationChange}
                    placeholder="Entrez votre observation ici..."
                    style={{ width: '70%', display: 'block' }} // Le textarea occupe 70% de la largeur de son conteneur
                />
            </div>
        </div>
    );
}

export default AppointmentObservation;
