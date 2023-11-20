

import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import PrestationSelect from "./planner/components/PrestationSelect";
import HumanRessourcesActifSelect from "./planner/components/humanactiflist_front";
import AvailabilityDisplay from "./planner/components/AvailabilityDisplay";
import WeekSelector from "./planner/components/weekSelector";
import fetchOptions from "../components/src/components/scripts/fetchOptions";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ParticipantsNumberSelector from "./planner/components/ParticpantsNumberSelector";
const App = () => {
    const [options, setOptions] = useState({
        hasFixedTimeSlots: false,
        slotDuration: 30,
        multipleAppointments: false,
        maxAppointments: 0,
        multiplePracticians: true,
        multiPrestations: true,
        indicateNumberOfParticipants: false,
        allowObservations: false,
        participants:1
    });
    const [selectedPractitionerId, setSelectedPractitionerId] = useState(0);
    const [selectedPrestationId, setSelectedPrestationId] = useState(0);
    const [practician, setPractician] = useState(null)
    const [prestation, setPrestation] = useState(null)
    const [participants, setParticipants] = useState(1)

    useEffect(() => {
        fetchOptions(['genType_hasFixedTimeSlots', 'genType_multipleAppointments', 'genType_slotDuration', 'genType_maxAppointments', 'genType_multiplePracticians', 'genType_multiPrestations', 'genType_indicateNumberOfParticipants', 'genType_allowObservations']).then(data => {

            setOptions(transformFetchedOptions(data));
        });

      !options.multiplePracticians?handlePractitionerChange(1):handlePractitionerChange(1);
        if(!options.multiPrestations){handlePrestationChange(1)};

    }, [selectedPractitionerId]);

/*
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchOptions(['genType_hasFixedTimeSlots', 'genType_multipleAppointments', 'genType_slotDuration', 'genType_maxAppointments', 'genType_multiplePracticians', 'genType_multiPrestations', 'genType_indicateNumberOfParticipants', 'genType_allowObservations']);
                const transformedOptions = transformFetchedOptions(data);
                setOptions(transformedOptions);

                // Actions à exécuter après la réussite de la requête
                if(!transformedOptions.multiplePracticians){
                    handlePractitionerChange(1);
                }
                if(!transformedOptions.multiPrestations){
                    handlePrestationChange(1);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des options:', error);
            }
        };

        fetchData();
    }, [selectedPractitionerId]); // Dépendances du useEffect*/
    const transformFetchedOptions = (fetchedOptions) => {
        let newOptions = {...options};
        fetchedOptions.forEach(opt => {
            const key = opt.generic_type.replace('genType_', '');
            newOptions[key] = (opt.value === 'true' || opt.value === 'false') ? opt.value === 'true' : opt.value;
        });
        return newOptions;
    };
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
    const handlePractitionerChange = async (id) => {

        const url = `/wp-json/booking67/v1/human-ressource/${id}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Erreur réseau lors de la récupération des données');
            }
            const data = await response.json();
            setPractician(data);
            if(selectedPractitionerId !== id){
            setSelectedPractitionerId(id);}
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
            // Ici, vous pouvez gérer l'erreur, par exemple en affichant un message à l'utilisateur
        }
    };

const handleParticipantsChange = (nb)=>{
    setParticipants(nb)
}
const handlePrestationChange = async (id) => {
    console.log('handleprestation change');
    setSelectedPrestationId(id);
    const url = `/wp-json/booking67/v1/prestation/${id}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erreur réseau lors de la récupération de la prestation');
        }
        const data = await response.json();
        setPrestation(data);
    } catch (error) {
        console.error('Erreur lors de la récupération de la prestation:', error);
        // Gérer l'erreur, par exemple en affichant un message d'erreur à l'utilisateur
    }
};
/*
    return (
        <div>
            <ToastContainer />

            {options.multiplePracticians &&
                <HumanRessourcesActifSelect onPractitionerChange={handlePractitionerChange}/>}
            {options.multiPrestations &&
                <PrestationSelect practitionerId={selectedPractitionerId} onPrestationChange={handlePrestationChange}/>}
            <WeekSelector onWeekChange={handleWeekChange}/>
            {options.indicateNumberOfParticipants && <ParticipantsNumberSelector onNumberChange={handleParticipantsChange}/>}
            {selectedPractitionerId &&
                 <AvailabilityDisplay options={options} practician={practician} prestation={prestation}
                                     selectedPractitionerId={selectedPractitionerId} selectedWeek={selectedWeek} participants={participants}/>

            }


        </div>
 */
    return (
        <div>
            <ToastContainer />

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: '20px' }}>
                {options.multiplePracticians &&
                    <div style={{ flexBasis: '48%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <HumanRessourcesActifSelect onPractitionerChange={handlePractitionerChange}/>
                    </div>
                }
                {options.multiPrestations &&
                    <div style={{ flexBasis: '48%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <PrestationSelect practitionerId={selectedPractitionerId} onPrestationChange={handlePrestationChange}/>
                    </div>
                }
                {options.indicateNumberOfParticipants &&
                    <div style={{ flexBasis: '48%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <ParticipantsNumberSelector onNumberChange={handleParticipantsChange}/>
                    </div>
                }
                <div style={{ flexBasis: options.indicateNumberOfParticipants ? '48%' : '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <WeekSelector onWeekChange={handleWeekChange}/>
                </div>
            </div>

            {selectedPractitionerId &&
                <div style={{ width: '100%' }}>
                    <AvailabilityDisplay options={options} practician={practician} prestation={prestation}
                                         selectedPractitionerId={selectedPractitionerId} selectedWeek={selectedWeek} participants={participants}/>
                </div>
            }
        </div>

);
}
document.addEventListener('DOMContentLoaded', () => {
    const rootElement = document.getElementById('booking67-root');
    if (rootElement) {
        ReactDOM.render(<App/>, rootElement);
    }
});
