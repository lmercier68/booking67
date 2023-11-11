import TimeSlot from './TimeSlot'
function DayColumn({ day, startTime, endTime, durationTime }) {
    // Convertissez les heures de début et de fin en minutes depuis minuit
    const startMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
    const endMinutes = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);
    const timeSlots = [];

    for (let minutes = startMinutes; minutes < endMinutes; minutes += durationTime) {
        // Convertissez les minutes en chaîne horaire HH:mm
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const timeString = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;

        timeSlots.push(
            <TimeSlot
                key={timeString}
                start={timeString}
                duration={durationTime}
                onClick={() => console.log(`${day} - ${timeString}`)}
            />
        );
    }

    return (
        <div style={{ margin: '5px' }}>
            <h3>{day}</h3>
            {timeSlots}
        </div>
    );
}
export  default DayColumn;