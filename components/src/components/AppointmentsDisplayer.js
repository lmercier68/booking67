import React, { useState, useEffect } from 'react';
import fetchOptions from "./scripts/fetchOptions";
import Appointment from "./Appointment";

function AppointmentsDisplayer() {
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
    const [isLoading, setIsLoading] = useState(true);
    const [appointments, setAppointments] = useState([]);

    //recuperation des options necessaires
    useEffect(() => {
        setIsLoading(true);
        fetchOptions([ 'genType_multipleAppointments', 'genType_slotDuration', 'genType_maxAppointments', 'genType_multiplePracticians', 'genType_multiPrestations', 'genType_indicateNumberOfParticipants', 'genType_allowObservations'])
        .then(data => {
                setOptions(transformFetchedOptions(data));
            })
                .finally(() => {
                    booking67_getUpcommingAppointments();
                    setIsLoading(false); // Désactiver le loader après avoir récupéré les données
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
const booking67_getUpcommingAppointments = ()=>{
        fetch('/wp-json/booking67/v1/upcoming-appointments', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur réseau');
                }
                return response.json();
            })
            .then(data => {
                setAppointments(data);
                // Traiter les données ici
                console.log('data',data);
            })
            .catch((error) => console.error('Erreur:', error));
    }
    return (
        <div>
            {isLoading ? (
                <div>Loading...</div> // Remplacer ceci par votre composant de loader
            ) : (
                <div>
                    {appointments.map(rdv => (
                        <Appointment
                            key={rdv.id}
                            rdv={rdv}
                            options={options}
                            // Vous devez fournir les infos supplémentaires ici

                        />
                    ))}
                </div>
            )}
        </div>
    );
}
export  default AppointmentsDisplayer;