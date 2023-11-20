/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */

/*
export default function Save( { attributes } ) {
	function getDaysInCurrentMonth() {
		const now = new Date();
		return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
	}
	function getStartDayOfCurrentMonth() {
		const now = new Date();
		const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
		return firstDayOfMonth.getDay();
	}
	function getDayName(index) {
		const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
		return days[index];
	}

		const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
		const monthDays = getDaysInCurrentMonth();
		const startDay = getStartDayOfCurrentMonth();
		const today = new Date();

		// Générer les jours du mois
		const days = Array(monthDays).fill().map((_, dayIndex) => {
			const dayNumber = dayIndex + 1;
			const dayName = getDayName((startDay + dayIndex) % 7);

			const isToday = (today.getDate() === dayNumber && today.getMonth() === new Date().getMonth() && today.getFullYear() === new Date().getFullYear());

			if (isToday) {
				return <td key={dayNumber} className="booking67-day booking67-today"><a href="#">{dayNumber}</a></td>;
			} else if (attributes.days[dayName]) {
				return <td key={dayNumber} className="booking67-day"><a href="#">{dayNumber}</a></td>;
			} else {
				return <td key={dayNumber} className="booking67-day-disabled">{dayNumber}</td>;
			}
		});

		// Remplir les jours vides au début du mois
		for (let i = 0; i < startDay; i++) {
			days.unshift(<td key={'start-empty-' + i} className="booking67-day-empty"></td>);
		}

		// Remplir les jours vides à la fin du mois pour compléter la dernière semaine
		while (days.length % 7 !== 0) {
			days.push(<td key={'end-empty-' + days.length} className="booking67-day-empty"></td>);
		}

		// Convertir la liste des jours en lignes de semaine
		const weeks = [];
		for (let i = 0; i < days.length; i+=7) {
			weeks.push(
				<tr key={'week-' + i/7}>
					{days.slice(i, i+7)}
				</tr>
			);
		}

		return (
			<table className="booking67-calendar">
				<thead>
				<tr>
					{daysOfWeek.map(day => <th key={day}>{day}</th>)}
				</tr>
				</thead>
				<tbody>
				{weeks}
				</tbody>
			</table>
		);
	}
*/
export default function Save({ attributes }) {

	// Fonctions utilitaires
	const getDaysInCurrentMonth = () => {
		const date = new Date();
		return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
	};

	const getStartDayOfCurrentMonth = () => {
		const date = new Date();
		return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
	};

	const getDayName = (index) => {
		const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		return days[index];
	};


	const handleClick = (day) => {
		const slots = attributes[day];
		if (slots && slots.length > 0) {
		//	createModalForSlots(slots);
			console.log('click')
			alert(`Available slots for ${day}: ${slots.join(', ')}`);
		}
	};

	// Variables pour générer le calendrier
	const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
	const monthDays = getDaysInCurrentMonth();
	const startDay = getStartDayOfCurrentMonth();
	const today = new Date();

	const days = Array(monthDays).fill().map((_, dayIndex) => {
		const dayNumber = dayIndex + 1;
		const dayName = getDayName((startDay + dayIndex) % 7);

		const isToday = (today.getDate() === dayNumber && today.getMonth() === today.getMonth() && today.getFullYear() === today.getFullYear());
		const slotsAvailable = attributes[dayName] && attributes[dayName].length > 0;

		if (isToday) {
			if (slotsAvailable) {
				return (
					<td key={dayNumber} className="booking67-day booking67-day-available" data-dayname={dayName}>
						<a href="#">{dayNumber}</a>
					</td>
				);
			} else {
				return <td key={dayNumber} className="booking67-day booking67-today">{dayNumber}</td>;
			}
		} else if (slotsAvailable) {
			return (
				<td
					key={dayNumber}
					className="booking67-day booking67-day-available"
					data-dayname={dayName}
					data-slots={attributes[dayName].join(',')} // Si vous stockez les créneaux horaires en tant que tableau
				>
					<a href="#">{dayNumber}</a>
				</td>
			);
		} else {
			return <td key={dayNumber} className="booking67-day">{dayNumber}</td>;
		}
	});

	return (
		<table className="booking67-calendar">
			<thead>
			<tr>
				{daysOfWeek.map(day => <th key={day}>{day}</th>)}
			</tr>
			</thead>
			<tbody>
			{/* Supposant que vous avez 5 semaines pour simplifier. Dans une vraie implémentation, cela pourrait varier */}
			{Array(5).fill().map((_, weekIndex) => (
				<tr key={weekIndex}>
					{days.slice(weekIndex * 7, weekIndex * 7 + 7)}
				</tr>
			))}
			</tbody>
		</table>
	);
}
