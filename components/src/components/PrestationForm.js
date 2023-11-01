

import { useState, useEffect } from 'react';
import HumanRessourcesActifSelect from './HumanActiflist';
import GenericOptionsAdder from "./GenericOptionsAdder";
import { SelectionContext } from './scripts/SelectionContext';
import EditPrestationModal from './EditPrestationModal';
function PrestationForm() {
    const [practicianId, setPracticianId] = useState(0);
    const [prestationsList, setPrestationsList] = useState([]);
    const [assignedPrestations, setAssignedPrestations] = useState([]);
    const [prestationCost, setPrestationCost] = useState('');
    const [prestationDuration, setPrestationDuration] = useState('');
    const [selectedPrestation, setSelectedPrestation] = useState('');

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [prestationToEdit, setPrestationToEdit] = useState(null);
    const handleHumanRessourceChange = (event) => {
        const practitionerId = event.target.value;
        console.log(practitionerId);
        setPracticianId(practitionerId);

        fetch(`/wp-json/booker67/v1/prestations/practitioner_id/${practitionerId}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return [];  // Si la réponse est 404 ou autre, retournez un tableau vide.
                }
            })
            .then(result => {
                setAssignedPrestations(result);
            })
            .catch(error => {
                console.error(error);
                // Gérer l'erreur ici si nécessaire.
            });
    };
    const handleDelete = (prestationId) => {
        fetch(`/wp-json/booker67/v1/prestations/${prestationId}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.ok) {
                    console.log('delete ok');
                    loadAssignedPrestations(practicianId);
                } else {
                    alert('Erreur lors de la suppression');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Erreur lors de la suppression');
            });
    };
    useEffect(() => {
        fetch('/wp-json/booker67/v1/options/generic_type/genType_prestation')
            .then(response => response.json())
            .then(result => {
                setPrestationsList(result);
            });
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!practicianId || practicianId === '0') {
            alert('Veuillez sélectionner un praticien avant de sauvegarder.');
            return;
        }

        const data = {
            practitioner_id: practicianId,
            prestation_name: selectedPrestation,
            prestation_cost: prestationCost,
            prestation_duration: prestationDuration,
        };

        fetch('/wp-json/booker67/v1/prestations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((result) => {
                console.log(result);
                // Recharger les prestations assignées après la réussite de l'enregistrement
                loadAssignedPrestations(practicianId);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

// Fonction pour charger les prestations assignées à un praticien
    const loadAssignedPrestations = (practicianId) => {
        fetch(`/wp-json/booker67/v1/prestations/practitioner_id/${practicianId}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return [];  // Si la réponse est 404 ou autre, retournez un tableau vide.
                }
            })
            .then(result => {
                setAssignedPrestations(result);
            })
            .catch(error => {
                console.error(error);
                // Gérer l'erreur ici si nécessaire.
            });
    };
    const unassignedPrestations = prestationsList.filter(p =>
        !assignedPrestations.some(ap => ap.prestation_name === p.value)
    );

    const handleEdit = (prestation) => {
        setIsEditModalOpen(true);
        setPrestationToEdit(prestation);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setPrestationToEdit(null);
    };

    const handleSaveEdit = (editedPrestation) => {
        // Mise à jour de la prestation en base de données
        fetch(`/wp-json/booker67/v1/prestations/${editedPrestation.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editedPrestation),
        })
            .then((response) => response.json())
            .then((result) => {
                console.log(result);
                // Mise à jour de la liste des prestations
                loadAssignedPrestations(practicianId);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };
    return (
        <div style={{ fontFamily: "'Arial', sans-serif", padding: '20px' }}>
            <GenericOptionsAdder genericTypeProp={'prestation'} maxAllowed={3} />
            <hr />
            <h2 style={{ color: '#333', marginBottom: '20px' }}>Affectation de prestation</h2>
            <div style={{ display: 'flex' }}>
                <form onSubmit={handleSubmit} style={{ flex: 1, marginRight: '20px' }}>
                    <SelectionContext.Provider value={{ handleHumanRessourceChange }}>
                        <HumanRessourcesActifSelect handleHumanRessourceChange={handleHumanRessourceChange} />
                    </SelectionContext.Provider>
                    <div
                        style={{ border: '1px solid #e0e0e0', padding: '10px', borderRadius: '5px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}
                    >
                        {assignedPrestations.map(prestation => (
                            <div key={prestation.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <span style={{ flex: 1 }}>{prestation.prestation_name}</span>
                                <span style={{ flex: 1 }}>{prestation.prestation_cost} euro</span>
                                <span style={{ flex: 1 }}>{prestation.prestation_duration} min.</span>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(prestation.id)}
                                    style={{ backgroundColor: 'red', color: 'white', padding: '5px 10px', borderRadius: '5px', marginRight: '5px' }}
                                >
                                    Supprimer
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleEdit(prestation)}
                                    style={{ backgroundColor: 'blue', color: 'white', padding: '5px 10px', borderRadius: '5px' }}
                                >
                                    Modifier
                                </button>
                            </div>
                        ))}
                    </div>
                    <EditPrestationModal
                        isOpen={isEditModalOpen}
                        onClose={handleCloseEditModal}
                        prestation={prestationToEdit}
                        onSave={handleSaveEdit}
                    />
                    <div style={{ marginTop: '20px' }}>
                        <label style={{ marginRight: '20px' }}>
                            Prestation:
                            <select value={selectedPrestation} onChange={(e) => setSelectedPrestation(e.target.value)} style={{ marginLeft: '10px' }}>
                                <option value="">Choisissez une prestation</option>
                                {unassignedPrestations.map((prestation) => (
                                    <option key={prestation.id} value={prestation.value}>
                                        {prestation.value}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label style={{ marginRight: '20px' }}>
                            Coût:
                            <input
                                type="text"
                                value={prestationCost}
                                onChange={(e) => setPrestationCost(e.target.value)}
                                style={{ marginLeft: '10px' }}
                            />
                        </label>
                        <label>
                            Durée:
                            <input
                                type="time"
                                value={prestationDuration}
                                onChange={(e) => setPrestationDuration(e.target.value + ':00')}
                                step="60"
                                style={{ marginLeft: '10px' }}
                            />
                        </label>
                        <button type="submit" style={{ display: 'block', marginTop: '20px', padding: '10px 15px', backgroundColor: '#4CAF50', color: 'white', borderRadius: '5px' }}>
                            Sauvegarder
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PrestationForm;
