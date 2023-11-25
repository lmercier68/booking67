import React, {useState} from 'react';
import './css/appointment.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faUsers,
    faHandsHelping,
    faHourglassHalf,
    faCheckCircle,
    faBan,
    faCalendarTimes,
    faCheckDouble,
    faMoneyBillWave
} from '@fortawesome/free-solid-svg-icons';


function getStatusIcon(status) {
    const numericStatus = Number(status);
    switch (parseInt(numericStatus)) {
        case 1:
            return faHourglassHalf;
        case 2:
            return faCheckCircle;
        case 0:
            return faBan;
        case 3:
            return faCalendarTimes;
        case 4:
            return faCheckDouble;
        case 6:
            return faMoneyBillWave;
        default:
            return faMoneyBillWave;
    }
}

function getStatusColor() {
    let iconClass = 'waiting';
    switch (parseInt(rdv.rdv_status)) {
        case 1:
            iconClass = 'waiting';
            break;
        case 2:
            iconClass = 'confirmed';
            break;
        case 0:
            iconClass = 'cancelled';
            break;
        case 3:
            iconClass = 'postponed';
            break;
        case 4:
            iconClass = 'completed';
            break;
        case 6:
            iconClass = 'paid';
            break;

    }
    return iconClass
}
function generateModalContent(divType) {
    switch (divType) {
        case 'practicianName':
            return 'Contenu pour Practician Name';
        case 'prestationName':
            return 'Contenu pour Prestation Name';
        // Ajoutez d'autres cas ici
        default:
            return 'Contenu par défaut';
    }
}
function Appointment({rdv, options, practicianInfo, prestationInfo}) {
    const [modalInfo, setModalInfo] = useState({show: false, content: '<div>Erreur de contenu de la fenêtre</div>'});


        function handleIconClick(divType) {
            const content = generateModalContent(divType);
            if (content) {
                setModalInfo({ show: true, content });
            } else {
                // Gérer le cas où content est undefined ou non valide
                console.log("Contenu non trouvé pour le type :", divType);
            }
        }

    const statusIcon = getStatusIcon(rdv.rdv_status);
    const iconClass = getStatusColor(rdv.rdv_status);

    getStatusColor(rdv.rdv_status)
    getStatusIcon(rdv.rdv_status)
    return (
        <div className="appointment-row">
            <div className="appointment-date">{new Date(rdv.rdv_dateTime).toLocaleDateString()}</div>
            <div className="appointment-time">{new Date(rdv.rdv_dateTime).toLocaleTimeString()}</div>
            <div className="user-name">{rdv.user_firstName} {rdv.user_lastName}</div>
            <div className="user-phone">{rdv.user_phone}</div>
            <div className="user-mail">{rdv.user_mail}</div>

            {options.multiplePracticians && (
                <>
                    <div className="practician-name">
                        <FontAwesomeIcon icon={faUsers} onClick={() => handleIconClick('Contenu pour la modale')}/>
                    </div>

                </>
            )}

            {options.multiPrestations && (
                <div className="prestation-name">
                    <FontAwesomeIcon icon={faHandsHelping} onClick={() => handleIconClick('Contenu pour la modale')}/>
                </div>
            )}
            <div className="appointment-status">

                {statusIcon && <FontAwesomeIcon icon={statusIcon} className={iconClass}
                                                onClick={() => handleIconClick('Contenu pour la modale')}/>}
            </div>
            {modalInfo.show && (
                <Modal onClose={() => setModalInfo({ show: false, content:  '<div>Erreur de contenu de la fenêtre</div>' })}>
                    {modalInfo.content}
                </Modal>
            )}
        </div>
    );
}

// Définition du composant Modal
function Modal({ onClose, children }) {
    return (
        <div className="modal">
            <button onClick={onClose}>Fermer</button>
            {children}
        </div>
    );
}

export default Appointment;