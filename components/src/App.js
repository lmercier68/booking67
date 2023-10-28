
import './App.css';
import { SelectionProvider, SelectionContext } from './components/scripts/SelectionContext';

import WeeklyPlanner from './components/weeklyPlanner';
import HumanRessourcesform from "./components/humanRessourcesform";
function App({ page }) {
    console.log('App executed, page:', page);
    if (page === 'main') {
        return <HumanRessourcesform/>;
    } else if (page === 'disponibilites') {
        console.log('disponibilities page')
        return (<SelectionProvider>
            <WeeklyPlanner />
        </SelectionProvider>);
    } else if (page === 'personnel') {
        return <HumanRessourcesform />;
    }

    return null;
}


export default App;

