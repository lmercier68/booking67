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
                    {daysOfWeek.map(day => {
                        const slot = slotsByDay[day]?.find(s => s.time === time) || { time, isAvailable: false };
                        return (
                            <td key={day} style={cellStyle}>
                                <TimeSlot
                                          slot={slot}
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