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
const ScheduleTable = ({ practician, prestation, selectedWeek,slotsByDay, daysOfWeek ,setNewAppointment}) => {
    const allUniqueTimes = getAllUniqueTimes(slotsByDay);

    return (
        <table>
            <thead>
            <tr>
                {daysOfWeek.map(day => <th key={day}>{day}</th>)}
            </tr>
            </thead>
             <tbody>
           {allUniqueTimes.map((time, index) => (
                <tr key={index}>
                    {daysOfWeek.map(day => {
                        const slot = slotsByDay[day]?.find(s => s.time === time) || { time, isAvailable: false };
                        return (
                            <td key={day}>
                                <TimeSlot slotsByDay={slotsByDay[day]}
                                          slot={slot}
                                          setNewAppointment={setNewAppointment}
                                          practician={practician}
                                          prestation={prestation}
                                          selectedWeek={selectedWeek}
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