import React, { useState, useEffect } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
function InactiveHumans({ users, setUsers }) {
  //  const [inactiveUsers, setInactiveUsers] = useState([]);
    const [loading, setLoading] = useState(false); // modifier a true si mise en place du loader
/*
    useEffect(() => {
        fetch('/wp-json/booking67/v1/human_ressources_inactif', {  // Ajustez l'URL en fonction de votre API
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                setInactiveUsers(data);
                setLoading(false);
            })
            .catch(error => console.error('Error fetching inactive users:', error));
    }, []);
*/
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Personnel inactif</h2>
            <Droppable droppableId="inactive">
                {(provided) => (
                    <ul ref={provided.innerRef} {...provided.droppableProps}>
                        {users.map((user, index) => (
                            <Draggable key={user.id} draggableId={String(user.id)} index={index}>
                                {(provided) => (
                                    <li
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        {user.nom} {user.prenom} - {user.role}
                                    </li>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </ul>
                )}
            </Droppable>
        </div>
    );
}

export default InactiveHumans;
