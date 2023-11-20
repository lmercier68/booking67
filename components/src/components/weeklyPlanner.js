/* global wpApiSettings */
import {useState, useContext} from 'react';
import PlannerLine from './planner_line';
import HumanRessourcesActifSelect from './humanActiflist';
//import { Spinner } from 'react-bootstrap/Spinner';
import {SelectionProvider, SelectionContext} from './scripts/SelectionContext';

function WeeklyPlanner() {
    const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    const {loading, availabilities, selectedValue} = useContext(SelectionContext);
    const [isModified, setIsModified] = useState(false);
    const [weekData, setWeekData] = useState({});
    const longestDay = daysOfWeek.reduce((longest, day) => day.length > longest.length ? day : longest, '');


    const {handleNewAvail} = useContext(SelectionContext);

    const dayStyle = {
        minWidth: `${longestDay.length}ch`,
        display: 'inline-block'
    };

    const handleInputChange = ({value, index, day}) => {
        console.log('handleInputChange-weekly', {value, index, day});  // Log ici

        console.log(`On day ${day}, Input at index ${index} has values:`, value);
        console.log('valueId-weeklyplan: ', value.id);
        setIsModified(true);


        // Transformez les données en un format approprié pour availabilities
        const formattedData = {

            day,
            index,
            opening_time: value.start,
            closing_time: value.end,
            id: value.id
        };
        console.log('valueId: ', value.id)
        const postData = {
            id: value.id,
            practician_id: selectedValue,  // remplacez par l'ID du praticien
            day_name: day,
            opening_time: value.start,
            closing_time: value.end
        };
        console.log('postData: ', postData);
        // Déterminez l'URL et la méthode basées sur si l'id est défini
        const url = value.id ? `/wp-json/booking67/v1/availability/${value.id}` : '/wp-json/booking67/v1/availability';
        const method = value.id ? 'PUT' : 'POST';

        // Envoyer une requête à la route /availability pour sauver ou mettre à jour le créneau
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': wpApiSettings.nonce  // nonce pour l'authentification
            },
            body: JSON.stringify(postData)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Response:', data);  // Log la réponse
                //on recupere les créneaux mis a jours

                handleNewAvail(selectedValue);
            })
            .catch(error => {
                console.error('Error:', error);
            });

        setWeekData(prevData => {

            const updatedDayData = prevData[day] ? [...prevData[day]] : [];

            updatedDayData[index] = formattedData;

            const newData = {...prevData, [day]: updatedDayData};  // Modifiez cette ligne

            return newData;  // Modifiez cette ligne

        });
    };
    const handleSave = () => {
        // Supposons que votre état ait une structure comme celle-ci :
        // const [availabilities, setAvailabilities] = useState({
        //     Lundi: [{ opening_time: '09:00', closing_time: '17:00' }, ...],
        //     Mardi: [{ opening_time: '09:00', closing_time: '17:00' }, ...],
        //     ...
        // });

        if (typeof availabilities !== 'object' || !availabilities) {
            console.log('availabilities', availabilities);
            console.error('availabilities is not an object:', availabilities);
            return;
        }
        console.log('availabilities', availabilities);
        const formattedData = Object.entries(availabilities).map(([day, slots]) => {
            if (!Array.isArray(slots)) {
                console.error('slots is not an array for day', day, ':', slots);
                return [];
            }

            return slots.map(slot => ({
                practician_id: 1,  // Remplacez par l'ID réel du praticien
                day_name: day,
                ...slot
            }));
        }).flat();

        // Envoyer les données à l'API
        fetch('/wp-json/booking67/v1/availability', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Vous pourriez avoir besoin d'ajouter un en-tête d'autorisation ici si votre API le requiert
            },
            body: JSON.stringify(formattedData)
        })
            .then(response => {
                if (!response.ok) {
                    // Si la réponse n'est pas ok (status code 2xx), rejeter la promesse
                    return Promise.reject('Failed to save');
                }
                return response.json();  // Sinon, retourner la réponse JSON
            })
            .then(data => {
                console.log(data.message);  // Log le message de succès
                setIsModified(false);  // Réinitialiser l'état isModified
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (

        <div>

            <div style={loading ? {pointerEvents: 'none', opacity: 0.5} : {}}>
                <HumanRessourcesActifSelect/>
                {daysOfWeek.map(day => {
                    const filteredAvailabilities = availabilities ? availabilities.filter(avail => avail.day_name === day) : [];


                    return (
                        <div key={day}>  {/* Encapsulez PlannerLine et <hr /> dans une <div> */}
                            <PlannerLine
                                day_name={day}
                                dayStyle={dayStyle}
                                availabilityId={filteredAvailabilities.id}
                                availabilities={filteredAvailabilities}
                                onChange={(value, index, type, day) => handleInputChange(value, index, day)}
                                setIsModified={setIsModified}  // Passer setIsModified en tant que prop
                            />
                            <hr/>
                        </div>
                    );
                })}


            </div>
            <button
                style={{
                    backgroundColor: isModified ? 'orange' : 'mediumblue',
                    color: 'white',
                    borderRadius: '5px',
                    padding: '10px',
                    border: 'none',
                    cursor: 'pointer'
                }}
                disabled={!isModified}
                onClick={handleSave}
            >
                Save
            </button>
        </div>

    );
}

export default WeeklyPlanner;
