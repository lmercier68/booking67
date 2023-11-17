import React, { useState } from 'react';

const WeekSelector = ({ onWeekChange }) => {
    // Obtenir la date actuelle et la formater en YYYY-MM-DD
    const currentDate = new Date().toISOString().split('T')[0];

    // Initialiser selectedDate avec la date actuelle
    const [selectedDate, setSelectedDate] = useState(currentDate);

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
        let dates = getStartEndDates(new Date(event.target.value));
        onWeekChange(dates);
        console.log(dates)
    };

    const getStartEndDates = (date) => {
        const startDate = new Date(date);
        startDate.setDate(startDate.getDate() - startDate.getDay() + 1);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);

        return { startDate, endDate };
    };

    return (
        <input type="date" value={selectedDate} onChange={handleDateChange} min={currentDate} />
    );
};

export default WeekSelector;