import { useState, useEffect } from 'react';

import HumanList from './humanList';
function HumanRessourcesForm() {
	const [nom, setNom] = useState('');
	const [prenom, setPrenom] = useState('');
	const [role, setRole] = useState('');
	const [actif, setActif] = useState(true);
	const [currentUser, setCurrentUser] = useState(null);





	const handleSubmit = async () => {
		const response = await fetch('/wp-json/booking67/v1/human_ressources', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				nom,
				prenom,
				role,
				actif,
			}),
		});

		const data = await response.json();
		if (data.success) {
			alert('Utilisateur ajouté avec succès!');
			setNom('');
			setPrenom('');
			setRole('');
			setActif(true);
		} else {
			alert(data.message || 'Erreur lors de l’ajout.');
		}
	};

//TODO :verifier que l'user a les permission 'important pour la securité'

	return (
		<div>
			<div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
				<HumanList/>
			</div>
			<div>
			<input
				type="text"
				placeholder="Nom"
				value={nom}
				onChange={(e) => setNom(e.target.value)}
			/>
			<input
				type="text"
				placeholder="Prénom"
				value={prenom}
				onChange={(e) => setPrenom(e.target.value)}
			/>
			<input
				type="text"
				placeholder="Role"
				value={role}
				onChange={(e) => setRole(e.target.value)}
			/>
			<div>
				<label>Actif:</label>
				<input
					type="checkbox"
					checked={actif}
					onChange={() => setActif(!actif)}
				/>
			</div>
			<button onClick={handleSubmit}>Ajouter</button>
			</div>
		</div>
	);
}

export default HumanRessourcesForm;
