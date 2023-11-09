import { useState } from '@wordpress/element';
import { SelectionProvider, SelectionContext } from './components/scripts/SelectionContext';

import WeeklyPlanner from './components/weeklyPlanner';
export default function Edit({ attributes, setAttributes }) {

	return (
		<div>
			<SelectionProvider>
			<WeeklyPlanner />
			</SelectionProvider>

		</div>
	);
}
