import React, { useState, useEffect, useRef} from 'react'
import ScheduleTable from "./ScheduleTable ";
import AmpmSelector from "./AmpmSelector";
import {  toast } from 'react-toastify';
import {booking67_sendMail_confirmation} from './scripts/emailUtils'
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
// Fonction pour envoyer une requête POST à notre route API WordPress


const AvailabilityDisplay = ({options,practician,prestation, selectedPractitionerId , selectedWeek,participants }) => {


    const [availability, setAvailability] = useState(["e",'r']);
    const [isLoading, setIsLoading] = useState(false);
    const [bookedAppointments, setBookedAppointments] = useState([]);
    const [newAppointment, setNewAppointment] = useState(false);
    const [observation, setObservation] = useState(null);
    const [dateTimeSlot, setDateTimeSlot] = useState(null);
    const [timeOfDay, setTimeOfDay] = useState('AM');
    // État pour stocker les informations de l'utilisateur
    const [userData, setUserData] = useState({
        user_mail: '',
        user_id: '',
        user_name: '',
        user_firstName: '',
        user_lastName: '',
        user_phone: ''
    });

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
    const booking67_addNewRdv = async (practicianId, prestationId, prestationDuration, rdvDateTime, rdvStatus, customerId,participants,observation,userData) => {
        const apiUrl = '/wp-json/booker67/v1/add-rdv/';
        // Création du corps de la requête
        const data = {
            practician_id: practicianId,
            prestation_id: prestationId,
            prestation_duration: prestationDuration,
            rdv_dateTime: rdvDateTime,
            rdv_status: 1,
            customer_id: customerId,
            participants:parseInt(participants),
            observation:observation,
            userData:userData
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
                className: 'custom-toast-succes',
                position: toast.POSITION.TOP_CENTER,
                autoClose: 3000
            })

            booking67_fetchAvailability().then(booking67_fetchBookedAppointments());


            booking67_sendMail_confirmation('destinataire@example.com', 'Sujet de Test', 'Ceci est un message de test.');

        } catch (error) {
            console.error('Erreur:', error);
            toast("Une erreur c'est produite, veuillez recommencer",{
                className: 'custom-toast-alert',
                position: toast.POSITION.TOP_CENTER,
                autoClose: 3000
            })
        }
    };
    useEffect(() => {

        if(newAppointment){
            booking67_addNewRdv(practician.id,prestation.id,prestation.prestation_duration,createDateTime(dateTimeSlot.date,dateTimeSlot.time),1,null,participants,observation,userData)
        }
    }, [newAppointment]);
    const booking67_fetchBookedAppointments = async () => {
       console.log('fetch appointments')
        if((selectedPractitionerId && selectedPractitionerId!==0)|| (!options.multiplePracticians && selectedPractitionerId===1)) {
           // console.log('practionner_id useeffect: ' ,selectedPractitionerId)
            let pract_id=0
            if(!options.multiplePracticians){
                pract_id= 1
            }else {
                pract_id = selectedPractitionerId
            }
            // Fetch booked appointments
            try {
                const response = await fetch(`/wp-json/booker67/v1/appointments/${pract_id}`);
                const data = await response.json();
                let dataConvert = data.map(appointment => {
                    const dateTime = new Date(appointment.rdv_dateTime + 'Z'); // Ajoute 'Z' pour spécifier UTC
                    return {
                        ...appointment,
                        rdv_dateTime: dateTime.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }) // Convertit en heure locale
                    };
                });
                if (estMonte.current) {
                    setBookedAppointments(dataConvert);
                }
                // ... autres opérations ...
            } catch (error) {
                console.error('Erreur lors de la récupération des rendez-vous:', error);
            }
        }
    };
    const booking67_fetchAvailability = async () => {
        console.log('fetch availability')
        if ((selectedPractitionerId && selectedPractitionerId !== 0 )) {
            try {
                const response = await fetch(`/wp-json/booker67/v1/availability/${selectedPractitionerId}`);
                const data = await response.json();

                // Convertir les chaînes de date en objets Date
                const startDate = new Date(selectedWeek.startDate);
                const endDate = new Date(selectedWeek.endDate);
                // Générer les dates pour chaque jour de la semaine sélectionnée
                const weekDates = booking67_getWeekDates(startDate);
                // Calculer les créneaux libres basés sur les disponibilités et les rendez-vous
                const freeSlots = booking67_calculateFreeSlots(data, bookedAppointments, weekDates);
                // Filtrer les créneaux pour la semaine sélectionnée
                const slotsForWeek = booking67_filterSlotsForWeek(freeSlots, startDate, endDate, weekDates);

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
        booking67_fetchBookedAppointments();
    }, [selectedPractitionerId,options.multipleAppointments]);
    useEffect(() => {
        console.log('useeffect fetch availability')
        booking67_fetchAvailability();
    }, [selectedPractitionerId, bookedAppointments, selectedWeek,options.multipleAppointments]);
    const booking67_calculateFreeSlots = (availability, appointments, weekDates) => {
        console.log('calculate free slots');
        setIsLoading(true);
        let freeSlots = [];
        let availabilityMap = new Map();
        let appointmentCounts = new Map();
        // Compter les rendez-vous pour chaque créneau horaire si multipleAppointments est activé
        if (options.multipleAppointments) {
            console.log('multiappointment mode')
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
                if (dayDate) {
                    let openTime = new Date(dayDate);
                    openTime.setHours(avail.opening_time.split(':')[0], avail.opening_time.split(':')[1], 0);
                    let closeTime = new Date(dayDate);
                    closeTime.setHours(avail.closing_time.split(':')[0], avail.closing_time.split(':')[1], 0);

                    let daySlots = [];

                    while (openTime < closeTime) {
                        let slotKey = `${openTime.getDate().toString().padStart(2, '0')}/${(openTime.getMonth() + 1).toString().padStart(2, '0')}/${openTime.getFullYear()} ${openTime.getHours().toString().padStart(2, '0')}:${openTime.getMinutes().toString().padStart(2, '0')}`;
                        let count = appointmentCounts.get(slotKey) || 0;

                        let maxAppointmentsNumber = parseInt(options.maxAppointments);
                        // Vérifier si le créneau est disponible
                            if (maxAppointmentsNumber === 0 || count <= maxAppointmentsNumber) {
                                daySlots.push(new Date(openTime));
                            }
                        openTime.setMinutes(openTime.getMinutes() + parseInt(options.slotDuration));
                    }
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
                }
            });

            // Filtrer les créneaux occupés par les rendez-vous
            appointments.forEach(appointment => {
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
                if (daySlots) {
                    availabilityMap.set(dayName, daySlots.filter(slot =>
                        slot < appointmentStart || slot >= appointmentEnd
                    ));
                }
            });
            // Convertir la carte en liste de créneaux libres
            availabilityMap.forEach((slots, day) => {
                slots.forEach(slot => {
                    let slotDate = slot.toLocaleDateString('fr-FR');
                    freeSlots.push({ day: day, date: slotDate, time: slot.toLocaleTimeString('fr-FR') });
                });
            });
        }
        setIsLoading(false);
        return freeSlots;
    };
    const booking67_getWeekDates = (startDate) => {
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
    const booking67_filterSlotsForWeek = (slots, startDate, endDate, weekDates) => {

        return slots.filter(slot => {
            const slotDate = weekDates.get(slot.day);
            return slotDate && slotDate >= startDate && slotDate <= endDate;
        });
    };

    // Convertissez les chaînes de date en objets Date
    const startDate = new Date(selectedWeek.startDate);
    const endDate = new Date(selectedWeek.endDate);
    const weekDates = booking67_getWeekDates(startDate);
    // Filtrer les créneaux pour la semaine sélectionnée
    const slotsForWeek = booking67_filterSlotsForWeek(availability, startDate, endDate, weekDates);



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
                    setUserData={setUserData}
                    userData={userData}
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