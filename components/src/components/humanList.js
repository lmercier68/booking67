
/*
composant affichant la liste du personnel actif ainsi que les inactifs
 */
import React, {useState,useEffect} from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import ActiveHumans from './activeHumans';
import InactiveHumans from './InactiveHumans';

function HumanList() {

    const [inactiveUsers, setInactiveUsers] = useState([]);
    const [activeUsers, setActiveUsers] = useState([]);

    useEffect(() => {
        fetch('/wp-json/booking67/v1/human_ressources_actif', {  // Ajustez l'URL en fonction de votre API
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                setActiveUsers(data);
               // setLoading(false); plus de loader pour le moment
            })
            .catch(error => console.error('Error fetching active users:', error));
    }, []);
    useEffect(() => {
        fetch('/wp-json/booking67/v1/human_ressources_inactif', {  // Ajustez l'URL en fonction de votre API
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                setInactiveUsers(data);
                //setLoading(false); plus de loader pour le moment
            })
            .catch(error => console.error('Error fetching inactive users:', error));
    }, []);
    const handleDragEnd = (result) => {
        const { source, destination } = result;

        // Vérifiez si l'élément a été déposé en dehors d'une liste valide
        if (!destination) {
            return;
        }

        // Vérifiez si l'élément a été déplacé à la même position dans la même liste
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        // TODO: Mettez à jour les états pour refléter le déplacement

        if (source.droppableId === "active" && destination.droppableId === "inactive") {
            const movedUser = activeUsers[source.index];
            setActiveUsers(prev => prev.filter((_, index) => index !== source.index));
            setInactiveUsers(prev => [...prev, movedUser]);
        } else if (source.droppableId === "inactive" && destination.droppableId === "active") {
            const movedUser = inactiveUsers[source.index];
            setInactiveUsers(prev => prev.filter((_, index) => index !== source.index));
            setActiveUsers(prev => [...prev, movedUser]);
        }

        if (result.destination.droppableId === "active") {
            updateUserStatus(result.draggableId, 1);
        } else if (result.destination.droppableId === "inactive") {
            updateUserStatus(result.draggableId, 0);
        }
    };
    function updateUserStatus(userId, stat) {
        console.log(' tentative de mise a jour de Id:  ', userId);
        fetch('/wp-json/booking67/v1/update_human_ressources_status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: userId,
                actif: stat
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status !== "success") {
                    console.error("Failed to update user status");
                }
                else { console.log(' donnée personnel mise a jour')}
            })
            .catch(error => {
                console.error("Error:", error);
            });
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
                <div style={{ flex: 1, marginRight: '10px' }}>
                    <ActiveHumans users={activeUsers} setUsers={setActiveUsers} />
                </div>
                <div style={{ flex: 1, marginLeft: '10px' }}>
                    <InactiveHumans users={inactiveUsers} setUsers={setInactiveUsers} />
                </div>
            </div>
        </DragDropContext>
    );
}

export default HumanList;