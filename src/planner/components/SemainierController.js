import React, { useState, useEffect } from 'react';
import Semainier from './Semainier'; // Supposons que c'est votre composant Semainier

function SemainierController() {
    const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());
    const [selectedWeekIndex , setSelectedWeekIndex] = useState(false)
    const [validWeeks, setValidWeeks] = useState([]);

    useEffect(() => {
        // Générer la liste des semaines valides
        const weeks = generateValidWeeks();
        setValidWeeks(weeks);
    }, []);

    const handleWeekChange = (event) => {
        setSelectedWeek(event.target.value);
        event.target.options.selectedIndex===0?setSelectedWeekIndex(true):setSelectedWeekIndex(false);
    };

    return (
        <div>
            <label htmlFor="week-selector">Choisissez une semaine :</label>
            <select id="week-selector" value={selectedWeek} onChange={handleWeekChange}>
                {validWeeks.map(week => (
                    <option key={week} value={week}>
                        Semaine {week}
                    </option>
                ))}
            </select>

            <Semainier selectedWeek={selectedWeek} isCurrentWeek={selectedWeekIndex}/>
        </div>
    );
}

function getCurrentWeek() {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000) + 1);
    const weekNumber = Math.ceil(days / 7);
    return weekNumber;
}

function generateValidWeeks() {
    const currentWeek = getCurrentWeek();
    const currentYear = new Date().getFullYear();
    const weeksInYear = getWeeksInYear(currentYear);
    const validWeeks = [];

    for (let week = currentWeek; week <= weeksInYear; week++) {
        validWeeks.push(week);
    }

    return validWeeks;
}

function getWeeksInYear(year) {
    const lastDayOfYear = new Date(year, 11, 31);
    return Math.ceil((((lastDayOfYear - new Date(year, 0, 1)) / (24 * 60 * 60 * 1000)) + 1) / 7);
}

export default SemainierController;
