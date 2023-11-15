import React, { useState,useEffect  } from 'react';
import ReactDOM from 'react-dom';
import PrestationSelect from "./planner/components/PrestationSelect";
import HumanRessourcesActifSelect from "./planner/components/humanactiflist_front";
import SemainierController from "./planner/components/SemainierController";
import AvailabilityDisplay from "./planner/components/AvailabilityDisplay";
import WeekSelector from "./planner/components/weekSelector";
import fetchOptions from "../components/src/components/scripts/fetchOptions";

const App = () => {
    const [options, setOptions] = useState({
        hasFixedTimeSlots: false,
        slotDuration: 0,
        multipleAppointments: false,
        maxAppointments: 0,
        multiplePracticians: false,
        multiPrestations: false,
        indicateNumberOfParticipants: false,
        allowObservations: false
    });
    useEffect(() => {
        fetchOptions(['genType_hasFixedTimeSlots', 'genType_multipleAppointments','genType_slotDuration','genType_maxAppointments','genType_multiplePracticians','genType_multiPrestations','genType_indicateNumberOfParticipants','genType_allowObservations']).then(data => {

            setOptions(transformFetchedOptions(data));
        });


    }, []);
    const transformFetchedOptions = (fetchedOptions) => {
        let newOptions = { ...options };
        fetchedOptions.forEach(opt => {
            const key = opt.generic_type.replace('genType_', '');
            newOptions[key] = (opt.value === 'true' || opt.value === 'false') ? opt.value === 'true' : opt.value;
        });
        return newOptions;
    };

    const [selectedPractitionerId, setSelectedPractitionerId] = useState(0);
    const [selectedPrestationId, setSelectedPrestationId] = useState(0);
const [practician, setPractician] =useState(null)
    const [prestation, setPrestation] = useState(null)
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
        const url = `/wp-json/booker67/v1/human-ressource/${id}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur réseau lors de la récupération des données');
                }
                return response.json();
            })
            .then(data => {
                setPractician(data);
                // Traitez ici les données récupérées
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données:', error);
            });

    };

    const handlePrestationChange = (id) =>{
        setSelectedPrestationId(id);
        const url = `/wp-json/booker67/v1/prestation/${id}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur réseau lors de la récupération de la prestation');
                }
                return response.json();
            })
            .then(data => {
                setPrestation(data)
                console.log('prestation change choisi: ',prestation)
                // Traitez ici les données récupérées
            })
            .catch(error => {
                console.error('Erreur lors de la récupération de la prestation:', error);
            });
    }

    return (
        <div>
            {options.multiplePracticians &&  <HumanRessourcesActifSelect onPractitionerChange={handlePractitionerChange} />}
            {options.multiPrestations &&<PrestationSelect practitionerId={selectedPractitionerId} onPrestationChange={handlePrestationChange}/>}
            <WeekSelector onWeekChange={handleWeekChange}/>
            {selectedPractitionerId !== 0 && (
<AvailabilityDisplay options={options} practician={practician} prestation={prestation} selectedPractitionerId={selectedPractitionerId}  selectedWeek={selectedWeek}/>
            )}


        </div>
    );
}

document.addEventListener('DOMContentLoaded', () => {
    const rootElement = document.getElementById('booking67-root');
    if (rootElement) {
        ReactDOM.render(<App />, rootElement);
    }
});
