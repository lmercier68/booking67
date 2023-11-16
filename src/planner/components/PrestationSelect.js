import React, { useState, useEffect,useContext } from '@wordpress/element';



function PrestationSelect({practitionerId,onPrestationChange}) {
    const [prestations, setPrestations] = useState([]);

    const handleChange = (event) => {
        // Appeler la fonction de rappel avec la nouvelle valeur
        onPrestationChange(event.target.value);
    };

    useEffect(() => {
        const fetchPrestations = async () => {
            // Construire l'URL en fonction de l'existence de practitionerId
            if(practitionerId !== 0 && practitionerId !== undefined) {
                let url = '/wp-json/booker67/v1/prestations';
                if (practitionerId) {
                    url += `/practitioner_id/${practitionerId}`;
                }
                console.log('recuperation des prestation pour l"id: ', practitionerId);

                try {
                    const response = await fetch(url);
                    const data = await response.json();
                    console.log('prestation recupérée : ', data);
                    setPrestations(data);
                } catch (error) {
                    console.error('Erreur lors de la récupération des prestations:', error);
                }
            }
        };

        fetchPrestations();
    }, [practitionerId]);

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
