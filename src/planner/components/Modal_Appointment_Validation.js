const Modal_Appointment_Validation = ({dateTimeSlot, practician,
                                          prestation,
                                          selectedWeek, setNewAppointment, slot,onClose }) => {
    console.log(dateTimeSlot)
    console.log('praticien choisi: ',practician)
    console.log('prestation choisi: ',prestation)
    return (
        <div style={{ position: 'fixed', /* Positionnement fixe au centre */
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white', /* Fond blanc */
            padding: '20px', /* Espacement intérieur */
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', /* Ombre */
            borderRadius: '10px', /* Bordures arrondies */
            zIndex: 1000, /* S'assurer qu'elle est au-dessus des autres éléments */
        }}>
            {!practician?(
            <div>
                merci de choisir un praticien
                <button onClick={() => {
                    setNewAppointment(false);
                    onClose();
                }}>Annuler</button>
            </div>
            ):

            (!prestation?(
            <div>
                merci de choisir une prestation
                <button onClick={() => {
                    setNewAppointment(false);
                    onClose();
                }}>Annuler</button>
            </div>)  :(

                <div>
                    <h3>Veuillez confirmer votre prise de rendez-vous</h3>
                    <br/>
                    praticien : {practician.nom} {practician.prenom} - {practician.role}
                    <hr/>
                    prestation : <b>{prestation.prestation_name}</b> au tarif
                    de <b>{prestation.prestation_cost}</b> pour une durée
                    de <b>{prestation.prestation_duration}</b>
                    <br/>

                    <button onClick={() => {
                        setNewAppointment(true);
                        onClose();
                    }}>Valider
                    </button>
                    <button onClick={() => {
                        setNewAppointment(false);
                        onClose();
                    }}>Annuler
                    </button>
                </div>
            ))}
        </div>)

};

export default Modal_Appointment_Validation;