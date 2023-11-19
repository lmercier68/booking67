import React, { useState, useEffect, useRef} from 'react'
import ScheduleTable from "./ScheduleTable ";
import AmpmSelector from "./AmpmSelector";
import {  toast } from 'react-toastify';
import './css/availability.css'

function createDateTime(date, time) {
    const [year, month, day] = date.split('-');
    console.log([year,month,day])
    const dateTimeString = `${year}-${month}-${day}T${time}`;
    return new Date(dateTimeString);
}
function formatDate(date) {
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Les mois sont indexés à partir de 0
    let year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
const AvailabilityDisplay = ({options,practician,prestation, selectedPractitionerId , selectedWeek,participants }) => {


    const [availability, setAvailability] = useState(["e",'r']);
    const [isLoading, setIsLoading] = useState(false);
    const [bookedAppointments, setBookedAppointments] = useState([]);
    const [newAppointment, setNewAppointment] = useState(false);
    const [observation, setObservation] = useState('essai');
    const [dateTimeSlot, setDateTimeSlot] = useState(null);
    const [timeOfDay, setTimeOfDay] = useState('AM');

    const estMonte = useRef(false);
    useEffect(() => {
        estMonte.current = true;
        return () => {
            estMonte.current = false;
        };
    }, []);
    const handleTimeSelection = (selectedTime) => {
        setTimeOfDay(selectedTime);
        // Vous pouvez également effectuer d'autres actions ici si nécessaire
    };
    const addNewRdv = async (practicianId, prestationId, prestationDuration, rdvDateTime, rdvStatus, customerId,participants,observation) => {
        // L'URL de l'API (remplacer 'votre-site.com' par l'URL réelle de votre site WordPress)

        const apiUrl = '/wp-json/booker67/v1/add-rdv/';
        console.log('observation' , observation)
        // Création du corps de la requête
        const data = {
            practician_id: practicianId,
            prestation_id: prestationId,
            prestation_duration: prestationDuration,
            rdv_dateTime: rdvDateTime,
            rdv_status: 1,
            customer_id: customerId,
            participants:parseInt(participants),
            observation:observation
        };

        // Envoi de la requête POST
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                    // ... autres en-têtes ...
                },
                body: JSON.stringify(data)
            });
            const responseData = await response.json();
            console.log('Succès:', responseData);
            toast('Demande de rendez-vous envoyée. Un mail de confirmation vous sera envoyé.', {
                className: 'custom-toast',
                position: toast.POSITION.TOP_CENTER,
                autoClose: 5000
            })
            console.log('first succès')
            fetchAvailability().then(fetchBookedAppointments()).then(console.log(' second succès'));

        } catch (error) {
            console.error('Erreur:', error);
        }
    };
    useEffect(() => {

        if(newAppointment){
            console.log('dateTimeSlot',dateTimeSlot)
            console.log('create date ' ,createDateTime(dateTimeSlot.date,dateTimeSlot.time))
            addNewRdv(practician.id,prestation.id,prestation.prestation_duration,createDateTime(dateTimeSlot.date,dateTimeSlot.time),1,null,participants,observation)
        }
    }, [newAppointment]);
    const fetchBookedAppointments = async () => {
       console.log('fetch appoitments')
        if((selectedPractitionerId && selectedPractitionerId!==0)|| (!options.multiplePracticians && selectedPractitionerId===1)) {
           // console.log('practionner_id useeffect: ' ,selectedPractitionerId)
            let pract_id=0
            if(!options.multiplePracticians){
                pract_id= 1
            }else {
                pract_id = selectedPractitionerId
            }
            console.log('pract_id', pract_id)
            // Fetch booked appointments
            try {
                const response = await fetch(`/wp-json/booker67/v1/appointments/${pract_id}`);
                const data = await response.json();
                console.log('setbooked: ', data);
                let dataConvert = data.map(appointment => {
                    const dateTime = new Date(appointment.rdv_dateTime + 'Z'); // Ajoute 'Z' pour spécifier UTC
                    return {
                        ...appointment,
                        rdv_dateTime: dateTime.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }) // Convertit en heure locale
                    };
                });
                console.log('setbooked after convertion: ', dataConvert);
                if (estMonte.current) {
                    setBookedAppointments(dataConvert);
                }
                // ... autres opérations ...
            } catch (error) {
                console.error('Erreur lors de la récupération des rendez-vous:', error);
            }
        }
    };
    const fetchAvailability = async () => {
        console.log('fetch availability')
        if ((selectedPractitionerId && selectedPractitionerId !== 0 )) {
            console.log('selectedPractitionerId',selectedPractitionerId);
            try {
                const response = await fetch(`/wp-json/booker67/v1/availability/${selectedPractitionerId}`);
                const data = await response.json();

                // Convertir les chaînes de date en objets Date
                const startDate = new Date(selectedWeek.startDate);
                const endDate = new Date(selectedWeek.endDate);
                // Générer les dates pour chaque jour de la semaine sélectionnée
                const weekDates = getWeekDates(startDate);
                // Calculer les créneaux libres basés sur les disponibilités et les rendez-vous
                const freeSlots = calculateFreeSlots(data, bookedAppointments, weekDates);
                // Filtrer les créneaux pour la semaine sélectionnée
                const slotsForWeek = filterSlotsForWeek(freeSlots, startDate, endDate, weekDates);

                if (estMonte.current) {
                    setAvailability(slotsForWeek);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des disponibilités:', error);
            }
        }
    };
    useEffect(() => {

console.log('useeffect fetch appoitments')
        fetchBookedAppointments();

    }, [selectedPractitionerId,options.multipleAppointments]);



    useEffect(() => {
        console.log('useeffect fetch availability')
       // console.log('fetch avail pratci: ', selectedPractitionerId)

        fetchAvailability();
    }, [selectedPractitionerId, bookedAppointments, selectedWeek,options.multipleAppointments]);

    const calculateFreeSlots = (availability, appointments, weekDates) => {
        console.log('calculate free slots');
        setIsLoading(true);
        let freeSlots = [];
        let availabilityMap = new Map();

        let appointmentCounts = new Map();

        // Compter les rendez-vous pour chaque créneau horaire si multipleAppointments est activé

        if (options.multipleAppointments) {
            console.log('multiappointment mode')
            //console.log('appointments' , appointments)
            //console.log('availlability', availability)
            appointments.forEach(appointment => {
                const [date, time] = appointment.rdv_dateTime.split(' ');
                const [day, month, year] = date.split('/');
                const [hours, minutes, seconds] = time.split(':');
                let appointmentStart = new Date(year, month - 1, day, hours, minutes, seconds);

                let slotKey = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year} ${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;

                let currentCount = appointmentCounts.get(slotKey) || 0;
                appointmentCounts.set(slotKey, currentCount + 1);
            });
            // Parcourir les disponibilités pour déterminer les créneaux libres
            availability.forEach(avail => {
                let dayName = avail.day_name.charAt(0).toUpperCase() + avail.day_name.slice(1);
                let dayDate = weekDates.get(dayName);
                //console.log('dayDate',dayDate)
               //console.log('dayName',dayName)
                if (dayDate) {
                    let openTime = new Date(dayDate);
                    openTime.setHours(avail.opening_time.split(':')[0], avail.opening_time.split(':')[1], 0);
                    let closeTime = new Date(dayDate);
                    closeTime.setHours(avail.closing_time.split(':')[0], avail.closing_time.split(':')[1], 0);

                    let daySlots = [];
                    //console.log('openTime',openTime)
                    //console.log('closingTime', closeTime)

                    while (openTime < closeTime) {
                        //console.log('bingo')
                        let slotKey = `${openTime.getDate().toString().padStart(2, '0')}/${(openTime.getMonth() + 1).toString().padStart(2, '0')}/${openTime.getFullYear()} ${openTime.getHours().toString().padStart(2, '0')}:${openTime.getMinutes().toString().padStart(2, '0')}`;
                        let count = appointmentCounts.get(slotKey) || 0;

                        let maxAppointmentsNumber = parseInt(options.maxAppointments);
                        // Vérifier si le créneau est disponible
//console.log('max appointment',options.maxAppointments)
                        //console.log('maxAppointmentsNumber',maxAppointmentsNumber)
                        //console.log('count',count)

                            if (maxAppointmentsNumber === 0 || count <= maxAppointmentsNumber) {
                                daySlots.push(new Date(openTime));
                            }


                        openTime.setMinutes(openTime.getMinutes() + parseInt(options.slotDuration));
                    }
                    //console.log('daySlots',daySlots)
                    if (daySlots.length > 0) {
                        // Ajouter les créneaux libres pour ce jour
                        freeSlots = freeSlots.concat(daySlots.map(slot => {
                            return {
                                day: dayName,
                                date: slot.toLocaleDateString('fr-FR'),
                                time: slot.toLocaleTimeString('fr-FR')
                            };
                        }));
                    }
                }
            });
        }else{
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
                        openTime.setMinutes(openTime.getMinutes() + parseInt(options.slotDuration)); // Supposons des créneaux de 30 minutes
                    }

                    // Utiliser dayName comme clé dans availabilityMap
                    availabilityMap.set(dayName, daySlots);
                    //console.log("Availability Map:", availabilityMap);
                }
            });

            // Filtrer les créneaux occupés par les rendez-vous
            appointments.forEach(appointment => {
                //console.log("Processing appointment:", appointment);
                //let appointmentStart = new Date(appointment.rdv_dateTime);
                const [date, time] = appointment.rdv_dateTime.split(' ');
                const [day, month, year] = date.split('/');
                const [hours, minutes, seconds] = time.split(':');
                let appointmentStart = new Date(year, month - 1, day, hours, minutes, seconds);


                // Durée du rendez-vous, supposée être en heures.
                let durationHours = parseInt(appointment.prestation_duration.split(':')[0]);
                let durationMinutes = parseInt(appointment.prestation_duration.split(':')[1] || '0'); // S'il y a des minutes dans la durée.

                let appointmentEnd = new Date(appointmentStart);
                appointmentEnd.setHours(appointmentEnd.getHours() + durationHours);
                appointmentEnd.setMinutes(appointmentEnd.getMinutes() + durationMinutes);

                let dayName = appointmentStart.toLocaleDateString('fr-FR', { weekday: 'long' });
                dayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);

                let daySlots = availabilityMap.get(dayName);
                //console.log('appointmentEnd: ',appointmentEnd);
                //console.log('appointmentStart: ',appointmentStart);
                //console.log('daylsot',daySlots)
                if (daySlots) {

                    availabilityMap.set(dayName, daySlots.filter(slot =>
                        slot < appointmentStart || slot >= appointmentEnd
                    ));
                }
                //console.log("Availability Map after processing appointment:", availabilityMap);

            });
            //console.log("Final Availability Map before conversion:", availabilityMap);
            // Convertir la carte en liste de créneaux libres
            availabilityMap.forEach((slots, day) => {
                slots.forEach(slot => {
                    let slotDate = slot.toLocaleDateString('fr-FR');
                    freeSlots.push({ day: day, date: slotDate, time: slot.toLocaleTimeString('fr-FR') });
                });
            });

        }
