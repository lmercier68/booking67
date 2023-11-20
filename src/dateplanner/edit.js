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
import { CheckboxControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { apiFetch } from '@wordpress/data-controls';
import { Button } from '@wordpress/components';
export default function Edit( props ) {
	const { attributes, setAttributes } = props;


		const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

		const timeslots = Array.from({ length: 48 }).map((_, index) => {
			const hours = Math.floor(index / 2);
			const minutes = (index % 2) === 0 ? '00' : '30';
			return `${String(hours).padStart(2, '0')}:${minutes}`;
		});
	function saveTimesToDatabase() {
		apiFetch({
			path: '/booking67/v1/save-times',
			method: 'POST',
			data: {
				times: attributes, // Cela enverra tous les jours et leurs créneaux horaires respectifs
			}
		}).then(response => {
			if (response.success) {
				alert('Créneaux horaires enregistrés avec succès.');
			} else {
				alert('Erreur lors de l\'enregistrement des créneaux horaires.');
			}
		});
	}
		return (
			<div>
				<table className="time-slot-table">
					<thead>
					<tr>
						<th>Time Slot</th>
						{daysOfWeek.map(day => <th key={day}>{day}</th>)}
					</tr>
					</thead>
					<tbody>
					{timeslots.map(slot => (
						<tr key={slot}>
							<td>{slot}</td>
							{daysOfWeek.map(day => (
								<td key={day}>
									<CheckboxControl
										checked={attributes[day] && attributes[day].includes(slot)}
										onChange={(isChecked) => {
											const updatedSlots = attributes[day] || [];
											if (isChecked) {
												updatedSlots.push(slot);
											} else {
												const index = updatedSlots.indexOf(slot);
												if (index > -1) {
													updatedSlots.splice(index, 1);
												}
											}
											setAttributes({ [day]: updatedSlots });
										}}
									/>
								</td>
							))}
						</tr>
					))}
					</tbody>
				</table>
			</div>
		);
	}
