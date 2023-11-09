/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */


// edit.js
// edit.js


import { DatePicker } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect } from '@wordpress/element';

function TimeSelectEdit({ apiRoot, apiNonce }) {
	const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
	const [selectedSlots, setSelectedSlots] = useState([]);
	const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
	const [selectedSlot, setSelectedSlot] = useState(null);

	const generateTimeSlots = () => {
		let slots = [];
		for (let i = 8; i <= 20; i++) {
			for (let j = 0; j < 2; j++) {
				let startMinute = j === 0 ? '00' : '30';
				let endMinute = j === 0 ? '30' : '00';
				let nextHour = j === 0 ? i : i + 1;
				slots.push(`${i}:${startMinute}-${nextHour}:${endMinute}`);
			}
		}
		return slots;
	};

	const timeSlots = generateTimeSlots();

	const toggleSlot = (slot) => {
		if (selectedSlots.includes(slot)) {
			setSelectedSlots((prev) => prev.filter((s) => s !== slot));
		} else {
			setSelectedSlots((prev) => [...prev, slot]);
		}
	};

	const saveSelectedSlots = () => {
		fetch(`${apiRoot}booker67/v1/save-times`, {
			method: 'POST',
			headers: {
				'X-WP-Nonce': apiNonce,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				date: selectedDate,
				slots: selectedSlots
			})
		})
			.then(response => response.json())
			.then(data => {
				if (data.success) {
					alert('Créneaux horaires enregistrés avec succès.');
				} else {
					alert('Erreur lors de l\'enregistrement des créneaux horaires.');
				}
			})
			.catch(error => {
				console.error('Erreur lors de la réservation du créneau horaire.', error);
			});
	};

	useEffect(() => {
		if (selectedDate) {
			fetch(`${apiRoot}booker67/v1/get-times?date=${selectedDate}`, {
				method: 'GET',
				headers: {
					'X-WP-Nonce': apiNonce
				}
			})
				.then(response => response.json())
				.then(data => {
					setAvailableTimeSlots(data);
				})
				.catch(() => {
					console.error('Erreur lors de la récupération des créneaux horaires.');
				});
		}
	}, [selectedDate, apiRoot, apiNonce]);

	const bookSelectedSlot = () => {
		if (selectedSlot) {
			fetch(`${apiRoot}booker67/v1/book-time`, {
				method: 'POST',
				headers: {
					'X-WP-Nonce': apiNonce,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					start_time: selectedSlot.start,
					end_time: selectedSlot.end,
					date: selectedDate
				})
			})
				.then(() => {
					alert('Créneau horaire réservé avec succès!');
				})
				.catch(() => {
					console.error('Erreur lors de la réservation du créneau horaire.');
				});
		} else {
			alert("Veuillez d'abord choisir un créneau horaire.");
		}
	};

	return (
		<div>
			<DatePicker
				currentDate={selectedDate}
				onChange={(date) => setSelectedDate(date)}
			/>
			<div>
				{timeSlots.map((slot, index) => (
					<button
						key={index}
						style={{ backgroundColor: selectedSlots.includes(slot) ? 'green' : 'white' }}
						onClick={() => toggleSlot(slot)}
					>
						{slot}
					</button>
				))}
			</div>
			<div className="available-time-slots">
				{availableTimeSlots.map((slot, index) => (
					<button
						key={index}
						className={`time-slot ${selectedSlot === slot ? 'selected' : ''}`}
						onClick={() => setSelectedSlot(slot)}
					>
						{`${slot.start} - ${slot.end}`}
					</button>
				))}
			</div>
			<button onClick={saveSelectedSlots}>
				Enregistrer
			</button>
			<button onClick={bookSelectedSlot}>
				Réserver
			</button>
		</div>
	);
}

export default TimeSelectEdit;
