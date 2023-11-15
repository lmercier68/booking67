import React, { useState, useEffect,useContext } from '@wordpress/element';



function PrestationSelect({practitionerId,onPrestationChange}) {
    const [prestations, setPrestations] = useState([]);

    const handleChange = (event) => {
        // Appeler la fonction de rappel avec la nouvelle valeur
        onPrestationChange(event.target.value);
    };

    useEffect(() => {
        // Construire l'URL en fonction de l'existence de practitionerId
        let url = '/wp-json/booker67/v1/prestations';
        if (practitionerId) {
            url += `/practitioner_id/${practitionerId}`;
        }

        // Effectuer une requête AJAX pour obtenir la liste des prestations
        fetch(url)
            .then(response => response.json())
            .then(data => {
                setPrestations(data);

            })
            .catch(error => {
                console.error('Erreur lors de la récupération des prestations:', error);

            });

    }, [practitionerId]); // Ajouter practitionerId comme dépendance pour relancer l'effet si cela change
    console.log('prestations for practician: ' ,prestations)
    return (
        <select onChange={handleChange}>
            <option value="">Sélectionnez une prestation</option>
            { prestations.map(prestation => (
                <option key={prestation.id} value={prestation.id}>
                    {prestation.prestation_name} - {prestation.prestation_cost} - {prestation.prestation_duration}
                </option>
            ))}
        </select>
    );
}

export default PrestationSelect;
