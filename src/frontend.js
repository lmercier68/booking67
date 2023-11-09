import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import PrestationSelect from "./planner/components/PrestationSelect";
import HumanRessourcesActifSelect from "./planner/components/humanactiflist_front";

const App = () => {
    const [selectedPractitionerId, setSelectedPractitionerId] = useState(null);

    const handlePractitionerChange = (id) => {
        setSelectedPractitionerId(id);
    };

    return (
        <div>
            <HumanRessourcesActifSelect onPractitionerChange={handlePractitionerChange} />
            <PrestationSelect practitionerId={selectedPractitionerId} />
        </div>
    );
}

document.addEventListener('DOMContentLoaded', () => {
    const rootElement = document.getElementById('booking67-root');
    if (rootElement) {
        ReactDOM.render(<App />, rootElement);
    }
});
