import { useState, useEffect } from 'react';

function HumanRessourcesActifSelect({ onPractitionerChange }) {
	const [data, setData] = useState([]);

	useEffect(() => {
		fetch('/wp-json/booker67/v1/human_ressources_actif')
			.then(response => response.json())
			.then(result => {
				setData(result);
			});
	}, []);

	const handleChange = (event) => {
		// Appeler la fonction de rappel avec la nouvelle valeur
		onPractitionerChange(event.target.value);
	};

	return (
		<div>
			<select id="humanRessourceSelect" onChange={handleChange}>
				<option value="">Choisir un praticien</option>
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
