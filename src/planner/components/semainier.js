import React from 'react';
import {useState,useEffect} from "react";
import DayColumn from './DayColumn'


function Semainier({ isCurrentWeek }) {
    const [startTime, setStartTime] = useState('08:00');
    const [endTime, setEndTime] = useState('17:00');
    const [durationTime, setDurationTime] = useState(60);

    const today = new Date().getDay(); // Dimanche est 0, Lundi est 1, etc.
    const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

    // Si la semaine affichée est la semaine en cours, filtrez les jours passés.
    const validDays = isCurrentWeek
        ? daysOfWeek.filter((_, index) => today === 0 || index + 1 >= today) // +1 car index commence à 0
        : daysOfWeek; // Si ce n'est pas la semaine en cours, affichez tous les jours.

        useEffect(() => {
            // Récupérer startTime
            fetch('/wp-json/booker67/v1/options/generic_type/genType_startTime')
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        setStartTime(data[0].value); // Assurez-vous que le format est correct
                    }
                });

            // Récupérer endTime
            fetch('/wp-json/booker67/v1/options/generic_type/genType_endTime')
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        setEndTime(data[0].value); // Assurez-vous que le format est correct
                    }
                });

            // Récupérer durationTime
            fetch('/wp-json/booker67/v1/options/generic_type/genType_durationTime')
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        setDurationTime(parseInt(data[0].value)); // Assurez-vous que le format est correct et convertissez en nombre si nécessaire
                    }
                });
        }, []);
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

    return (
        <div style={{ display: 'flex' }}>
            {validDays.map(day => (
                <DayColumn
                    key={day}
                    day={day}
                    startTime={startTime}
                    endTime={endTime}
                    durationTime={durationTime}
                />
            ))}
        </div>
    );
}


export default Semainier;
