import React, { useState, useEffect } from '@wordpress/element';

function PraticienSelect() {
    const [praticiens, setPraticiens] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Effectuer une requête AJAX pour obtenir la liste des praticiens
        fetch('/wp-json/booker67/v1/human_ressources_actif')
            .then(response => response.json())
            .then(data => {
                setPraticiens(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des praticiens:', error);
                setLoading(false);
            });
    }, []);

    return (
        <div><label htmlFor="practicianSelector">Choix de l'intervenant :</label>
        <select id='practicianSelector'>
            <option value="">Sélectionnez un praticien</option>
            {!loading && praticiens.map(praticien => (
                <option key={praticien.id} value={praticien.id}>
                    {praticien.nom} - {praticien.prenom}
                </option>
            ))}
        </select>
            </div>
    );
}

export default PraticienSelect;
