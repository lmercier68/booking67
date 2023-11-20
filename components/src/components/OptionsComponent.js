import React, { useState,useEffect } from 'react';
import fetchOptions from "./scripts/fetchOptions";
function OptionsComponent() {
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
    // Fonction pour transformer les données récupérées en format attendu
    const transformFetchedOptions = (fetchedOptions) => {
        let newOptions = { ...options };
        fetchedOptions.forEach(opt => {
            const key = opt.generic_type.replace('genType_', '');
            newOptions[key] = (opt.value === 'true' || opt.value === 'false') ? opt.value === 'true' : opt.value;
        });
        return newOptions;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setOptions(prevOptions => ({
            ...prevOptions,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    // Génération des options pour les durées de créneau
    const slotDurationOptions = [];
    for (let i = 15; i <= 180; i += 15) {
        slotDurationOptions.push(<option key={i} value={i}>{i} minutes</option>);
    }
    const handleSubmit = async () => {
        try {
            const response = await fetch('/wp-json/booking67/v1/multiOptions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(options)
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'envoi des données');
            }

            const responseData = await response.json();
            console.log('Succès:', responseData);
        } catch (error) {
            console.error('Erreur handlesubmit optonsComponent:', error);
        }
    };

    return (
        <div>

            <label>
                Les rendez-vous ont-ils une heure de début et une heure de fin ?
                <input
                    type="checkbox"
                    name="hasFixedTimeSlots"
                    checked={options.hasFixedTimeSlots}
                    onChange={handleChange}
                />
            </label>
            <br/>
            {options.hasFixedTimeSlots && (
                <label>
                    Durée des créneaux
                    <select
                        name="slotDuration"
                        value={options.slotDuration}
                        onChange={handleChange}
                    >
                        {slotDurationOptions}
                    </select>
                </label>

            )}
            <br/>
            <label>
                Plusieurs rendez-vous peuvent-il être pris simultanément ?
                <input
                    type="checkbox"
                    name="multipleAppointments"
                    checked={options.multipleAppointments}
                    onChange={handleChange}
                />
            </label>
            <br/>
            {options.multipleAppointments && (
                <label>
                    Nombre de rendez-vous simultanés maximum
                    <input
                        type="number"
                        name="maxAppointments"
                        value={options.maxAppointments}
                        onChange={handleChange}
                        min="0"
                    /> (0 = illimités)
                </label>
            )}
            <br/>
            <label>
                Intervenant multiples :
                <input
                    type="checkbox"
                    name="multiplePracticians"
                    checked={options.multiplePracticians}
                    onChange={handleChange}
                />
            </label>
            <br/>
            <label>
                Prestations multiples:
                <input
                    type="checkbox"
                    name="multiPrestations"
                    checked={options.multiPrestations}
                    onChange={handleChange}
                />
            </label>
            <br/>
            <label>
                Le client peut/doit indiquer le nombre de participants :
                <input
                    type="checkbox"
                    name="indicateNumberOfParticipants"
                    checked={options.indicateNumberOfParticipants}
                    onChange={handleChange}
                />
            </label>
            <br/>
            <label>
                Le client peut laisser une observation :
                <input
                    type="checkbox"
                    name="allowObservations"
                    checked={options.allowObservations}
                    onChange={handleChange}
                />
            </label>
            {/* Autres champs... */}
            <br/>
            <button onClick={handleSubmit}>Enregistrer les Options</button>
        </div>
    );
}

export default OptionsComponent;