//console.log(freeSlots)

        setIsLoading(false);
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
            dayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
            weekDates.set(dayName, date);
        }

        return weekDates;
    };
    const filterSlotsForWeek = (slots, startDate, endDate, weekDates) => {

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



    const slotsByDay = slotsForWeek.reduce((acc, slot) => {
        acc[slot.day] = acc[slot.day] || [];
        acc[slot.day].push({ ...slot, isAvailable: true }); // Supposons que tous les créneaux sont disponibles
        return acc;
    }, {});

    const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];



    return (
        <div>{isLoading ? (
            <div className="loader">Chargement...</div> // Affiche le loader
        ) : (
            availability.length > 0 ? (
                <div>
                      <AmpmSelector onSelectionChange={handleTimeSelection} />
                    <ScheduleTable
                    slotsByDay={slotsByDay}
                    practician={practician}
                    prestation={prestation}
                    selectedWeek={selectedWeek}
                    setNewAppointment={setNewAppointment}
                    daysOfWeek={daysOfWeek}
                dateTimeSlot={dateTimeSlot}
                setDateTimeSlot={setDateTimeSlot}
                    timeOfDay={timeOfDay}
                    canWriteobservation={options.allowObservations}
                    setObservation={setObservation}
                />
                </div>
            ) : (
                <p>Aucun créneau disponible pour cette semaine.</p>
                )
            )}
        </div>
    );
};

export default AvailabilityDisplay;