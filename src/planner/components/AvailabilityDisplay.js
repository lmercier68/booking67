import React, { useState, useEffect } from 'react';

const AvailabilityDisplay = ({ selectedPractitionerId , selectedWeek }) => {
    const [availability, setAvailability] = useState(["e",'r']);
    const [bookedAppointments, setBookedAppointments] = useState([]);




    useEffect(() => {
        if(selectedPractitionerId!==0) {
            // Fetch booked appointments
            fetch(`/wp-json/booker67/v1/appointments/${selectedPractitionerId}`)
                .then(response => response.json())
                .then(data => {
                    console.log('appoitements: ',  data)
                    setBookedAppointments(data);
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des rendez-vous:', error);
                });

        }
    }, [selectedPractitionerId]);

    useEffect(() => {
        if (selectedPractitionerId !== 0) {
            fetch(`/wp-json/booker67/v1/availability/${selectedPractitionerId}`)
                .then(response => response.json())
                .then(data => {
                    // Convertissez les chaînes de date en objets Date
                    const startDate = new Date(selectedWeek.startDate);
                    const endDate = new Date(selectedWeek.endDate);
                    // Générer les dates pour chaque jour de la semaine sélectionnée
                    const weekDates = getWeekDates(startDate);
                    // Calculer les créneaux libres basés sur les disponibilités et les rendez-vous
                    const freeSlots = calculateFreeSlots(data, bookedAppointments, weekDates);
                    // Filtrer les créneaux pour la semaine sélectionnée
                    const slotsForWeek = filterSlotsForWeek(freeSlots, startDate, endDate, weekDates);
                    setAvailability(slotsForWeek);
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des disponibilités:', error);
                });
        }
    }, [selectedPractitionerId, bookedAppointments, selectedWeek]);

    const calculateFreeSlots = (availability, appointments, weekDates) => {
        let freeSlots = [];
        let availabilityMap = new Map();

        availability.forEach(avail => {
            // Mettre la première lettre du jour en majuscule
            let dayName = avail.day_name.charAt(0).toUpperCase() + avail.day_name.slice(1);

            let dayDate = weekDates.get(dayName);
            if (dayDate) {
                let openTime = new Date(dayDate);
                openTime.setHours(avail.opening_time.split(':')[0], avail.opening_time.split(':')[1], 0);
                let closeTime = new Date(dayDate);
                closeTime.setHours(avail.closing_time.split(':')[0], avail.closing_time.split(':')[1], 0);

                let daySlots = [];
                while (openTime < closeTime) {
                    daySlots.push(new Date(openTime));
                    openTime.setMinutes(openTime.getMinutes() + 30); // Supposons des créneaux de 30 minutes
                }

                // Utiliser dayName comme clé dans availabilityMap
                availabilityMap.set(dayName, daySlots);
            }
        });
        console.log('Disponibilités :', availability);
        console.log('Disponibilités map:', availabilityMap);
        // Filtrer les créneaux occupés par les rendez-vous
        appointments.forEach(appointment => {
            let appointmentStart = new Date(appointment.rdv_dateTime);

            // Durée du rendez-vous, supposée être en heures.
            let durationHours = parseInt(appointment.prestation_duration.split(':')[0]);
            let durationMinutes = parseInt(appointment.prestation_duration.split(':')[1] || '0'); // S'il y a des minutes dans la durée.

            let appointmentEnd = new Date(appointmentStart);
            appointmentEnd.setHours(appointmentEnd.getHours() + durationHours);
            appointmentEnd.setMinutes(appointmentEnd.getMinutes() + durationMinutes);

            let dayName = appointmentStart.toLocaleDateString('fr-FR', { weekday: 'long' });
            dayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);

            console.log('Clés dans availabilityMap:', [...availabilityMap.keys()]);
            console.log('Clé recherchée:', dayName);
            let daySlots = availabilityMap.get(dayName);

            console.log('test1: ', appointmentStart.toLocaleDateString('fr-FR', { weekday: 'long' }));
            console.log('test2: ', weekDates);
            console.log('test3: ', daySlots);
            console.log('test31: ', appointmentStart);
            console.log('test32: ', appointmentEnd);

            if (daySlots) {
                console.log('test4: ', daySlots);
                availabilityMap.set(dayName, daySlots.filter(slot =>
                    slot < appointmentStart || slot >= appointmentEnd
                ));
            }
        });
console.log(availabilityMap)
        // Convertir la carte en liste de créneaux libres
        availabilityMap.forEach((slots, day) => {
            slots.forEach(slot => {
                let slotDate = slot.toLocaleDateString('fr-FR');
                freeSlots.push({ day: day, date: slotDate, time: slot.toLocaleTimeString('fr-FR') });
            });
        });
console.log('freeSlots : ' ,freeSlots)
        return freeSlots;
    };
    const getWeekDates = (startDate) => {
        let weekDates = new Map();
        const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

        while (startDate.getDay() !== 1) {
            startDate.setDate(startDate.getDate() - 1);
        }

        for (let i = 0; i < 7; i++) {
            let date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            let dayName = date.toLocaleDateString('fr-FR', { weekday: 'long' });
            console.log('day:', days[i])
            dayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
            console.log('dayName: ' , dayName);
            weekDates.set(dayName, date);
        }

        return weekDates;
    };
    const filterSlotsForWeek = (slots, startDate, endDate, weekDates) => {
        console.log('slots filterslotsweek', slots)
        console.log('startDate filterslotsweek', startDate)
        console.log('endDate filterslotsweek', endDate)
        return slots.filter(slot => {
            const slotDate = weekDates.get(slot.day);
            return slotDate && slotDate >= startDate && slotDate <= endDate;
        });
    };

    // Convertissez les chaînes de date en objets Date
    const startDate = new Date(selectedWeek.startDate);
    const endDate = new Date(selectedWeek.endDate);
    const weekDates = getWeekDates(startDate);
    // Filtrer les créneaux pour la semaine sélectionnée
    const slotsForWeek = filterSlotsForWeek(availability, startDate, endDate, weekDates);

    console.log('slots slotsForWeek', slotsForWeek)
    return (
        <div>
            {slotsForWeek.length > 0 ? (
                slotsForWeek.map((slot, index) => (
                    <div key={index}>
                        {slot.day} -  {slot.date} - {slot.time}
                    </div>
                ))
            ) : (
                <p>Aucun créneau disponible pour cette semaine.</p>
            )}
        </div>
    );
};

export default AvailabilityDisplay;