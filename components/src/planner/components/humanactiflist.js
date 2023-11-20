// fichier humanactifList.js
import { useState, useContext,useEffect } from '@wordpress/element';  // Assurez-vous d'importer useContext
import { SelectionContext } from './scripts/SelectionContext';

function HumanRessourcesActifSelect() {
	const { handleHumanRessourceChange } = useContext(SelectionContext);  // Accédez à handleHumanRessourceChange depuis le contexte

	const [data, setData] = useState([]);

	useEffect(() => {
		fetch('/wp-json/booking67/v1/human_ressources_actif')
			.then(response => response.json())
			.then(result => {

				setData(result);
			});
	}, []);

	return (
		<div>
			<select id="humanRessourceSelect" onChange={handleHumanRessourceChange}>  // Utilisez handleHumanRessourceChange comme gestionnaire d'événements
				<option value="0">Choisir un praticien</option>
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
