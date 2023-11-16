import React, { useState } from 'react';
import Modal_Appointment_Validation from "./Modal_Appointment_Validation";

function TimeSlot({ practician, prestation, selectedWeek,slot ,setNewAppointment,dateTimeSlot,setDateTimeSlot}) {
    const [isSelected, setIsSelected] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);



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
        if (isAvailable && !isModalOpen) {
            setDateTimeSlot(slot);
            setIsModalOpen(true); // Ouvrir la modale
            setIsSelected(true);
            console.log(`Plage horaire de ${time} pour une durée de X minutes cliquée.`);
        }
    };

    const handleBlur = () => {
        setIsSelected(false);
    };

    const slotStyle = {
        cursor: 'pointer',
        padding: '5px',

        backgroundColor: isAvailable ? (isSelected ? 'orange' : 'white') : 'red',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', /* Ombre */
        borderRadius: '10px', /* Bordures arrondies */
        border: '2px solid #ccc',
    };
    console.log('selectedWeek: ',selectedWeek)
    console.log('dateTimeSlot',dateTimeSlot)
    console.log('practician',practician)
    console.log('prestation',prestation)
const modalClose=(e)=>{

     setIsModalOpen(false)
}
    return (
        <div onClick={handleClick} onBlur={handleBlur} tabIndex={0} style={slotStyle}>
            {formattedTime}

                {isModalOpen && (
                <Modal_Appointment_Validation
                    onClose={modalClose}
                    slot={slot}
                    setNewAppointment={setNewAppointment}
                    practician={practician}
                    prestation={prestation}
                    selectedWeek={selectedWeek}
                    dateTimeSlot={dateTimeSlot}
                />
            )}
        </div>
    );
}

export default TimeSlot;
