import React, { useState } from 'react';
import Modal_Appointment_Validation from "./Modal_Appointment_Validation";

function TimeSlot({ practician, prestation, selectedWeek,slot ,setNewAppointment,dateTimeSlot,setDateTimeSlot,canWriteobservation,  setObservation}) {
    const [isSelected, setIsSelected] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
//console.log('slot', slot)
    //console.log('sdateTimeSlot', dateTimeSlot)

    if (!slot) {
        return null;
    }
    const { time, isAvailable } = slot;

    // Formatage de l'heure pour afficher hh:mm
    const formattedTime = new Date('1970-01-01T' + time).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });


    const handleClick = () => {
        if (isAvailable && !isModalOpen && slot.date && !isPastSlot(slot.date, time)) {
            setDateTimeSlot(slot);
            setIsModalOpen(true); // Ouvrir la modale
            setIsSelected(true);
            console.log(`Plage horaire de ${time} pour une durée de X minutes cliquée.`);
        }
    };

    const handleBlur = () => {
        setIsSelected(false);
    };

    const isPastSlot = (slotDate, slotTime) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const slotDateTime = new Date(slotDate);
        const [hours, minutes] = slotTime.split(':');
        slotDateTime.setHours(hours, minutes, 0, 0);

        return slotDateTime < today || (slotDateTime.toDateString() === today.toDateString() && slotDateTime < now);
    };
    const slotStyle = {

        padding: '5px',
        backgroundColor: isAvailable ? (isSelected ? 'orange' : 'white') : '#f44336',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px',
        border: '2px solid #ccc',
        cursor: isAvailable && (!slot.date || !isPastSlot(slot.date, time)) ? 'pointer' : 'not-allowed',
        opacity: slot.date && isPastSlot(slot.date, time) ? 0.5 : 1,
    };
    //console.log('selectedWeek: ',selectedWeek)
    //  console.log('dateTimeSlot',dateTimeSlot)
    // console.log('practician',practician)
    // console.log('prestation',prestation)
    const modalClose=(e)=>{

        setIsModalOpen(false)
    }
    return (
        <div onClick={handleClick} onBlur={handleBlur} tabIndex={0} style={slotStyle}>
            {formattedTime}

            {isModalOpen && (
                <Modal_Appointment_Validation
                    // ... passer les props nécessaires ...
                    onClose={modalClose}

                    slot={slot}
                    setNewAppointment={setNewAppointment}
                    practician={practician}
                    prestation={prestation}
                    selectedWeek={selectedWeek}
                    dateTimeSlot={dateTimeSlot}
                    canWriteobservation={canWriteobservation}
                    setObservation={setObservation}
                />
            )}
        </div>
    );
}

export default TimeSlot;