import React from 'react';
import TimeSlot from './TimeSlot';


const getAllUniqueTimes = (slotsByDay) => {
    const allTimes = new Set();

    Object.values(slotsByDay).forEach(slots => {
        slots.forEach(slot => {
            allTimes.add(slot.time);
        });
    });

    return Array.from(allTimes).sort(); // Trier les heures si nécessaire
};
const ScheduleTable = ({ practician, prestation, selectedWeek,slotsByDay, daysOfWeek ,setNewAppointment,dateTimeSlot,setDateTimeSlot, timeOfDay}) => {
    const allUniqueTimes = getAllUniqueTimes(slotsByDay);

    const filteredTimes = allUniqueTimes.filter(time => {
        const hour = parseInt(time.split(':')[0]);
        return timeOfDay === 'AM' ? hour < 12 : hour >= 12;
    });

    const headerStyle = {
        textAlign: 'center', // Centre le texte
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', /* Ombre */
        borderRadius: '10px', /* Bordures arrondies */
        border: '2px',
    };
    const tableStyle = {
        width: '100%', // Utiliser toute la largeur disponible
        tableLayout: 'fixed', // Colonnes de largeur égale
    };
    const cellStyle = {
        width: `${100 / daysOfWeek.length}%`, // Répartir la largeur uniformément
        textAlign: 'center',
        fontWeight: 'bold'
    };
    console.log('filteredTimes: ',filteredTimes)
    return (
        <table style={tableStyle}>
            <thead style={headerStyle}>
            <tr>
                {daysOfWeek.map(day => <th key={day}>{day}</th>)}
            </tr>
            </thead>
             <tbody>
             {filteredTimes.map((time, index) => (
                 <tr key={index}>
                     {daysOfWeek.map((day, dayIndex) => {
                         const slot = slotsByDay[day]?.find(s => s.time === time) || { time, isAvailable: false };

                         // Calculer la date pour chaque jour de la semaine, en commençant par lundi
                         const slotDate = new Date(selectedWeek.startDate);
                         // Ajouter dayIndex jours à la date de début (qui est un lundi)
                         slotDate.setDate(slotDate.getDate() + dayIndex);

                         // Ajouter la propriété date au slot
                         const slotWithDate = { ...slot, date: slotDate.toISOString().split('T')[0] };

                         return (
                             <td key={day} style={cellStyle}>toto
                                 <TimeSlot
                                     slot={slotWithDate}
                                          setNewAppointment={setNewAppointment}
                                          practician={practician}
                                          prestation={prestation}
                                          selectedWeek={selectedWeek}
                                          dateTimeSlot={dateTimeSlot}
                                          setDateTimeSlot={setDateTimeSlot}
                                />




                            </td>
                        );
                    })}
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default ScheduleTable;