const Modal_Appointment_Validation = ({dateTimeSlot,
                                          practician,
                                          prestation,
                                          selectedWeek,
                                          setNewAppointment,
                                          slot,
                                          onClose }) => {
    console.log(dateTimeSlot)
    const buttonStyleValid = {
        backgroundColor: '#4CAF50', // Couleur de fond verte
        color: 'white', // Texte blanc
        padding: '10px 20px', // Espacement intérieur
        margin: '10px', // Espacement extérieur
        border: 'none', // Pas de bordure
        borderRadius: '5px', // Coins arrondis
        cursor: 'pointer', // Curseur en forme de pointeur
        boxShadow: '0 2px 2px rgba(0, 0, 0, 0.2)' // Ombre légère
    };
    const buttonStyleDeny = {
        backgroundColor: '#f44336', // Couleur de fond rouge
        color: 'white', // Texte blanc
        padding: '10px 20px', // Espacement intérieur
        margin: '10px', // Espacement extérieur
        border: 'none', // Pas de bordure
        borderRadius: '5px', // Coins arrondis
        cursor: 'pointer', // Curseur en forme de pointeur
        boxShadow: '0 2px 2px rgba(0, 0, 0, 0.2)' // Ombre légère
    };

    return (
        <div style={{ position: 'fixed', /* Positionnement fixe au centre */
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white', /* Fond blanc */
            padding: '20px', /* Espacement intérieur */
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', /* Ombre */
            borderRadius: '10px', /* Bordures arrondies */
            border: '2px',
            zIndex: 1000, /* S'assurer qu'elle est au-dessus des autres éléments */
        }}>
            {!practician?(
            <div>
                merci de choisir un praticien
                <button style={buttonStyleDeny} onClick={() => {
                    setNewAppointment(false);
                    onClose();
                }}>Annuler</button>
            </div>
            ):

            (!prestation?(
            <div>
                merci de choisir une prestation
                <button style={buttonStyleDeny} onClick={() => {
                    setNewAppointment(false);
                    onClose();
                }}>Annuler</button>
            </div>)  :(

                <div>
                    <h3>Veuillez confirmer votre prise de rendez-vous</h3>
                   <p><br/>
                       <b>Praticien :</b> {practician.nom} {practician.prenom} - <b>{practician.role}</b>
                    <hr/>
                    <b>Prestation :</b> <b>{prestation.prestation_name}</b> au tarif
                    de <b>{prestation.prestation_cost}</b> pour une durée
                    de <b>{prestation.prestation_duration}</b>

                    <hr/>
                       <b>date du rendez-vous :</b>  le {dateTimeSlot.day} {dateTimeSlot.date} à <b>{dateTimeSlot.time}</b>
                   </p>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center', // Centre horizontalement
                        alignItems: 'center', // Centre verticalement
                        marginTop: '20px' // Espacement en haut
                    }}>
                        <button style={buttonStyleValid} onClick={() => {
                            setNewAppointment(true);
                            onClose();
                        }}>Valider
                        </button>
                        <button style={buttonStyleDeny} onClick={() => {
                            setNewAppointment(false);
                            onClose();
                        }}>Annuler
                        </button>
                    </div>
                </div>
            ))}
        </div>)

};

export default Modal_Appointment_Validation;