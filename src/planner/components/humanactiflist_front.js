import { useState, useEffect } from 'react';
import React from "@wordpress/element";

function HumanRessourcesActifSelect({ onPractitionerChange }) {
	const [data, setData] = useState([]);

	useEffect(() => {
		fetch('/wp-json/booking67/v1/human_ressources_actif')
			.then(response => response.json())
			.then(result => {
				setData(result);
			})
			.catch((erreur) => { console.error(erreur); });
	}, []);

	const handleChange = (event) => {
		// Appeler la fonction de rappel avec la nouvelle valeur
		onPractitionerChange(event.target.value);
	};

	return (
		<div style={{ fontWeight:"bold", display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
			<label htmlFor="humanRessourceSelect" style={{ display: 'block', marginBottom: '5px' }}>
				Choix de l'intervenant :
			</label>
			<select id="humanRessourceSelect" onChange={handleChange}>

				{data.map(item => (
					<option key={item.id} value={item.id}>
						{item.nom} {item.prenom} - {item.role}
					</option>
				))}
			</select>
		</div>
	);
}

export default HumanRessourcesActifSelect;
