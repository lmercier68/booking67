import React, { useState, useEffect } from 'react';
import fetchOptions from "./scripts/fetchOptions";
import Booking67_Appointment from "./Booking67_Appointment";
import {useFetch} from "../hooks/useFetch";
import  './css/appointmentsDisplayer.css'
function AppointmentsDisplayer() {
    const [options, setOptions] = useState({
        hasFixedTimeSlots: false,
        slotDuration: 0,
        multipleAppointments: false,
        maxAppointments: 0,
        multiplePracticians: false,
        multiPrestations: false,
        indicateNumberOfParticipants: false,
        allowObservations: false
    });
    const [isLoading, setIsLoading] = useState(true);
    const [appointments, setAppointments] = useState([]);
    const [modalInfo, setModalInfo] = useState({ show: false, url: '', appointmentId: null, type: null });
    //recuperation des options necessaires
    useEffect(() => {
        setIsLoading(true);
        fetchOptions([ 'genType_multipleAppointments', 'genType_slotDuration', 'genType_maxAppointments', 'genType_multiplePracticians', 'genType_multiPrestations', 'genType_indicateNumberOfParticipants', 'genType_allowObservations'])
        .then(data => {
                setOptions(transformFetchedOptions(data));
            })
                .finally(() => {
                    //recuperation des rdv futur
                    booking67_getUpcommingAppointments();
                    setIsLoading(false); // Désactiver le loader après avoir récupéré les données
                });
        }, []);
    const transformFetchedOptions = (fetchedOptions) => {
        let newOptions = { ...options };
        fetchedOptions.forEach(opt => {
            const key = opt.generic_type.replace('genType_', '');
            newOptions[key] = (opt.value === 'true' || opt.value === 'false') ? opt.value === 'true' : opt.value;
        });
        return newOptions;
    };

    const handleModalOpen = (url, appointmentId, type) => {
        setModalInfo({ show: true, url, appointmentId, type });
    };
    const handleModalClose = () => {
        setModalInfo({ show: false, url: '', appointmentId: null });
    };
const booking67_getUpcommingAppointments = ()=>{
        fetch('/wp-json/booking67/v1/upcoming-appointments', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur réseau');
                }
                return response.json();
            })
            .then(data => {
                setAppointments(data);
                // Traiter les données ici
                console.log('data',data);
            })
            .catch((error) => console.error('Erreur:', error));
    }
    return (
        <div>
            {isLoading ? (
                <div className='loader'>Chargement...</div>
            ) : (
                <div>
                    {appointments.map(rdv => (
                        <Booking67_Appointment
                            key={rdv.id}
                            rdv={rdv}
                            options={options}
                            onModalOpen={handleModalOpen}
                            isHighlighted={modalInfo.appointmentId === rdv.id}
                        />
                    ))}
                    {modalInfo.show && (
                        <Modal
                            url={modalInfo.url}
                            onClose={handleModalClose}
                            type={modalInfo.type}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
function Modal({ onClose, url, type }) {
    const { loading, data, errors } = useFetch(url, []);
    let content;
    if (loading) {
        content = <div className='loader'>Chargement...</div>;
    } else if (errors) {
        content = <div>Erreur lors du chargement des données</div>;
    } else {
        if (type === 'practician') {
            content = <div>
                <b>Intervenant :</b>{data.nom} - {data.prenom}
                <hr/>
                   <b> Role :</b> {data.role}
            </div>;
        } else if (type === 'prestation') {
            content = <div>
                <b>Prestation : </b>{data.prestation_name}
                <hr/>
                <b>Montant :</b> {data.prestation_cost}
                <hr/>
                <b>Durée :</b> {data.prestation_duration}
            </div>;
        }
    }

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                {content}
                <button className="modal-close-button" onClick={onClose}>Fermer</button>
            </div>
        </div>
    );
}
export  default AppointmentsDisplayer;