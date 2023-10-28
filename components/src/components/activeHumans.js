import React, { useState, useEffect } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

function ActiveHumans({ users, setUsers }) {
 //   const [activeUsers, setActiveUsers] = useState([]);
    const [loading, setLoading] = useState(false); // modifier a true si mise en place du loader
/*
    useEffect(() => {
        fetch('/wp-json/booker67/v1/human_ressources_actif', {  // Ajustez l'URL en fonction de votre API
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                setActiveUsers(data);
                setLoading(false);
            })
            .catch(error => console.error('Error fetching active users:', error));
    }, []);
*/
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Personnel actif</h2>
            <Droppable droppableId="active">
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

export default ActiveHumans;