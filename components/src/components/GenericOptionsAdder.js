import React, { useState } from 'react';
import { canInsertNewOption } from './scripts/genericAllow';

function GenericOptionsAdder({ maxAllowed, genericTypeProp }) {
    // États pour les champs
    const [genericType, setGenericType] = useState(genericTypeProp || '');
    const [value, setValue] = useState('');

    // Fonction pour gérer la soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        const canInsert = await canInsertNewOption(genericType, maxAllowed);

        if (canInsert) {
            const data = {
                generic_type: `genType_${genericType}`,
                value: value
            };

            try {
                const response = await fetch('/wp-json/booking67/v1/options', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const responseData = await response.json();

                if (responseData.message) {
                    alert(responseData.message);
                } else {
                    alert('Erreur lors de l\'ajout de l\'option.');
                }
            } catch (error) {
                alert('Erreur lors de l\'ajout de l\'option.');
            }
        } else {
            alert('Le nombre maximum d\'options pour ce type a été atteint.');
        }
    };

    return (
        <div>

            <form onSubmit={handleSubmit}>
                {genericTypeProp ? (
                    <p><h2>Ajout d'une nouvelle prestation</h2></p>
                ) : (
                    <label>
                        Type générique:
                        <input
                            type="text"
                            value={genericType}
                            onChange={(e) => setGenericType(e.target.value)}
                        />
                    </label>
                )}
                <label>
                    {"Dénomination" || 'Valeur'}:
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                </label>
                <button type="submit">Ajouter</button>
            </form>
        </div>
    );
}

export default GenericOptionsAdder;
