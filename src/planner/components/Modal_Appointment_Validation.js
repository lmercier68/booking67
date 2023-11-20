import AppointmentObservation from "./AppointmentObservation";
import {useState, useEffect} from 'react'
import './css/modal_Appointment_validation.css'
const Modal_Appointment_Validation = ({
                                          dateTimeSlot,
                                          practician,
                                          prestation,
                                          setNewAppointment,
                                          canWriteobservation,
                                          setObservation,
                                          userData,
                                          setUserData,
                                          onClose
                                      }) => {


// État pour stocker si l'utilisateur est connecté
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Nouvel état pour le chargement

    // Chargement des informations de l'utilisateur lors du montage du composant
    useEffect(() => {
        loadUserInfo();
    }, []);

// Fonction pour charger les informations de l'utilisateur
    function loadUserInfo() {
        setIsLoading(true); // Début du chargement
        fetch('/wp-json/booking67/v1/current-user', {
            method: 'GET',
            headers: {
                'X-WP-Nonce': wpApiSettings.nonce
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.ID) {
                    setUserData({
                        ...userData,
                        user_mail: data.user_email,
                        user_id: data.ID,
                        user_name: data.user_login,
                        user_firstName: data.user_firstname,
                        user_lastName: data.user_lastname,
                        // Ajoutez user_phone si disponible dans l'API
                    });

                    setIsUserLoggedIn(true);
                } else {
                    setIsUserLoggedIn(false);
                }

                setIsLoading(false); // Fin du chargement
            })
            .catch(error => {
                console.error('Erreur lors du chargement des infos utilisateur', error);
                setIsLoading(false); // Fin du chargement même en cas d'erreur
            });
    }

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

// Fonctions de sanitisation
    const sanitizeInput = (input) => {
        return input.replace(/<script.*?>.*?<\/script>/gi, '').trim();
    };
    const sanitizeEmail = (email) => {
        return email.replace(/[^a-zA-Z0-9@._-]/g, '').trim();
    };
    // Gestionnaire de soumission du formulaire
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation si l'utilisateur n'est pas connecté
        if (!isUserLoggedIn) {
            if (!userData.user_firstName || !userData.user_lastName || !userData.user_mail) {
                alert('Veuillez remplir tous les champs requis.');
                return;
            }

            // Sanitisation basique des entrées
            userData.user_firstName = sanitizeInput(userData.user_firstName);
            userData.user_lastName = sanitizeInput(userData.user_lastName);
            userData.user_mail = sanitizeEmail(userData.user_mail);
        }

        setNewAppointment(true);

        onClose();
    };
    return (
        <div style={{
            position: 'fixed', /* Positionnement fixe au centre */
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
            {!practician ? (
                    <div>
                        merci de choisir un praticien
                        <button style={buttonStyleDeny} onClick={() => {
                            setNewAppointment(false);
                            onClose();
                        }}>Annuler</button>
                    </div>
                ) :
                (!prestation ? (
                        <div>
                            merci de choisir une prestation
                            <button style={buttonStyleDeny} onClick={() => {
                                setNewAppointment(false);
                                onClose();
                            }}>Annuler</button>
                        </div>) :
                    (isLoading ? (
                        <div className='loader'>Chargement en cours...</div>
                    ) : (
                        <div>
                            <h3>Veuillez confirmer votre prise de
                                rendez-vous {isUserLoggedIn ? (userData.user_firstName + ' ' + userData.user_lastName) : ''}</h3>
                            {!isUserLoggedIn && <div><br/>Merci de renseigner vos informations personnelles<br/>
                                <input type="email" placeholder="Votre email" value={userData.user_mail}/>
                                <input type="text" placeholder="Votre nom" value={userData.user_lastName}/>
                                <input type="text" placeholder="Votre prénom" value={userData.user_firstName}/>
                            </div>
                            }
                            <p><br/>
                                <b>Praticien :</b> {practician.nom} {practician.prenom} - <b>{practician.role}</b>
                                <hr/>
                                <b>Prestation :</b> <b>{prestation.prestation_name}</b> au tarif
                                de <b>{prestation.prestation_cost}</b> pour une durée
                                de <b>{prestation.prestation_duration}</b>

                                <hr/>
                                <b>date du rendez-vous
                                    :</b> le {dateTimeSlot.day} {dateTimeSlot.date} à <b>{dateTimeSlot.time}</b>
                            </p>
                            {canWriteobservation &&
                                <p>
                                    <AppointmentObservation setObservation={setObservation}/>
                                </p>
                            }
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center', // Centre horizontalement
                                alignItems: 'center', // Centre verticalement
                                marginTop: '20px' // Espacement en haut
                            }}>
                                <button style={buttonStyleValid} onClick={(e) => {
                                    handleSubmit(e)
                                }}>Valider
                                </button>
                                <button style={buttonStyleDeny} onClick={() => {
                                    setNewAppointment(false);

                                    onClose();
                                }}>Annuler
                                </button>
                            </div>
                        </div>
                    )))}
        </div>)

};

export default Modal_Appointment_Validation;