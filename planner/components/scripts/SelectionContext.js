// fichier SelectionContext.js
import { useState, createContext } from '@wordpress/element';

export const SelectionContext = createContext({
	selectedValue: '0',
	setSelectedValue: () => {},
	handleHumanRessourceChange: () => {},
	handleNewAvail: () => {},
});

// Dans le fichier SelectionContext.js
export const SelectionProvider = ({ children }) => {
	const [selectedValue, setSelectedValue] = useState('0');
	const [loading, setLoading] = useState(false);
	const [availabilities, setAvailabilities] = useState([]);
	const handleNewAvail = (selectedVal) => {  // Modifiez le paramètre pour être l'événement

		const selectedValue = selectedVal;  // Accédez à la valeur sélectionnée depuis l'événement
		console.log('handleHumanRessourceChange triggered with selectedValue:', selectedValue);




		setLoading(true);
		console.log('Fetching data with URL:', `/wp-json/booking67/v1/availability?value=${selectedValue}`);
		fetch(`/wp-json/booking67/v1/availability?value=${selectedValue}`)
			.then(response => response.json())
			.then(data => {
				console.log('Received data:', data);
				setAvailabilities(data);
			})
			.finally(() => {
				console.log('Loading finished');
				setLoading(false);
			});
	};
	const handleHumanRessourceChange = (event) => {  // Modifiez le paramètre pour être l'événement

		const selectedValue = event.target.value;  // Accédez à la valeur sélectionnée depuis l'événement
		console.log('handleHumanRessourceChange triggered with selectedValue:', selectedValue);



		setSelectedValue(selectedValue);
		setLoading(true);
		console.log('Fetching data with URL:', `/wp-json/booking67/v1/availability?value=${selectedValue}`);
		fetch(`/wp-json/booking67/v1/availability?value=${selectedValue}`)
			.then(response => response.json())
			.then(data => {
				console.log('Received data:', data);
				setAvailabilities(data);
			})
			.finally(() => {
				console.log('Loading finished');
				setLoading(false);
			});
	};

	return (
		<SelectionContext.Provider value={{ selectedValue, setSelectedValue, handleHumanRessourceChange,handleNewAvail, loading, availabilities }}>
			{console.log('Rendering SelectionProvider with:', { selectedValue, loading, availabilities })}

			{children}
		</SelectionContext.Provider>
	);
};
