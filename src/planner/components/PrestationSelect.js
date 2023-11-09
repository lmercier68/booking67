import React, { useState, useEffect,useContext } from '@wordpress/element';



function PrestationSelect({practitionerId}) {
    const [prestations, setPrestations] = useState([]);



    useEffect(() => {
        // Construire l'URL en fonction de l'existence de practitionerId
        console.log('prestations 1: ' ,prestations)
        console.log('useeffect value : ' ,practitionerId)
        let url = '/wp-json/booker67/v1/prestations';
        if (practitionerId) {
            url += `/practitioner_id/${practitionerId}`;
        }

        // Effectuer une requête AJAX pour obtenir la liste des prestations
        fetch(url)
            .then(response => response.json())
            .then(data => {
                setPrestations(data);
                console.log('data: ' , data);
                console.log('prestations: ' ,prestations)

            })
            .catch(error => {
                console.error('Erreur lors de la récupération des prestations:', error);

            });
        console.log('prestations 2: ' ,prestations)
    }, [practitionerId]); // Ajouter practitionerId comme dépendance pour relancer l'effet si cela change
    console.log('prestations 3: ' ,prestations)
    return (
        <select>
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
