import './App.css';
import {SelectionProvider, SelectionContext} from './components/scripts/SelectionContext';

import WeeklyPlanner from './components/weeklyPlanner';
import HumanRessourcesform from "./components/humanRessourcesform";
import GenericOptionsAdder from "./components/GenericOptionsAdder";
import PrestationForm from "./components/PrestationForm";
import OptionsComponent from "./components/OptionsComponent";

function App({page}) {
    console.log('App executed, page:', page);
    if (page === 'main') {
        return <OptionsComponent/>;
    } else if (page === 'disponibilites') {
        return (<SelectionProvider>
            <WeeklyPlanner/>
        </SelectionProvider>);
    } else if (page === 'personnel') {
        return <HumanRessourcesform/>;
    }else if (page === 'prestations') {
        return <PrestationForm/>;
    }

    return null;
}


export default App;

