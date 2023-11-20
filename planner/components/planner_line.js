import { useState, useEffect, useContext  } from '@wordpress/element';
import {SelectionContext, SelectionProvider} from './scripts/SelectionContext';
import { Button } from 'react-bootstrap';
function PlannerLine({ day_name = "Day", onChange, dayStyle, availabilities = [], setIsModified ,availabilityId}) {


	const { selectedValue } = useContext(SelectionContext);
	const isDisabled = selectedValue === '0';
	const [isActive, setIsActive] = useState(false);
	const [inputValues, setInputValues] = useState([]);
	const [hasAlerted, setHasAlerted] = useState(false);
	const [shouldValidate, setShouldValidate] = useState(false);


	const handleButtonClick = () => {
		setInputValues([...inputValues, { start: "", end: "" }]);
	};


	const handleInputChange = (e, index, type) => {
		const newValue = e.target.value;
		console.log('handleInputChange-plaanerline:', newValue, index, type);

		const updatedValues = [...inputValues];
		updatedValues[index][type] = newValue;
		setInputValues(updatedValues);

		//onChange({value: newValue, index, type, day: day_name});
	};

	const handleInputBlur = (e, index, type) => {
		const newValue = e.target.value;
		//console.log('handleInputBlur:', newValue, index, type);
		const updatedValues = [...inputValues];

//console.log('avail_id : ', availabilityId)
		updatedValues[index][type] = newValue;

		setInputValues(updatedValues);


		// Utilisez la regex pour valider le format de l'heure
		const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

		// Verifiez si les deux entrées sont valides
		const isValidStart = timePattern.test(updatedValues[index].start);
		const isValidEnd = timePattern.test(updatedValues[index].end);

		// Mettez à jour l'état isModified seulement si les deux entrées sont valides
		if (isValidStart && isValidEnd) {

			// Si les deux valeurs sont valides, alors remontez les données
			console.log('valeur envoyée a onChnge', {value: updatedValues[index], index, day: day_name})
			onChange({
				value: {
					start: updatedValues[index].start,
					end: updatedValues[index].end,
					id: updatedValues[index].id,
				},

				index,
				day: day_name
			});  // Modifié ici
		}

		setShouldValidate(true);
	};
	// Dans le composant PlannerLine
	const handleDelete = (index) => {
		const idToDelete = inputValues[index].id;
		if (!idToDelete) {
			console.error('ID non trouvé, impossible de supprimer.');
			return;
		}

		fetch(`/wp-json/booking67/v1/availability/${idToDelete}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'X-WP-Nonce': wpApiSettings.nonce  // nonce pour l'authentification
			},
		})
			.then(response => response.json())
			.then(data => {
				console.log('Suppression réussie:', data);
				// Mettez à jour l'état pour refléter la suppression
				setInputValues(prevValues => prevValues.filter((_, idx) => idx !== index));
			})
			.catch(error => {
				console.error('Erreur:', error);
			});
	};

	useEffect(() => {
		if (shouldValidate) {
			const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
			for (let inputValue of inputValues) {
				// Si l'un des champs est vide, ignorez la validation
				if (inputValue.start === "" || inputValue.end === "") {
					continue;
				}

				if (!timePattern.test(inputValue.start) || !timePattern.test(inputValue.end)) {
					if (!hasAlerted) {
						alert("Veuillez saisir une heure au format hh:mm");
						setHasAlerted(true);
					}
					break;
				}
			}
			setShouldValidate(false);
		}
	}, [shouldValidate, inputValues, hasAlerted]);

	useEffect(() => {

		//console.log('Running useEffect with availabilities:', availabilities);  // Ajouté
		//console.log('inputvalues: ',inputValues)
		let availValues;
		if (availabilities && availabilities.length > 0) {  // Assurez-vous que availabilities est défini
			//console.log('ava 2 : ' , availabilities);
			availValues = availabilities.map(avail => ({ start: avail.opening_time.slice(0, 5), end: avail.closing_time.slice(0, 5),id: avail.id}));
			setIsActive(true);  // Si des disponibilités sont présentes, mettez isActive à true
		} else {
			availValues = [{ start: "", end: "" ,id:undefined}];
			setIsActive(false);  // Si aucune disponibilité n'est présente, mettez isActive à false
		}
		setInputValues(availValues);
		//console.log('availValue: ',availValues);
	}, [availabilities]);
	return (
		<div className="container">
			<div className="row align-items-center">
				<div className="col-auto">
					<input
						type="checkbox"
						className="form-check-input"
						checked={isActive}
						onChange={() => setIsActive(!isActive)}
						disabled={isDisabled}
					/>
				</div>
				<div className="col-auto">
					<label className="form-label" style={{ ...dayStyle }}>{day_name}</label>
				</div>
				<div className="col">

					{inputValues.map((inputGroup, idx) => (

						<div key={idx} className="d-flex align-items-center">
							<label className="form-label">De</label>
							<input
								type="text"
								className="form-control"
								value={inputGroup.start}
								disabled={!isActive || isDisabled}
								placeholder="hh:mm"
								style={{ marginTop: idx === 0 ? 0 : '5px' }}
								onChange={e => handleInputChange(e, idx, 'start')}
								onBlur={e => handleInputBlur(e, idx, 'start')}
							/>
							<label className="form-label">  A</label>
							<input
								type="text"
								className="form-control ms-2"
								value={inputGroup.end}
								disabled={!isActive || isDisabled}
								placeholder="hh:mm"
								style={{ marginTop: idx === 0 ? 0 : '5px' }}
								onChange={e => handleInputChange(e, idx, 'end')}
								onBlur={e => handleInputBlur(e, idx, 'end')}
							/>
							{inputGroup.start && inputGroup.end && (
								<button
									className="btn btn-danger ms-2"
									onClick={() => handleDelete(idx)}
								>
									-
								</button>
							)}
							<Button
								onClick={handleButtonClick}
								disabled={!isActive || isDisabled}
								className="btn btn-primary ms-2"
							>
								+
							</Button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default PlannerLine;





