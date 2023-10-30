

import { useState, useEffect } from 'react';
import HumanRessourcesActifSelect from './HumanActiflist';
import GenericOptionsAdder from "./GenericOptionsAdder";
import { SelectionContext } from './scripts/SelectionContext';

function PrestationForm() {
    const [practicianId, setPracticianId] = useState(0);
    const [prestationsList, setPrestationsList] = useState([]);
    const [assignedPrestations, setAssignedPrestations] = useState([]);
    const [prestationCost, setPrestationCost] = useState('');
    const [prestationDuration, setPrestationDuration] = useState('');
    const [selectedPrestation, setSelectedPrestation] = useState('');

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

    console.log(assignedPrestations);
    return (
        <div>
            <GenericOptionsAdder genericTypeProp={'prestation'} maxAllowed={3} />
            <hr />
            <p><h2>Affectation de prestation</h2></p>
            <div style={{ display: 'flex' }}>
                <form onSubmit={handleSubmit} style={{ flex: 1 }}>
                    <SelectionContext.Provider value={{ handleHumanRessourceChange }}>
                        <HumanRessourcesActifSelect handleHumanRessourceChange={handleHumanRessourceChange} />
                    </SelectionContext.Provider>
                    <div
                        style={{ border: '1px solid black', minHeight: '50px', marginBottom: '10px' }}
                    >
                        {assignedPrestations.map(prestation => (
                            <div key={prestation.id}>
                                {prestation.prestation_name} - {prestation.prestation_cost}  euro - {prestation.prestation_duration} min.
                            </div>
                        ))}
                    </div>
                    <label>
                        Prestation:
                        <select value={selectedPrestation} onChange={(e) => setSelectedPrestation(e.target.value)}>
                            <option value="">Choisissez une prestation</option>
                            {unassignedPrestations.map((prestation) => (
                                <option key={prestation.id} value={prestation.value}>
                                    {prestation.value}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Coût:
                        <input
                            type="text"
                            value={prestationCost}
                            onChange={(e) => setPrestationCost(e.target.value)}
                        />
                    </label>
                    <label>
                        Durée:
                        <input
                            type="time"
                            value={prestationDuration}
                            onChange={(e) => setPrestationDuration(e.target.value+ ':00')}
                            step="60" // Limitez les secondes à 00
                        />
                    </label>
                    <button type="submit">Sauvegarder</button>
                </form>
            </div>
        </div>
    );
}

export default PrestationForm;

/*
function PrestationForm() {
    const [practicianId, setPracticianId] = useState(0);
    const [prestationsList, setPrestationsList] = useState([]);
    const [assignedPrestations, setAssignedPrestations] = useState([]);
    const [prestationCost, setPrestationCost] = useState('');
    const [prestationDuration, setPrestationDuration] = useState('');
    const [prestationName, setPrestationName] = useState('');

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
    useEffect(() => {
        fetch('/wp-json/booker67/v1/options/generic_type/genType_prestation')
            .then(response => response.json())
            .then(result => {
                setPrestationsList(result);
            });
    }, []);

    const handleDrop = (event) => {
        event.preventDefault();
        const prestationId = event.dataTransfer.getData('text');
        const prestation = prestationsList.find(p => p.id.toString() === prestationId);
        if (prestation) {
            setPrestationName(prestation.value);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };
    const handlePrestationCostChange = (event) => {
        setPrestationCost(event.target.value);
    };

    const handlePrestationDurationChange = (event) => {
        setPrestationDuration(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const data = {
            practician_id: practicianId,
            prestation_name: prestationName,
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
                // Vous pouvez ajouter ici du code pour gérer le résultat de la requête
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };
    const unassignedPrestations = prestationsList.filter(p =>
        !assignedPrestations.some(ap => ap.prestation_name === p.value)
    );

    console.log(assignedPrestations);
    return (<div>
        <GenericOptionsAdder genericTypeProp={'prestation'} maxAllowed={3}/>
        <hr/>
        <p><h2>Affectation de prestation</h2></p>
        <div style={{ display: 'flex' }}>
            <form onSubmit={handleSubmit} style={{ flex: 1 }}>
                <SelectionContext.Provider value={{ handleHumanRessourceChange }}>
                <HumanRessourcesActifSelect  handleHumanRessourceChange={handleHumanRessourceChange}/>
            </SelectionContext.Provider>
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    style={{ border: '1px solid black', minHeight: '50px', marginBottom: '10px' }}
                >
                    {assignedPrestations.map(prestation => (
                        <div key={prestation.id}>
                            {prestation.prestation_name} - {prestation.prestation_cost}  euro - {prestation.prestation_duration} min.
                        </div>
                    ))}
                </div>
                <label>
                    Coût:
                    <input
                        type="text"
                        value={prestationCost}
                        onChange={(e) => setPrestationCost(e.target.value)}
                    />
                </label>
                <label>
                    Durée:
                    <input
                        type="text"
                        value={prestationDuration}
                        onChange={(e) => setPrestationDuration(e.target.value)}
                    />
                </label>
                <button type="submit">Sauvegarder</button>
            </form>
            <div style={{ flex: 1, marginLeft: '10px' }}>
                <h3>Liste des prestations</h3>
                <ul>
                    {unassignedPrestations.map((prestation) => (
                        <li
                            key={prestation.id}
                            draggable="true"
                            onDragStart={(event) => event.dataTransfer.setData('text', prestation.id.toString())}
                        >
                            {prestation.value}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
    );
}

export default PrestationForm;
        /*
    };

    return (<div>
            <GenericOptionsAdder genericTypeProp={'prestation'} maxAllowed={3}/>
            <hr/>
            <p><h2>Affectation de prestation</h2></p>
        <form onSubmit={handleSubmit}>
            <HumanRessourcesActifSelect
                handleHumanRessourceChange={handleHumanRessourceChange}
            />
            <div>
                <label>
                    Nom de la prestation:
                    <input
                        type="text"
                        value={prestationName}
                        onChange={handlePrestationNameChange}
                    />
                </label>
            </div>
            <div>
                <label>
                    Coût de la prestation:
                    <input
                        type="number"
                        value={prestationCost}
                        onChange={handlePrestationCostChange}
                    />
                </label>
            </div>
            <div>
                <label>
                    Durée de la prestation:
                    <input
                        type="time"
                        value={prestationDuration}
                        onChange={handlePrestationDurationChange}
                    />
                </label>
            </div>
            <div>
                <button type="submit">Enregistrer</button>
            </div>
        </form>
        </div>
    );
}

export default PrestationForm;*/