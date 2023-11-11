import React, { useState,useEffect  } from 'react';
import ReactDOM from 'react-dom';
import PrestationSelect from "./planner/components/PrestationSelect";
import HumanRessourcesActifSelect from "./planner/components/humanactiflist_front";
import SemainierController from "./planner/components/SemainierController";
import AvailabilityDisplay from "./planner/components/AvailabilityDisplay";
import WeekSelector from "./planner/components/weekSelector";

const App = () => {
    // Fonction pour générer les plages horaires d'une journée

    const [selectedPractitionerId, setSelectedPractitionerId] = useState(0);
    const [selectedPrestationId, setSelectedPrestationId] = useState(0);

    const [freeSlots, setFreeSlots] = useState([]);


    const getMondayOfCurrentWeek = () => {
        const now = new Date();
        const monday = new Date(now);
        monday.setDate(monday.getDate() - monday.getDay() + 1);
        return monday.toISOString().split('T')[0];
    };

    // Fonction pour obtenir le dimanche de la semaine actuelle
    const getSundayOfCurrentWeek = () => {
        const now = new Date();
        const sunday = new Date(now);
        sunday.setDate(sunday.getDate() - sunday.getDay() + 7);
        return sunday.toISOString().split('T')[0];
    };

    const handleWeekChange = (dates) => {
        setSelectedWeek(dates);
        // Mettre à jour freeSlots en fonction de la semaine sélectionnée
    };
    const [selectedWeek, setSelectedWeek] = useState({
        startDate: getMondayOfCurrentWeek(),
        endDate: getSundayOfCurrentWeek(),
    });
    const handlePractitionerChange = (id) => {
        setSelectedPractitionerId(id);


    };

    const handlePrestationChange = (id) =>{
        setSelectedPrestationId(id);
    }

    return (
        <div>
            <HumanRessourcesActifSelect onPractitionerChange={handlePractitionerChange} />
            <PrestationSelect practitionerId={selectedPractitionerId} onPrestationChange={handlePrestationChange}/>
            <WeekSelector onWeekChange={handleWeekChange}/>
<AvailabilityDisplay selectedPractitionerId={selectedPractitionerId} selectedWeek={selectedWeek}/>

            <SemainierController  />

        </div>
    );
}

document.addEventListener('DOMContentLoaded', () => {
    const rootElement = document.getElementById('booking67-root');
    if (rootElement) {
        ReactDOM.render(<App />, rootElement);
    }
});
