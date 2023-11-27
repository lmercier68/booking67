import React, {useEffect, useState} from 'react';
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



function booking67_getStatusIcon(status) {
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

function booking67_getStatusColor(status) {
    let iconClass = 'waiting';
    switch (parseInt(status)) {
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



function Booking67_Appointment({rdv, options, onModalOpen, isHighlighted}) {
    const [modalInfo, setModalInfo] = useState({show: false, url: '<div>Erreur de contenu de la fenêtre</div>'});
    const statusIcon = booking67_getStatusIcon(rdv.rdv_status);
    const iconClass = booking67_getStatusColor(rdv.rdv_status);
    let url= '';
    const appointmentClass = `appointment-row ${isHighlighted ? 'highlighted' : ''}`;

    function booking67_handleIconClick(divType,id) {
let ur =booking67_generateModalContent(divType,id);
        onModalOpen(ur, rdv.id, divType);


    }
    function booking67_generateModalContent(divType, id) {
        switch (divType) {
            case 'practician':
                url = '/wp-json/booking67/v1/human-ressource/' + id;
                break;
            case 'prestation':
                url= '/wp-json/booking67/v1/prestation/' + id;
                break;
            default:
                return "format url impossible";
        }
        return url
    }



    booking67_getStatusColor(rdv.rdv_status)
    booking67_getStatusIcon(rdv.rdv_status)
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
                        <FontAwesomeIcon icon={faUsers}
                                         onClick={() => booking67_handleIconClick('practician',rdv.practician_id)}/>
                    </div>

                </>
            )}

            {options.multiPrestations && (
                <div className="prestation-name">
                    <FontAwesomeIcon icon={faHandsHelping}
                                     onClick={() => booking67_handleIconClick('prestation',rdv.prestation_id)}/>
                </div>
            )}
            <div className="appointment-status">

                {statusIcon && <FontAwesomeIcon icon={statusIcon} className={iconClass}/>}
            </div>

        </div>
    );
}
export default Booking67_Appointment;